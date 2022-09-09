import React from 'react'

class SaverHelpers extends React.Component {
    onSubmit = (event,filename) => {
        alert("submitted")
        this.setState( { formData: Object.assign({}, event.formData) }, this.onSaveToPC)
        console.log(this.formData);
    }

    onSaveToPC = (filename) => {
        var FileSaver = require('file-saver');
        const fileData = JSON.stringify(this.state.formData);
        var blob = new Blob([fileData], {type: "text/plain"});
        FileSaver.saveAs(blob, `${filename}.json`);
    }
}

export default SaverHelpers