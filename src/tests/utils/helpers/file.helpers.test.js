import { toast } from 'react-toastify'
import {
  readFromJSONFile,
  saveToJSONFile
} from '../../../utils/helpers/file.helpers'

const FILE_DATA = { test: 'data' }
const EXPECTED_TYPE_OPTIONS = [{ accept: { 'application/json': ['.json'] } }]

describe('readFromJSONFile', () => {
  it('read file contents from JSON files', async () => {
    // mock file system access APIs
    const fileHandle = {
      getFile: jest.fn().mockResolvedValue({
        text: jest.fn().mockResolvedValue(JSON.stringify(FILE_DATA))
      })
    }
    window.showOpenFilePicker = jest.fn().mockResolvedValue([fileHandle])

    const data = await readFromJSONFile()
    expect(window.showOpenFilePicker).toHaveBeenCalledWith({ types: EXPECTED_TYPE_OPTIONS })
    expect(data).toEqual(FILE_DATA)
  })
})

describe('saveToJSONFile', () => {
  it('saves data to JSON file', async () => {
    // mock file system access APIs
    const writer = {
      write: jest.fn().mockResolvedValue(),
      close: jest.fn().mockResolvedValue()
    }
    const handle = {
      createWritable: jest.fn().mockResolvedValue(writer)
    }
    window.showSaveFilePicker = jest.fn().mockResolvedValue(handle)

    const data = { test: 'data' }
    const filename = 'test'
    await saveToJSONFile(data, filename)
    expect(window.showSaveFilePicker).toHaveBeenCalled()
    expect(writer.write).toHaveBeenCalledWith(new Blob([JSON.stringify(data, undefined, 4)], { type: 'text/plain' }))
    expect(writer.close).toHaveBeenCalled()
  })

  it('displays error message if file save fails', async () => {
    // mock file system access APIs and toast notification
    const writer = {
      write: jest.fn().mockRejectedValue(new Error('write error'))
    }
    const handle = {
      createWritable: jest.fn().mockResolvedValue(writer)
    }
    window.showSaveFilePicker = jest.fn().mockResolvedValue(handle)
    const toastSpy = jest.spyOn(toast, 'error')
    const data = { test: 'data' }
    const filename = 'test'
    await saveToJSONFile(data, filename)
    expect(window.showSaveFilePicker).toHaveBeenCalled()
    expect(writer.write).toHaveBeenCalledWith(new Blob([JSON.stringify(data, undefined, 4)], { type: 'text/plain' }))
    expect(toastSpy).toHaveBeenCalledWith('Error saving file. Please try again.')
  })

  it('dismisses error message if error is caused by user abort', async () => {
    // mock file system access APIs and toast notification
    const writer = {
      write: jest.fn().mockRejectedValue(new DOMException('AbortError', 'AbortError'))
    }
    const handle = {
      createWritable: jest.fn().mockResolvedValue(writer)
    }
    window.showSaveFilePicker = jest.fn().mockResolvedValue(handle)
    const toastSpy = jest.spyOn(toast, 'error')
    const data = { test: 'data' }
    const filename = 'test'
    await saveToJSONFile(data, filename)
    expect(window.showSaveFilePicker).toHaveBeenCalled()
    expect(writer.write).toHaveBeenCalledWith(new Blob([JSON.stringify(data, undefined, 4)], { type: 'text/plain' }))
    expect(toastSpy).not.toHaveBeenCalled()
  })
})
