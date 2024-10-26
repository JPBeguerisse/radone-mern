import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Form = () => {
    const [signUpModal, setSignUpModal] = useState<boolean>(false);
    const [signInModal, setSignInModal] = useState<boolean>(true);

    const handleModals = (e: React.MouseEvent<HTMLLIElement>) => {
        const target = e.target as HTMLElement;

        if(target.id === "register") {
            setSignUpModal(true);
            setSignInModal(false);
        }else if (target.id === "login") {
            setSignUpModal(false);
            setSignInModal(true);
        }
    }

    return (
        <div className="main">
            <div className="connection-form">
                <div className="form-container">
                    <ul>
                        <li onClick={handleModals} id="register" className={signUpModal ? "active-btn" : undefined}>S'inscrire</li>
                        <li onClick={handleModals} id="login" className={signInModal ? "active-btn" : undefined}>Se connecter</li>
                    </ul>
                    {signUpModal && <Register/>} 
                    {signInModal && <Login/>}
                </div>
            </div>
        </div>
    );
};

export default Form;