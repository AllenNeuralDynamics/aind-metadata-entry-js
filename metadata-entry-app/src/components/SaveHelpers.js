import React from 'react'


class SaverHelpers extends React.Component {
    onSubmit = (event) => {
        /* 
        Saves the metadata as a json schema on client-server
        */
        alert("Saving filled schema as a json file.")
        var FileSaver = require('file-saver');
        const data = event.formData;
        const fileData = JSON.stringify(data);
        var blob = new Blob([fileData], {type: "text/plain"});
        const filename = this.schema.title
        console.log(filename)
        FileSaver.saveAs(blob, `${filename}.json`);
    };

    onSaveToState = (event) => {
        /* Saves metadata as an object into React State */
        this.setState(({formData: Object.assign({}, event.formData)}))
        console.log(this.formData);
    };
}

export default SaverHelpers