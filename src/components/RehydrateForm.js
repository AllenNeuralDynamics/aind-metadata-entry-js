import 'bootstrap/dist/css/bootstrap.min.css';

export default function RehydrateForm () {
    /*
    autofills form with formData
    */
    let fileHandle;
    let formData = null;

    async function getData() { 
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const contents = await file.text();
        return contents
    }
    formData = getData()
    return formData;
}