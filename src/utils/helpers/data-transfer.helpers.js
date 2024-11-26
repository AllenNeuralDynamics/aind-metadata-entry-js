import { utcToLocal } from '@rjsf/utils'

function postProcessJobRequestFormData (formData, schemaType) {
  if (schemaType === 'BasicUploadJobConfigs') {
    const { acq_datetime: acqDateTime } = formData
    // User selected acq_datetime as local tz, but it is stored as utc
    // Convert acq_datetime back to local datetime, remove timezone info and fractional seconds
    formData.acq_datetime = utcToLocal(acqDateTime).split('.')[0]
  } else if (schemaType === 'SubmitJobRequest') {
    const { upload_jobs: uploadJobs } = formData
    uploadJobs.forEach(job => postProcessJobRequestFormData(job, 'BasicUploadJobConfigs'))
  }
}

/**
 * Sends formData to aind-data-transfer-service for Pydantic validation
 * @param {*} formData - The form data to validate.
 */
export async function validateToServer (formData, schemaType) {
  postProcessJobRequestFormData(formData, schemaType)
  // Send formData to server for Pydantic validation
  const validationUrl = `/api/v1/models/${schemaType}/validate`
  const response = await fetch(
    process.env.REACT_APP_DATA_TRANSFER_SERVICE_URL + validationUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }
  )
  const data = await response.json()
  console.log(data)
  if (response.status !== 200) {
    throw new Error(data.message + ': ' + data.data.errors)
  }
}

export async function submitJobsToServer (formData, schemaType) {
  postProcessJobRequestFormData(formData, schemaType)
  console.log(formData)
  // Submit formData to server
  const response = await fetch(
    process.env.REACT_APP_DATA_TRANSFER_SERVICE_URL + '/api/v1/submit_jobs',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }
  )
  const data = await response.json()
  console.log(data)
  if (response.status !== 200) {
    throw new Error(data.message + ': ' + data.data.errors)
  }
}
