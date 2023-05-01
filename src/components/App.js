import React, {useState} from "react";
import RenderForm from "./RenderForm";
import Dropdown from "./Dropdown";
import RehydrateForm from "./RehydrateForm";
import {preProcessing} from '../utilities/schemaHandlers';
import { fetchSchemasfromS3, findLatestSchemas } from "../utilities/schemaFetchers";

export default function App(props) {
    /*
    Application to display a dropdown menu of schemas.
        Fetches schema objects from s3
        Creates schema objects from filepaths
        Maps schemas to corresponding labels (string) in options (list)
        Renders dropdown menu with options
        Gives user the option to autofill the form with previously input data
     */

    const [value, setValue] = useState('');
    const [data, setData] = useState(null);
    const [schema, setSchema] = useState('');


    const callbackFunction = async (childData) => { 
        /**
         * Method to retrieve list of all schema paths from S3 and
         * fetch the user-selected schema into state
         */
        const schemaList = await fetchSchemasfromS3()
        const latestSchemas = findLatestSchemas(schemaList)
        const schemaURL = latestSchemas[childData].path
        await fetchAndSetSchema(schemaURL, childData)

    }

    const handleRehydrate =  async () => { 
        /**
         * Method to put the user-selected schema into state
         */
        const data = await RehydrateForm()
        setData(data)
    }

    const fetchAndSetSchema = async (url, value) => {
        /**
         * Method to put the user-selected schema into state
         * defaults to latest schema version
         */
        try {
            const response = await fetch(process.env.REACT_APP_S3_URL+'/'+url);
            const schema = await response.json();
            const processedSchema = await schema ? preProcessing(schema) : undefined;
            setSchema(processedSchema);
            setValue(value);
            
        } catch (error) {}
    }

    return (
        <div>
            <h1> AIND Metadata Entry </h1>
            <button onClick={handleRehydrate}>Autofill Form with Existing Data</button>
            <div>
                 < Dropdown parentCallback={callbackFunction} />
            </div>
            <div>
                <RenderForm schema={schema} data={data} value={value}/> 
           </div>
        </div>
    );
};
