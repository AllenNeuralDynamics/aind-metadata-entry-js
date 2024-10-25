import React from 'react'
import Config from '../utils/config'
import { LinkButton } from './layout/inputs'
import Header from './layout/Header'

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
            View or submit feedback to our <LinkButton url={Config.REPO_URL} text='GitHub repository' />:
            <div>
              <LinkButton url={`${Config.REPO_URL}/issues`} text='Issues (bugs or feature requests)' tooltip='View/submit bugs or feature requests' displayAsButton />
              <LinkButton url={`${Config.REPO_URL}/discussions`} text='Discussions' tooltip='View/submit discussions' displayAsButton />
            </div>
          </div>
        }
      />
      <br />
      <Header
        titleClassName="h4"
        title='Getting started'
        subtitle={
          <div>
            Use this tool to create metadata files based on&nbsp;
            <LinkButton url={Config.AIND_DATA_SCHEMA_REPO_URL} text='aind-data-schema' />
            &nbsp;&#40;<LinkButton url={Config.AIND_DATA_SCHEMA_READTHEDOCS_URL} text='readthedocs' />&#41;.
            <ul>
              <li>Select a schema from the dropdown. The latest version will be loaded as a fillable form.</li>
              <li>Or, use the &apos;Autofill from file&apos; button to load an existing metadata file (must be JSON).</li>
              <li>The submitted metadata will be validated and saved as a JSON file to your device.</li>
            </ul>
          </div>
        }
      />
    </div>
  )
}

export default Help
