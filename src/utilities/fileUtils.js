/**
 * Opens file browser and reads JSON data from user-selected local file
 * @returns {Object} The file data as a JSON object
 */
export async function readFromJSONFile () {
  const [fileHandle] = await window.showOpenFilePicker({ types: [{ accept: { 'application/json': ['.json'] } }] })
  const file = await fileHandle.getFile()
  const fileData = await file.text()
  return JSON.parse(fileData)
}
