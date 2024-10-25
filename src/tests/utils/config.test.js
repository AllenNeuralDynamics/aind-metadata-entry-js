import Config from '../../utils/config'

describe('config', () => {
  it('has all required properties', () => {
    expect(Config.REPO_URL).toBeDefined()
    expect(Config.AIND_DATA_SCHEMA_REPO_URL).toBeDefined()
  })
})
