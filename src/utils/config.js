const Config = {
  AIND_DATA_TRANSFER_SERVICE_REPO_URL: 'https://github.com/AllenNeuralDynamics/aind-data-transfer-models',
  AIND_DATA_TRANSFER_SERVICE_READTHEDOCS_URL: 'https://aind-data-transfer-service.readthedocs.io/en/latest/',
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
