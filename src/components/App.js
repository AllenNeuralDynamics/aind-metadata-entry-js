import React, {useState} from "react";
import RenderForm from "./RenderForm";
import Dropdown from "./Dropdown";
import RehydrateForm from "./RehydrateForm";

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

    const callbackFunction = (childData) => {
        /**
         * Method to put the user-selected schema into state
         */
        setValue(childData);
    }

    const handleRehydrate =  async () => { 
        const data = await RehydrateForm()
        setData(data)
    }

    return (
        <div>
            <h1> AIND Metadata Entry </h1>
            <button onClick={handleRehydrate}>Autofill Form with Existing Data</button>
            <div>
                 < Dropdown parentCallback={callbackFunction} />
            </div>
            <div>
                <RenderForm schema={value} data={data}/> 
           </div>
        </div>
    );
};
