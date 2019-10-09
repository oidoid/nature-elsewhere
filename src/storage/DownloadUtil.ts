export namespace DownloadUtil {
  export function download(
    doc: Document,
    filename: string,
    data: string
  ): void {
    const blob = new Blob([data], {type: 'application/json'})
    var link = doc.createElement('a')
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.download = filename
    doc.body.appendChild(link)
    link.click()
    doc.body.removeChild(link)
  }
}
