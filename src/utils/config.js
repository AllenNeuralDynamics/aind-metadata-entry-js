const Config = {
  REPO_URL: 'https://github.com/AllenNeuralDynamics/aind-metadata-entry-js',
  AIND_DATA_SCHEMA_REPO_URL: 'https://github.com/AllenNeuralDynamics/aind-data-schema',
  AIND_DATA_SCHEMA_READTHEDOCS_URL: 'https://aind-data-schema.readthedocs.io/en/latest/',
  REACT_APP_FILTER_VERSIONS: {
    rig: ['1.0.0']
  },
  AJV_OPTIONS: {
    ajvOptionsOverrides: {
      discriminator: true
    }
  },
  AIND_DATA_TRANSFER_SCHEMAS: [
    { type: 'SubmitJobRequest', version: 'latest', path: 'api/v1/models/SubmitJobRequestForm/schema' }
  ]
}

export default Config
