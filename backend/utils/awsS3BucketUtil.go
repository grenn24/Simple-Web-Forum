package utils

//Clients for making request to aws simple storage service

import (
	"fmt"
	"io"
	_ "io"
	"mime/multipart"
	"net/url"
	"os"
	"strings"
	"sync"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/grenn24/simple-web-forum/dtos"
)

// Region is predefined
func CreateSession() (*session.Session, error) {
	credentials := credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS_KEY"), os.Getenv("AWS_SECRET_ACCESS_KEY"), "")
	session, err := session.NewSession(&aws.Config{
		Region:      aws.String("ap-southeast-2"),
		Credentials: credentials,
	})

	return session, err
}

// Upload file to s3 bucket and specify file and folder names (returns public file url on successful upload)
func PostFileToS3Bucket(filename string, folder string, file io.Reader) (string, error) {
	session, err := CreateSession()
	if err != nil {
		return "", err
	}
	// Create an uploader
	uploader := s3manager.NewUploader(session)
	uploadInput := &s3manager.UploadInput{
		Bucket: aws.String(os.Getenv("AWS_S3_BUCKET")),
		Key:    aws.String(fmt.Sprintf("%v/%v", folder, filename)),
		Body:   file,
	}
	// Upload with custom option params
	result, err := uploader.Upload(uploadInput, func(uploader *s3manager.Uploader) {
		uploader.Concurrency = 10            // Max no. of goroutines used to send each part
		uploader.PartSize = 10 * 1024 * 1024 // Buffer size of 10mb for each part
		uploader.LeavePartsOnError = true
	})
	if err != nil {
		return "", err
	}

	return result.Location, nil
}

// Autogenerate filenames using fileheader struct from formdata and post to the specified folder in s3 (returns public file url on successful upload)
func PostFileHeaderToS3Bucket(fileHeader *multipart.FileHeader, folder string) (string, error) {
	filename, file, err := ConvertFileHeaderToFile(fileHeader)
	if err != nil {
		return "", err
	}
	defer file.Close()
	url, err := PostFileToS3Bucket(filename, folder, file)
	if err != nil {
		return "", err
	}
	return url, nil
}

// Post a slice of fileheaders to the specified folder in s3 (returns a slice public file urls on successful upload)
// Error from the goroutines is collected in a channel, and the first error is returned
func PostFileHeadersToS3Bucket(fileHeaders []*multipart.FileHeader, folder string, progressChannel chan float64, errorChannel chan *dtos.Error) []string {
	// If image(s) were attached, upload to s3 and retrieve the string array of links (using goroutines)
	urls := make([]string, 0)
	var urlsMutex sync.Mutex
	fmt.Println("starting to post images")
	var totalSize int
	for _, fileHeader := range fileHeaders {
		totalSize += int(fileHeader.Size)
	}
	var totalBytesRead int
	var totalBytesReadMutex sync.Mutex

	// Start a waitgroup for goroutines
	var wg sync.WaitGroup

	for _, fileHeader := range fileHeaders {
		//Add a goroutine to the waitgroup
		wg.Add(1)
		go func(image *multipart.FileHeader) {
			//At the end of execution, remove the goroutine from waitgroup
			defer wg.Done()
			filename, file, err := ConvertFileHeaderToFile(fileHeader)
			if err != nil {
				errorChannel <- &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}
				return
			}
			defer file.Close()
			fileReader := CreateReaderWithProgress(file, int(fileHeader.Size), func(bytesRead int) {
				
				progress := float64(totalBytesRead) / float64(totalSize) * 95
				progressChannel <- progress
				fmt.Println(progress)
				totalBytesReadMutex.Lock()
				totalBytesRead += bytesRead
				totalBytesReadMutex.Unlock()
				
				
			})
			url, err := PostFileToS3Bucket(filename, "thread_image", fileReader)
			if err != nil {
				errorChannel <- &dtos.Error{
					Status:    "error",
					ErrorCode: "INTERNAL_SERVER_ERROR",
					Message:   err.Error(),
				}
				return
			}
			urlsMutex.Lock()
			urls = append(urls, url)
			urlsMutex.Unlock()
		}(fileHeader)
	}

	// Wait for all goroutines to finish
	wg.Wait()
	fmt.Println("images posted")
	return urls
}

// Delete file using its object url link (more useful to use urls since its stored in db)
func DeleteFileFromS3Bucket(link string) error {
	session, err := CreateSession()
	if err != nil {
		return err
	}
	url, err := url.Parse(link)
	if err != nil {
		return err
	}

	key := strings.TrimPrefix(url.Path, "/")

	batcher := s3manager.NewBatchDelete(session)

	objects := []s3manager.BatchDeleteObject{
		{
			Object: &s3.DeleteObjectInput{
				Key:    &key,
				Bucket: aws.String(os.Getenv("AWS_S3_BUCKET")),
			},
		},
	}

	err = batcher.Delete(aws.BackgroundContext(), &s3manager.DeleteObjectsIterator{
		Objects: objects,
	})
	if err != nil {
		return err
	}
	return err
}
