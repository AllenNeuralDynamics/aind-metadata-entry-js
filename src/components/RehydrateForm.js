import 'bootstrap/dist/css/bootstrap.min.css'

export default async function RehydrateForm (props) {
  /*
    Function to open file browser and read JSON data from local file
        Uses file system access API to access local files
        Returns pre-existing data (JSON object)
    */
  let fileHandle
  let formData = null

  async function getData () {
    /*
        File system access API to fetch metadata
        */
    [fileHandle] = await window.showOpenFilePicker({ types: [{ accept: { 'application/json': ['.json'] } }] })
    const file = await fileHandle.getFile()
    const contents = await file.text()
    return contents
  }

  formData = await getData()
  return JSON.parse(formData)
}
