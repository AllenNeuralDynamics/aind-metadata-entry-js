describe('config', () => {
  it('has all required properties', () => {
    const Config = require('./config').default
    expect(Config.REPO_URL).toBeDefined()
    expect(Config.AIND_DATA_SCHEMA_REPO_URL).toBeDefined()
  })
})
