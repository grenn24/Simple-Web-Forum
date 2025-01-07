export function generateFileURL(file: File) {
    const url = URL.createObjectURL(file);
    // Release memory associated with url shortly after it is opened
    setTimeout(()=>URL.revokeObjectURL(url),2000)
    return url
}

export function openFileInNewWindow(file: File) {
    const url = generateFileURL(file)
    window.open(url)
}