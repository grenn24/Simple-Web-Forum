package utils

import (
	"image"
	"image/gif"
	"image/jpeg"
	_ "image/png"
	_ "io"
	"mime/multipart"
	"os"
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

// Returns a filename and io reader from the file header
func ConvertFileHeaderToFile(fileHeader *multipart.FileHeader) (string, *multipart.File, error) {
	file, err := fileHeader.Open()
	if err != nil {
		return "", nil, err
	}

	return fileHeader.Filename, &file, nil
}
