import React, {useState, useEffect} from "react";
import RenderForm from "./RenderForm";
import RehydrateForm from "./RehydrateForm";
import {preProcessing} from '../utilities/schemaHandlers';
import { fetchSchemasfromS3, findLatestSchemas } from "../utilities/schemaFetchers";
import Dropdowns from "./Dropdowns";

export default function App(props) {
    /*
    Application to display a dropdown menu of schemas.
        Fetches schema objects from s3
        Creates schema objects from filepaths
        Renders dropdown menu with options
        Gives user the option to autofill the form with previously input data
     */
    const [data, setData] = useState(null);
    const [schema, setSchema] = useState('');
    const [selectedSchemaType, setSelectedSchemaType] = useState('');
    const [selectedSchemaVersion, setSelectedSchemaVersion] = useState('');

    const [schemaList, setSchemaList] = useState([]);

    useEffect(() => {
        async function fetchSchemaList () {
            /*
            Method to retrieve list of schema links from aws s3 bucket
            UseEffect hook so that dropdowns can be rendered from list
            */
            const schema_links = await fetchSchemasfromS3()
            setSchemaList(schema_links)
        }
        fetchSchemaList();
    }, []);
    
    const typeCallbackFunction = async (childData) => { 
        /**
         * Method to retrieve user-selected schema and
         * defaults form to latest version.
         */
        setSelectedSchemaType(childData)
        const latestSchemas = findLatestSchemas(schemaList)
        const schemaURL = latestSchemas[childData].path
        await fetchAndSetSchema(schemaURL, childData)
    }

    const versionCallbackFunction = async (childData) => {
        /**
         * Method to retrieve user-selected schema version
         * and replace default form to selected version.
         */
        setSelectedSchemaType(selectedSchemaType)
        setSelectedSchemaVersion(childData)
        const schemaURL = schemaList.find(url => 
            url.includes(selectedSchemaType) && url.includes(childData)
            )
        await fetchAndSetSchema(schemaURL)
    }

    const handleRehydrate =  async () => { 
        /**
         * Method to put the user-selected data into state
         */
        const data = await RehydrateForm()
        const version = data.schema_version
        console.log(selectedSchemaType)
/*         const schemaURL = schemaList.find(url =>
            url.includes(selectedSchemaType) && url.includes(version))
        await fetchAndSetSchema(schemaURL) */
        setData(data)
    }

    const fetchAndSetSchema = async (url) => {
        /**
         * Method to put the user-selected schema into state
         * defaults to latest schema version
         */
        try {
            const response = await fetch(process.env.REACT_APP_S3_URL+'/'+url);
            const schema = await response.json();
            const processedSchema = await schema ? preProcessing(schema) : undefined;
            setSchema(processedSchema);
            setSelectedSchemaType(selectedSchemaType)
        } catch (error) {}
    }

    return (
        <div>
            <h1> AIND Metadata Entry </h1>
            <button onClick={handleRehydrate}>Autofill Form with Existing Data</button>
            <div>
                < Dropdowns 
                    ParentTypeCallback={typeCallbackFunction}
                    ParentVersionCallback={versionCallbackFunction}
                    schemaList={schemaList}/>
            </div>
            <div>
                <RenderForm schema={schema} data={data} selectedSchemaType={selectedSchemaType}/> 
           </div>
        </div>
    );
};
