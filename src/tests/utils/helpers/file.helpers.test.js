import { readFromJSONFile } from '../../../utils/helpers/file.helpers'

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
