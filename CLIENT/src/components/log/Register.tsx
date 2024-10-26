import axios from 'axios';
import React, { useState } from 'react';
import Login from './Login';

const Register = () => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordRepeat: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordRepeat: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value, // Met à jour le champ correspondant dans l'état
        });

        // Effacer l'erreur spécifique dès qu'on tape
        setErrors({
            ...errors,
            [name]: ""  // Remet à zéro l'erreur pour ce champ
        });
    };

    // const validateForm = () => {
    //     let valid = true;
    //     const newErrors = { firstName: "", lastName: "", email: "", password: "", passwordRepeat: "" };

    //     // Vérifications simples côté client
    //     if (!formData.firstName) {
    //         newErrors.firstName = "Le prénom est requis.";
    //         valid = false;
    //     }
    //     if (!formData.lastName) {
    //         newErrors.lastName = "Le nom est requis.";
    //         valid = false;
    //     }
    //     if (!formData.email) {
    //         newErrors.email = "L'adresse email est requise.";
    //         valid = false;
    //     }
    //     if (!formData.password) {
    //         newErrors.password = "Le mot de passe est requis.";
    //         valid = false;
    //     }
    //     if (formData.password.length < 6) {
    //         newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    //         valid = false;
    //     }
    //     if (formData.password !== formData.passwordRepeat) {
    //         newErrors.passwordRepeat = "Les mots de passe ne correspondent pas.";
    //         valid = false;
    //     }

    //     setErrors(newErrors);
    //     return valid;
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // if (!validateForm()) {
        //     return;  // Si le formulaire n'est pas valide, arrête la soumission
        // }

        if(formData.password === formData.passwordRepeat ) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_API_URL}api/user/register`, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                });
                console.log(res);
                setIsSubmit(true);
            } catch (err: any) {
                if (err.response && err.response.data) {
                    const errorData = err.response.data;
        
                    // Si le backend renvoie des erreurs pour des champs spécifiques
                    if (errorData.message.includes("Le prénom est requis")) {
                        setErrors((prev) => ({ ...prev, firstName: "Le prénom est requis" }));
                    }
                    
                    if (errorData.message.includes("Le Prénom doit contenir 3 caractères minimum.")) {
                        setErrors((prev) => ({ ...prev, firstName: errorData.message }));
                    }

                    if (errorData.message.includes("Le nom doit contenir 3 caractères minimum.")) {
                        setErrors((prev) => ({ ...prev, lastName: errorData.message }));
                    }

                    if (errorData.message.includes("Le nom est requis")) {
                        setErrors((prev) => ({ ...prev, lastName: errorData.message }));
                    }
                    if (errorData.message.includes("L'adresse email est requise")) {
                        setErrors((prev) => ({ ...prev, email: errorData.message }));
                    }
                    if (errorData.message.includes("mot de passe")) {
                        setErrors((prev) => ({ ...prev, password: errorData.message }));
                    }
                    if (errorData.message.includes("Cette adresse email existe déjà")) {
                        setErrors((prev) => ({ ...prev, email: errorData.message }));
                    }

                    if (errorData.message.includes("L'adresse email n'est pas valide")) {
                        setErrors((prev) => ({ ...prev, email: errorData.message }));
                    }
                }
            }
        } else {
            setErrors((prev) => ({...prev, passwordRepeat: "Les mots de passe ne correspondent pas."}))
        }

        
    };

    return (
        <>
        { isSubmit ? (
            <>
                <Login/>
                <h4 className="success">Inscription réussie, veuillez vous connecter.</h4>
            </>
        ) : (
            <form className="form" onSubmit={handleSubmit}>
                <h1>Inscription</h1>
                <div>
                    <label htmlFor="firstName">Prénom</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange}/>
                    {errors.firstName && <div className="firstName error">{errors.firstName}</div>}
                </div>
                <div>
                    <label htmlFor="lastName">Nom</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange}/>
                    {errors.lastName && <div className="lastName error">{errors.lastName}</div>}
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" value={formData.email} onChange={handleChange}/>
                    {errors.email && <div className="email error">{errors.email}</div>}
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}/>
                    {errors.password && <div className="password error">{errors.password}</div>}
                </div>
                <div>
                    <label htmlFor="passwordRepeat">Confirmation mot de passe</label>
                    <input type="password" id="passwordRepeat" name="passwordRepeat" value={formData.passwordRepeat} onChange={handleChange}/>
                    {errors.passwordRepeat && <div className="passwordRepeat error">{errors.passwordRepeat}</div>}
                </div>
                <input type="submit" value="S'inscrire" />
            </form>
        )}
        </>
    );
};

export default Register;
