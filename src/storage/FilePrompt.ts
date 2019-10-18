export namespace FilePrompt {
  export function downloadString(
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

  export function uploadString(
    doc: Document,
    type: string // E.g., 'application/json'.
  ): Promise<{file: File; data: string}> {
    return new Promise((resolve, reject) => {
      const input = doc.createElement('input')
      input.style.display = 'none'
      input.type = 'file'
      input.accept = type
      input.onchange = () => {
        const file = input.files && input.files[0]
        if (!file) {
          reject()
          return
        }

        const reader = new FileReader()
        reader.onload = event =>
          event.target && event.target.result
            ? resolve({file, data: event.target.result.toString()})
            : reject()
        reader.readAsText(file)
      }
      doc.body.appendChild(input)
      input.click()
      doc.body.removeChild(input)
    })
  }
}
