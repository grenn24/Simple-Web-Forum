package utils

import (
	_ "fmt"
	"image"
	"image/gif"
	"image/jpeg"
	_ "image/png"
	"io"
	_ "io"
	"mime/multipart"
	"os"
	"sync"
)

// Works for jpg, png and gif files
func CompressImage(inputFile multipart.File, quality int) (*os.File, error) {

	image, format, err := image.Decode(inputFile)
	if err != nil {
		return nil, err
	}
	// Create output file
	outputFile, err := os.Create("output." + format)
	if err != nil {
		return nil, err
	}

	if format == "jpeg" || format == "png" {
		err := jpeg.Encode(outputFile, image, &jpeg.Options{Quality: quality})
		if err != nil {
			return nil, err
		}
	}
	if format == "gif" {
		decodedGif, err := gif.DecodeAll(inputFile)
		if err != nil {
			return nil, err
		}
		err = gif.EncodeAll(outputFile, decodedGif)
		if err != nil {
			return nil, err
		}
	}
	// Ensure that the contents of the file is fully written to disk before exiting the function
	err = outputFile.Sync()
	if err != nil {
		return nil, err
	}
	return outputFile, err
}

// Returns a filename and io reader from the file header in a formdata http response
func ConvertFileHeaderToFile(fileHeader *multipart.FileHeader) (string, multipart.File, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return "", nil, err
	}

	return fileHeader.Filename, file, nil
}

// Custom implementation of io.reader interface that supports progress tracking
type ReaderWithProgress struct {
	Reader    io.Reader // original file reader
	BytesRead int
	Size      int // original size of file (in bytes)
	Progress  float64
	OnBytesRead func(int) // function to be called with bytes read as argument
	Mutex        sync.Mutex
}

func (rp *ReaderWithProgress) Read(p []byte) (int, error) {
	rp.Mutex.Lock()

	// Add the number of bytes read to the counter
	x, err := rp.Reader.Read(p)
	rp.BytesRead += x
	if rp.Size > 0 {
		rp.Progress = float64(rp.BytesRead) / float64(rp.Size) * 100
	}
	if rp.OnBytesRead != nil {
		rp.OnBytesRead(x)
	}

	rp.Mutex.Unlock()
	return x, err
}

// Constructor method for Readerwithprogress
func CreateReaderWithProgress(reader io.Reader, size int, onBytesRead func(int)) *ReaderWithProgress {
	return &ReaderWithProgress{Reader: reader, Size: size, OnBytesRead: onBytesRead}
}
