import React, {useState, useEffect} from "react";
import { toast } from 'react-toastify';
import RenderForm from "./RenderForm";
import RehydrateForm from "./RehydrateForm";
import {preProcessSchema} from '../utilities/schemaHandlers';
import { fetchSchemasfromS3, findLatestSchemas, filterSchemas } from "../utilities/schemaFetchers";
import Toolbar from "./Toolbar";
import styles from './App.module.css';

export default function App(props) {
    /*
    Application to display a dropdown menu of schemas.
        Fetches schema objects from s3
        Creates schema objects from filepaths
        Renders dropdown menu with options
        Gives user the option to autofill the form with previously input data
     */
    const appVersionMsg = props.appVersion ? `App version ${props.appVersion}` : null;
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
            const filtered_schemas = filterSchemas(schema_links)
            setSchemaList(filtered_schemas)
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
        setSelectedSchemaVersion(latestSchemas[childData].version)
        await fetchAndSetSchema(schemaURL, childData) 
    }

    const versionCallbackFunction = async (childData) => {
        /**
         * Method to retrieve user-selected schema version
         * and replace default form to selected version
         */
        setSelectedSchemaVersion(childData)
        const schemaURL = schemaList.find(url => 
            url.includes(selectedSchemaType) && url.includes(childData)
            )
        await fetchAndSetSchema(schemaURL)
    }

    const handleRehydrate =  async () => { 
        /**
         * Method to put the user-selected data into state
         * updates schema based on schema version in rehydrate file
         */
        const data = await RehydrateForm()
        const version = data.schema_version
        setSelectedSchemaVersion(version)
        const schemaURL = schemaList.find(url =>
            url.includes(selectedSchemaType) && url.includes(version))
        await fetchAndSetSchema(schemaURL)
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
            const processedSchema = await schema ? preProcessSchema(schema) : undefined;
            setSchema(processedSchema);
        } catch (error) {
            console.error(error);
            toast.error(`Unable to render ${url}`);
        }
    }

    return (
        <div>
            <div className={styles.titleSection}>
                <h1> AIND Metadata Entry </h1>
                <div>User-interface for metadata ingestion and validation. Use on Chrome or Edge. {appVersionMsg}</div>
            </div>
            <div className={styles.toolbarSection}>
                < Toolbar 
                    ParentTypeCallback={typeCallbackFunction}
                    ParentVersionCallback={versionCallbackFunction}
                    schemaVersion={selectedSchemaVersion}
                    schemaList={schemaList}
                    handleRehydrate={handleRehydrate}
                />
            </div>
            <div className={styles.formSection}>
                <RenderForm schema={schema} data={data} selectedSchemaType={selectedSchemaType}/> 
            </div>
        </div>
    );
};
