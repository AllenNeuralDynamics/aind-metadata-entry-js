import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function RehydrateForm () {
    /*
    autofills form with formData
    */
    let fileHandle;
    let formData = null;
    RehydrateForm.addEventListener('click', async () => {
        // Destructure the one-element array.
        [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        const contents = await file.text();
        formData = contents;
    });
}