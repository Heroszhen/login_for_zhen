import React, {useState, useEffect} from 'react';
import { useForm, useWatch } from "react-hook-form";

function App() {
    const [accounts, setAccounts] = useState([]);
    const [elmIndex, setElmIndex] = useState(null);
    const [dispalyForm, setDispalyForm] = useState(false);
    const [updateAccounts, setUpdateAccounts] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const nameWatcher = useWatch({
        control,
        name: 'name',
        defaultValue: null
    });
    
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

    const setForm = (index = null) => {
        setElmIndex(index);
        reset({
            name: index === null ? null : accounts[index].name,
            email: index === null ? null : accounts[index].email,
            password: index === null ? null : accounts[index].password,
            link: index === null ? null : accounts[index].link
        });
        setDispalyForm(true);
    }

    const onSubmit = (data) => {
        setUpdateAccounts(true);
        if (elmIndex === null) {
            setAccounts([...accounts, data]);
            setDispalyForm(false);
        } else {
            setAccounts(accounts.map((item, index) => {
                if (index === elmIndex)return data;
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

    const isNameExisted = () => {
        for (let index  = 0; index < accounts.length; index++) {
            if (accounts[index].name === nameWatcher && elmIndex !== index)return true;
        }
        return false;
    }

    const navigateToUrl = async (index) => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: "navigate",
            data: accounts[index].link
        });
    }

    const doLogin = async (index) => {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: "login",
            data: accounts[index]
        });
    }

    return (
        <div id="app" className="p-3 pb-1 hero-width-500">
            {dispalyForm === true &&
                <section className="container-fluid mb-3">
                    <form className="row" onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-12 d-flex justify-content-between">
                            <h4>Editer un compter</h4>
                            <i className="bi bi-x-lg cursor-pointer text-danger" onClick={()=>{setDispalyForm(false);setElmIndex(null)}}></i>
                        </div>
                        <div className="col-12 mb-2">
                            <label for="name" class="form-label">Nom*</label>
                            <input 
                                class="form-control form-control-sm" 
                                type="text"
                                id="name" 
                                name="name"
                                {...register("name", { required: { value: true, message: 'Le champ est obligatoire'}})}
                            />
                            {errors.name?.type === 'required' && <div className="alert alert-danger">{errors.name.message}</div>}
                            {isNameExisted() === true && 
                                <div className="alert alert-warning">
                                    Il existe un account avec ce nom
                                </div>
                            }
                        </div>
                        <div className="col-6 mb-2">
                            <label for="email" class="form-label">Mail*</label>
                            <input 
                                class="form-control form-control-sm" 
                                type="email"
                                id="email" 
                                name="email"
                                {...register("email", { required: { value: true, message: 'Le champ est obligatoire'}})}
                            />
                            {errors.name?.type === 'required' && <div className="alert alert-danger">{errors.email.message}</div>}
                        </div>
                        <div className="col-6 mb-2">
                            <label for="password" class="form-label">Mot de passe*</label>
                            <input 
                                class="form-control form-control-sm" 
                                type="password"
                                id="password" 
                                name="password"
                                {...register("password", { required: { value: true, message: 'Le champ est obligatoire'}})}
                            />
                            {errors.password?.type === 'required' && <div className="alert alert-danger">{errors.password.message}</div>}
                        </div>
                        <div className="col-12 mb-2">
                            <label for="link" class="form-label">Page de login</label>
                            <input 
                                class="form-control form-control-sm" 
                                type="text"
                                id="link" 
                                name="link"
                                {...register("link")}
                            />
                        </div>
                        <div className="col-12 text-center">
                            <button type='submit' className="btn btn-primary btn-sm">Envoyer</button>
                        </div>
                    </form>
                </section>
            }

            <section id="list-accounts">
                <table className="table table-striped table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">
                                Site
                                <i class="bi bi-plus-circle-fill cursor-pointer ms-1" onClick={()=>setForm()}></i>
                            </th>
                            <th scope="col">Identifiant</th>
                            <th scope="col">Login</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accounts.map((account, index) => (
                                <tr key={index}>
                                    <th scope="row">
                                        {account.link === null
                                            ?<span>{account.name}</span>
                                            :<span 
                                                className="btn btn-link"  
                                                onClick={()=>navigateToUrl(index)}>
                                                    {account.name}
                                             </span>
                                        }
                                    </th>
                                    <td>{account.email}</td>
                                    <td>
                                        <i className="bi bi-door-open-fill cursor-pointer hover:color-blue" onClick={()=>doLogin(index)}></i>
                                    </td>
                                    <td>
                                        <i className="bi bi-pencil-fill cursor-pointer me-3 hover:color-green" onClick={()=>setForm(index)}></i>
                                        <i className="bi bi-trash3-fill cursor-pointer hover:color-red" onClick={()=>deleteAccount(index)}></i>
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