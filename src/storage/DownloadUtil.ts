export namespace DownloadUtil {
  export function download(
    doc: Document,
    filename: string,
    data: string,
    type: string // E.g., 'application/json'.
  ): void {
    const link = doc.createElement('a')
    link.style.display = 'none'
    const blob = new Blob([data], {type})
    link.href = URL.createObjectURL(blob)
    link.download = filename
    doc.body.appendChild(link)
    link.click()
    doc.body.removeChild(link)
  }
}
