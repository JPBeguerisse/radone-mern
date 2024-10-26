import axios from "axios";
import { useState } from "react";

const Login = () => {
    // Déclaration de l'état pour stocker les données du formulaire (email et mot de passe)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Déclaration de l'état pour stocker les erreurs des champs du formulaire
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    // Fonction qui gère le changement de valeur dans les champs du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;

        // Mise à jour des données du formulaire pour le champ modifié
        setFormData({
            ...formData,
            [name]: value, // Le champ modifié reçoit sa nouvelle valeur
        });

        // Réinitialisation des erreurs pour le champ modifié dès qu'on tape
        setErrors({
            ...errors,
            [name]: "", // Efface l'erreur pour ce champ
        });
    };

    // Fonction qui valide les champs du formulaire avant soumission
    const validateForm = () => {
        let valid = true; // Variable pour savoir si le formulaire est valide
        const newErrors = { email: "", password: "" }; // Initialisation d'un objet d'erreurs

        // Validation du champ email : vérifier s'il est vide
        if (!formData.email) {
            newErrors.email = "L'adresse email est requise."; // Message d'erreur pour email vide
            valid = false;
        }

        // Validation du champ mot de passe : vérifier s'il est vide
        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis."; // Message d'erreur pour mot de passe vide
            valid = false; // Remarque : ici, il faut mettre 'valid = false' au lieu de 'valid = true'
        }

        // Mise à jour de l'état des erreurs avec les nouveaux messages d'erreur
        setErrors(newErrors);
        return valid; // Retourne 'true' si valide, sinon 'false'
    };

    // Fonction appelée lors de la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission

        // Valide le formulaire avant d'envoyer les données
        if (!validateForm()) {
            return; // Si le formulaire n'est pas valide, arrêter la soumission
        }

        try {
            // Envoi des données du formulaire au serveur via une requête POST
            const res = await axios.post(`${process.env.REACT_APP_API_URL}api/user/login`, {
                email: formData.email,
                password: formData.password
            });

            // Récupération du token d'authentification dans la réponse du serveur
            const accessToken = res.data.token;
            console.log(accessToken);

            // Stockage du token dans le localStorage du navigateur
            localStorage.setItem("accessToken", accessToken);

            // Redirection vers la page d'accueil après connexion réussie
            window.location.href = "/";
        } catch (error: any) {
            if (error.response) {
                const errorData = error.response.data;

                // Gérer les erreurs spécifiques de login (email ou mot de passe incorrects)
                if (errorData.message.includes("Mot de passe") || errorData.message.includes("Utilisateur")) {
                    setErrors((prev) => ({...prev, password: "Email ou mot de passe incorrect."})); // Mise à jour de l'erreur pour le mot de passe
                }
            }
        }
    };

    // Rendu du formulaire de connexion
    return (
        <div className="">
            <form action="" className="form" onSubmit={handleSubmit}>
                <h1>Connexion</h1>
                <div className="">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}/>
                </div>
                <div className="">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}/>
                </div>
                <input type="submit" value="Se connecter" />

                {/* Affiche l'erreur si elle existe */}
                {errors.password && <div className="login error">{errors.password}</div>}
            </form>
        </div>
    );
};

export default Login;
