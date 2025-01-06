package utils

//Clients for making request to aws simple storage service

import (
	"fmt"
	"mime/multipart"
	"net/url"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
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

// Upload file to s3 bucket is form data's file header and custom folder name (returns url on successful upload)
func PostFileToS3Bucket(folder string, fileHeader *multipart.FileHeader) (string, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return "", err
	}
	defer file.Close()
	session, err := CreateSession()
	if err != nil {
		return "", err
	}
	// Create an uploader
	uploader := s3manager.NewUploader(session)
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(os.Getenv("AWS_S3_BUCKET")),
		Key:    aws.String(fmt.Sprintf("%v/%v", folder, fileHeader.Filename)),
		Body:   file,
	})
	if err != nil {
		return "", err
	}
	return result.Location, nil
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
	if err != nil {
		return err
	}

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
