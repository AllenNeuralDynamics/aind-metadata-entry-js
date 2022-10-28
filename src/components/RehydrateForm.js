import 'bootstrap/dist/css/bootstrap.min.css';

export default async function RehydrateForm () {
    /*
    Functional component to pre-fill form with user-selected data file
        Uses file system access API to access local files
        Returns pre-existing data (JSON object)
    */
    alert("Select a JSON file that matches selected schema from local file system.")
    let fileHandle;
    let formData = null;

    async function getData() {
        /*
        File system access API to fetch metadata
        */
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const contents = await file.text();
        return contents;
    };

    formData = await getData();
    return JSON.parse(formData);
}
