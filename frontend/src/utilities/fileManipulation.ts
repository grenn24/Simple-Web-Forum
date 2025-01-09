export function generateFileURL(file: File | null, timeout  : number=2000) {
    const url = file ? URL.createObjectURL(file) : "";
    // Release memory associated with url shortly after it is opened
    setTimeout(()=>URL.revokeObjectURL(url),timeout)
    return url
}

export function openFileInNewWindow(file: File) {
    const url = generateFileURL(file)
    window.open(url)
}