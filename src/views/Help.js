import React from 'react'
import Config from '../utils/config'
import { LinkButton } from '../components/inputs'
import { Header } from '../components/layout'

/**
 * Component to display About/Help information
 */
function Help () {
  return (
    <div>
      <Header
        titleClassName="h2 text-primary"
        title='Help'
        subtitle={
          <div>
            Use this tool to submit job requests to&nbsp;
            <LinkButton url={Config.AIND_DATA_TRANSFER_SERVICE_REPO_URL} text='aind-data-transfer-service' />
            &nbsp;&#40;<LinkButton url={Config.AIND_DATA_TRANSFER_SERVICE_READTHEDOCS_URL} text='readthedocs' />&#41;.
            <ul>
              <li>Select a schema from the dropdown. The latest version will be loaded as a fillable form.</li>
              <li>Or, use the &apos;Autofill from file&apos; button to load an existing job configuration file (must be JSON).</li>
              <li>Click &apos;Validate&apos; to validate your submission, or &apos;Save to file&apos; to save the job configs as a JSON file to your device.</li>
              <li>Click &apos;Submit to server&apos; to submit your job request to aind-data-transfer-service</li>
              <li>View submitted jobs in the <LinkButton url={process.env.REACT_APP_DATA_TRANSFER_SERVICE_URL + '/jobs'} text='Job Status'/> page.
              </li>
            </ul>
          </div>
        }
      />
    </div>
  )
}

export default Help
