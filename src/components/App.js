import React, {useState} from "react";
import RenderForm from "./RenderForm";
import Dropdown from "./Dropdown";

export default function App(props) {
    /*
    Application to display a dropdown menu of schemas.
        Creates schema objects from filepaths
        Maps schemas to corresponding labels (string) in options (list)
        Renders dropdown menu with options
     */

    const [value, setValue] = useState('');

    const callbackFunction = (childData) => {
        /**
         * Method to put the selected user-schema into state
         */
        setValue(childData);
    }

    return (
        <div>
            <h1> AIND Metadata Entry </h1>
            <body>
            < Dropdown parentCallback={callbackFunction} />
            </body>
            <body>
           <RenderForm schema={value} />
           </body>
        </div>
    );
};
