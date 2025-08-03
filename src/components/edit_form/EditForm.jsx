import React, {useState, useEffect} from 'react';
import { useForm, useWatch } from "react-hook-form";
import uniqid from 'uniqid';

const EditForm = (props) => {
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setForm();
    }, [props.account]);

    const nameWatcher = useWatch({
        control,
        name: 'name',
        defaultValue: null
    });

    const setForm = () => {
        reset({
            name: props.account ? props.account['name'] : null,
            server: props.account ? props.account['server'] : null,
            email: props.account ? props.account['email'] : null,
            password: props.account ? props.account['password'] : null,
            link: props.account ? props.account['link'] : null
        });
    }

    const isNameExisted = () => {
        return props.isNameExisted(nameWatcher);
    }

    const onSubmit = (data) => {
        if (!props.account)data['id'] = uniqid();
        props.editAccount(data);
    }

    return (
        <>
            <section className="container-fluid mb-4">
                <form className="row" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-12 d-flex justify-content-between">
                        <h4>
                           {!props.account ? 'Ajouter' : 'Modifier'}  un compte
                        </h4>
                        <i className="bi bi-x-lg cursor-pointer text-danger" onClick={()=>{props.setForm()}}></i>
                    </div>
                    <div className="col-6 mb-2">
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
                        <label for="server" class="form-label">Serveur</label>
                        <input 
                            class="form-control form-control-sm" 
                            type="text"
                            id="server" 
                            name="server"
                            {...register("server")}
                        />
                    </div>
                    <div className="col-6 mb-2">
                        <label for="email" class="form-label">Mail*</label>
                        <input 
                            class="form-control form-control-sm" 
                            type="text"
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
                            type={showPassword ? "text" : "password"}
                            id="password" 
                            name="password"
                            autocomplete="off"
                            {...register("password", { required: { value: true, message: 'Le champ est obligatoire'}})}
                        />
                        <div 
                            className="text-end small pointer" 
                            onClick={() => setShowPassword(!showPassword)}
                        >{showPassword ? 'Cacher' : 'Afficher'}</div>
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
                    <div className="col-12">
                        <button type='submit' className="btn btn-primary btn-sm">Envoyer</button>
                    </div>
                </form>
            </section>
        </>
    );
}
export default EditForm;