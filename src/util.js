/** 
 * @param {File} file 
 * @returns {Promise<array>}
 */
export function readCsv(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const content = event.target.result.split('\n');
            resolve(content);
        }
        reader.readAsText(file)
    });   
}

/**
 * @param {string} data
 * @param {string|null} filename
 * @returns {void}
 */
export function createCsv(data, filename = null) {
    const aTag = document.createElement('a');
    const blob = new Blob(['\uFEFF', data], {type: 'text/csv'});
    aTag.download = filename ?? "file.csv";
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(aTag.href);
    aTag.remove();
}

/**
 * @param {array} keys 
 * @param {array} values 
 * @returns {object}
 */
export function arrayCombine(keys, values) {
    const ob = {};
    for(let index in keys) {
        ob[keys[index]] = values[index];
    }

    return ob;
}

export function cloneObj(obj) {
    if(obj === null)return obj;

    return JSON.parse(JSON.stringify(obj));
}

