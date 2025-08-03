import React, {useState, useEffect} from 'react';
import { createCSV, headers } from './util.js';
import EditForm from './components/edit_form/EditForm.jsx';
import ImportForm from './components/import_form/ImportForm.jsx';

function App() {
    const [accounts, setAccounts] = useState([]);
    const [elmIndex, setElmIndex] = useState(null);
    const [account, setAccount] = useState(null);
    const [dispalyForm, setDispalyForm] = useState(null);
    const [updateAccounts, setUpdateAccounts] = useState(false);
    const [keywords, setKeywords] = useState('');

    const EDIT_ACCOUNT_ACTION = 1;
    const IMPORT_ACCOUNTS_ACTION = 2;
    
    useEffect(() => {
        (async ()=>{
            await getAccounts();
        })();
    }, []);

    useEffect(() => {
        (async ()=>{
            if (updateAccounts === true) {
                setUpdateAccounts(false);
                await chrome.storage.local.set({'login': accounts});
            }
        })();
    }, [accounts]);

    const getAccounts = async () => {
        let result = (await chrome.storage.local.get()).login ?? [];
        setAccounts(result);
    }

    const setForm = (action = null, index = null) => {
        setElmIndex(index);
        setAccount(index === null ? null : accounts[index]);
        setDispalyForm(action);
    }

    const isNameExisted = (nameWatcher) => {
        for (let index  = 0; index < accounts.length; index++) {
            if (accounts[index].name === nameWatcher && elmIndex !== index)return true;
        }
        return false;
    }

    const editAccount = (data) => {
        setUpdateAccounts(true);
        if (elmIndex === null) {
            setAccounts([...accounts, data]);
            setForm();
        } else {
            setAccounts(accounts.map((item, index) => {
                if (index === elmIndex)return {...item, ...data};
                else return item;
            }))
        }
        alert("Enregistré");
    }

    const deleteAccount = (index) => {
        if (index === elmIndex)return;

        if (!window.confirm("Voulez-vous supprimer ce compte?"))return;

        setUpdateAccounts(true);
        setAccounts(accounts.filter((_, i) => i !== index))
    }

    const navigateToUrl = async (index) => {
        chrome.tabs.create({ url: accounts[index].link });
    }

    const doLogin = async (index) => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: "login",
            data: accounts[index]
        });
    }

    const getIndexById = (id) => {
        return accounts.findIndex((account) => account.id === id);
    }

    const exportData = () => {
        let data = headers.join(';') + '\n';
        accounts.forEach((account) => {
            headers.forEach((title, index) => {
                data += account[title];
                if (index < headers.length - 1)data += ';';
            });
            data += '\n';
        });

        createCSV(data, 'logins.csv');
    }

    const importData = (data) => {
        setUpdateAccounts(true);
        setAccounts([...accounts, ...data]);
        alert('Importé');
        setForm();
    }

    return (
        <div id="app" className="p-3 pb-1 hero-width-500">
            {dispalyForm === EDIT_ACCOUNT_ACTION &&
                <EditForm 
                    account={account}
                    isNameExisted={isNameExisted}
                    setForm={setForm}
                    editAccount={editAccount}
                />
            }
            {dispalyForm === IMPORT_ACCOUNTS_ACTION &&
                <ImportForm 
                    setForm={setForm}
                    importData={importData}
                />
            }

            <h5 className="text-center mb-3">Que les jolies blondes de 18 ans te bénissent!</h5>

            <section className="d-flex align-items-center mb-2 ps-1">
                <i class="bi bi-download pointer me-3" onClick={exportData}></i>
                <i class="bi bi-upload pointer" onClick={() => setForm(IMPORT_ACCOUNTS_ACTION)}></i>
            </section>
            <section className="mb-2">
                <input 
                    class="form-control form-control-sm" 
                    type="search"
                    id="keywords" 
                    name="keywords"
                    placeholder='Site, Identifiant'
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)} 
                />
            </section>
            <section id="list-accounts">
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">
                                Site
                                <i class="bi bi-plus-circle-fill cursor-pointer ms-1" onClick={()=>setForm(EDIT_ACCOUNT_ACTION)}></i>
                            </th>
                            <th scope="col">Identifiant</th>
                            <th scope="col">Login</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accounts
                            .filter((account) => {
                                return account.name?.toLowerCase().includes(keywords.toLowerCase()) || account.email?.toLowerCase().includes(keywords.toLowerCase())
                            })
                            .map((account, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        {account.link === null || account.link === ''
                                            ?<span>{account.name}</span>
                                            :<span 
                                                className="btn btn-link"  
                                                onClick={()=>navigateToUrl(getIndexById(account.id))}>
                                                    {account.name}
                                             </span>
                                        }
                                    </th>
                                    <td>{account.email}</td>
                                    <td>
                                        <i className="bi bi-door-open-fill cursor-pointer hover:color-blue" onClick={()=>doLogin(getIndexById(account.id))}></i>
                                    </td>
                                    <td>
                                        <i className="bi bi-pencil-fill cursor-pointer me-3 hover:color-green" onClick={()=>setForm(EDIT_ACCOUNT_ACTION, getIndexById(account.id))}></i>
                                        <i className="bi bi-trash3-fill cursor-pointer hover:color-red" onClick={()=>deleteAccount(getIndexById(account.id))}></i>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </section>
        </div>
    )
}
export default App