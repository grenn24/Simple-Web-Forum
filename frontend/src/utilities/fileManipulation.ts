import imageCompression from "browser-image-compression";

export function generateFileURL(file: File | null, timeout: number = 3000) {
	const url = file ? URL.createObjectURL(file) : "";
	// Release memory associated with url shortly after it is opened
	setTimeout(() => URL.revokeObjectURL(url), timeout);
	return url;
}

export function openFileInNewWindow(file: File) {
	const url = generateFileURL(file);
	console.log(url);
	window.open(url);
}

// Returns a promise
export async function compressImageFile(
	file: File,
	maxSize: number = 4
): Promise<File> {
	const options = {
		maxSizeMB: maxSize,
		//maxWidthOrHeight: 1920,
		useWebWorker: true,
	};
	try {
		// Wait for promise to be resolved before returning
		const compressedBlob = await imageCompression(file, options);
		const compressedFile = new File([compressedBlob], file.name, {
			type: file.type,
			lastModified: file.lastModified,
		});
		return compressedFile;
	} catch (error) {
		throw error;
	}
}

// Returns a promise
export async function compressImageFiles(
	files: File[],
	maxSize: number = 4
): Promise<File[]> {
	const options = {
		maxSizeMB: maxSize,
		//maxWidthOrHeight: 1920,
		useWebWorker: true,
	};
	try {
		const promises = files.map(async (file) => {
			const compressedBlob = await imageCompression(file, options);
			// convert blob back to file
			const compressedFile = new File([compressedBlob], file.name, {
				type: file.type,
				lastModified: file.lastModified,
			});
			return compressedFile;
		});
		// Wait for all the promises to resolve before returning
		const compressedFiles = await Promise.all(promises);

		return compressedFiles;
	} catch (error) {
		throw error;
	}
}

export async function cacheImageUrl(
	imageUrl: string
): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		try {
			const image = new Image();
			image.src = imageUrl;
			image.onload = () => resolve(image);

			image.onerror = (err) => reject(err);
		} catch (error) {
			reject(error);
		}
	});
}

export async function cacheImageUrls(
	imageUrls: string[]
): Promise<HTMLImageElement[]> {
	try {
		const promises = imageUrls.map((url) => cacheImageUrl(url));
		const images = await Promise.all(promises);
		return images;
	} catch (error) {
		throw error;
	}
}
