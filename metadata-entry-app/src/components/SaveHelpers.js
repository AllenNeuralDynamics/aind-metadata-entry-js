import React from 'react'
// import useEffect from 'react'

class SaverHelpers extends React.Component {
    onSubmit = (event, filename) => {
        alert("Saving filled schema as a json file.")
        var FileSaver = require('file-saver');
        const data = event.formData;
        console.log(event.formData);
        const fileData = JSON.stringify(data);
        console.log(fileData);
        var blob = new Blob([fileData], {type: "text/plain"});
        FileSaver.saveAs(blob, "filledform.json");
        //this.setState(({formData: Object.assign({}, event.formData)}))
        //alert("submitted")
        //console.log(this.formData);
    };

    onSaveToPC = (event, filename) => {
        var FileSaver = require('file-saver');
        console.log(this.state)
        var data = event.formData
        const fileData = JSON.stringify(data);
        var blob = new Blob([fileData], {type: "text/plain"});
        FileSaver.saveAs(blob, `${filename}.json`);
    };

}

export default SaverHelpers