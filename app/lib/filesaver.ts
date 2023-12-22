// https://stackoverflow.com/a/30832210
// Function to download data to a file
const saveAs = (data: Blob, filename: string) => {
  if ((window.navigator as any).msSaveOrOpenBlob)
    // IE10+
    (window.navigator as any).msSaveOrOpenBlob(data, filename)
  else {
    // Others
    let a = document.createElement('a'),
      url = URL.createObjectURL(data)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function () {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }
}

export { saveAs }
