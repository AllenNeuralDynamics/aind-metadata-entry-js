import React, {useState} from "react";
import RenderForm from "./RenderForm";
import Dropdown from "./Dropdown";
import RehydrateForm from "./RehydrateForm";
import schema_map from '../utilities/constants';
import {preProcessing} from '../utilities/schemaHandlers';

export default function App(props) {
    /*
    Application to display a dropdown menu of schemas.
        Creates schema objects from filepaths
        Maps schemas to corresponding labels (string) in options (list)
        Renders dropdown menu with options
        Gives user the option to autofill the form with previously input data
     */

    const [value, setValue] = useState('');
    const [data, setData] = useState(null);
    const [schema, setSchema] = useState('');


    const callbackFunction = (childData) => { 
        /**
         * Method to put the user-selected schema into state
         */
        const schemaURL = (value in schema_map) ? schema_map[value] : undefined;
        setValue(childData);
        fetchSchema(schemaURL);
    }

    const handleRehydrate =  async () => { 
        const data = await RehydrateForm()
        setData(data)
    }

    const fetchSchema = async (url) => {
        try {
          const response = await fetch(url);
          const schema = await response.json();
          const processedSchema = await schema ? preProcessing(schema) : undefined;
          setSchema(processedSchema);
        } catch (error) {}
      };

    return (
        <div>
            <h1> AIND Metadata Entry </h1>
            <button onClick={handleRehydrate}>Autofill Form with Existing Data</button>
            <div>
                 < Dropdown parentCallback={callbackFunction} />
            </div>
            <div>
                <RenderForm schema={schema} data={data}/> 
           </div>
        </div>
    );
};
