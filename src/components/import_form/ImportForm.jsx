import React, {useState, useEffect} from 'react';
import { arrayCombine, readCSV } from '../../util';
import uniqid from 'uniqid';

const ImportForm = (props) => {
    const [file, setFile] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        let importedData = [];
        if (file === null || file.type !== 'text/csv')return;
        const data = (await readCSV(file)).split('\n');
        let csvHeaders, line, tab;
        for (let index = 0; index < data.length; index++) {
            if (data[index] === '')continue;
            if (index === 0) {
                csvHeaders = data[index].split(';');
                continue;
            }
            line = data[index].split(';');
            tab = arrayCombine(csvHeaders, line);
            tab['id'] = uniqid();
            importedData.push(tab);
        }

        if (importedData.length > 0)props.importData(importedData);
    }

    return (
        <>
            <section className="container-fluid mb-4">
                <form className="row" onSubmit={onSubmit}>
                    <div className="col-12 d-flex justify-content-between">
                        <h4>
                           Importer des comptes
                        </h4>
                        <i className="bi bi-x-lg cursor-pointer text-danger" onClick={()=>{props.setForm()}}></i>
                    </div>
                    <div className="col-12 mb-2">
                        <label for="file" class="form-label">Fichier*</label>
                        <input 
                            class="form-control form-control-sm" 
                            type="file"
                            id="file" 
                            name="file"
                            onChange={(e) => setFile(e.target.files.item(0))}
                        />
                    </div>
                    <div className="col-12">
                        <button type='submit' className="btn btn-primary btn-sm">Envoyer</button>
                    </div>
                </form>
            </section>
        </>
    );
}
export default ImportForm;