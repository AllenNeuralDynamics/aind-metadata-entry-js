import React from 'react'

class SaverHelpers extends React.Component {
    onSubmit = (event) => {
        alert("submitted")
        this.setState(( { formData: Object.assign({}, event.formData) }))
        console.log(this.formData);
    }
    onSaveToPC = (event) => {
        var FileSaver = require('file-saver');
        const fileData = JSON.stringify(this.state.formData);
        var blob = new Blob([fileData], {type: "text/plain"})
        FileSaver.saveAs(blob, "testfilledform.json");
    }
}

export default SaverHelpers