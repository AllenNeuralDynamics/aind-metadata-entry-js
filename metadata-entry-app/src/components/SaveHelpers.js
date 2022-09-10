import React from 'react'


class SaverHelpers extends React.Component {
    onSubmit = (event, filename) => {
        /* 
        Saves the metadata as a json schema on client-server
    
        TODO: `${filename}.json` 
        when filename is passed a parameter in SampleForm, it auto-runs onSubmit without form being filled
        */
        alert("Saving filled schema as a json file.")
        var FileSaver = require('file-saver');
        const data = event.formData;
        const fileData = JSON.stringify(data);
        var blob = new Blob([fileData], {type: "text/plain"});
        FileSaver.saveAs(blob, "filledform.json");
    };

    onSaveToState = (event) => {
        /* Saves metadata as an object into React State */
        this.setState(({formData: Object.assign({}, event.formData)}))
        console.log(this.formData);
    };
}

export default SaverHelpers