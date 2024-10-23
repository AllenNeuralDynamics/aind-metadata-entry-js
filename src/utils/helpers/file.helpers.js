import { toast } from 'react-toastify'

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

/**
 * Opens file browser and saves JSON data to user-selected local file
 * @param {Object} data The file data to save
 * @param {string} filename The suggested filename
 */
export async function saveToJSONFile (data, filename) {
  try {
    const fileData = JSON.stringify(data, undefined, 4)
    const opts = {
      suggestedName: `${filename}.json`,
      types: [
        {
          description: 'JSON file',
          accept: { 'text/plain': ['.json'] }
        }
      ]
    }
    const handle = await window.showSaveFilePicker(opts)
    const writer = await handle.createWritable()
    await writer.write(new Blob([fileData], { type: 'text/plain' }))
    writer.close()
  } catch (error) {
    if (!(error instanceof DOMException && error.name === 'AbortError')) {
      toast.error('Error saving file. Please try again.')
    }
  }
}
