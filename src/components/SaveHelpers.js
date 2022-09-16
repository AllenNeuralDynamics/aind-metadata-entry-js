
function preProcessing (schema, filename) {
        /*
        PreProcessing for schema validation
            Adds id (same as $schema) field to address ajv5 validation and jsonschema 2020-12 compatibility
            Adds title field for filename save
        */
        schema.id = "https://json-schema.org/draft/2020-12/schema";
        schema.title = filename;
        return schema; 
};

function onSubmit ({formData},event) {
        /* 
        Saves the metadata as a json schema on client-server
        */
       // event.preventDefault()

       console.log("data submitted: ", formData)
        /*alert("Saving filled schema as a json file.")
        var FileSaver = require('file-saver');
        //const formData = event.formData;
        const fileData = JSON.stringify(formData);
        var blob = new Blob([fileData], {type: "text/plain"});
        const filename = schema.title
        //console.log(filename)
        //const filename = "filledform"
        FileSaver.saveAs(blob, `${filename}.json`);*/
};

function onSaveToState (event) {
        /* Saves metadata as an object into React State */
        this.setState(({formData: Object.assign({}, event.formData)}))
        //console.log(event.formData);
};


const SaveHelpers = {
    preProcessing,
    onSubmit,
    onSaveToState
};

export default SaveHelpers;