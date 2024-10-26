import React from 'react';

const Logout = () => {
    const logout = () => {
        localStorage.removeItem("accessToken"); // Si vous stockez le token dans le localStorage
        window.location.href = "/login"; // 
    }
    return (
        <li onClick={logout} className="nav-link nav-footer">
            Se déconnecter
        </li>
    );
};

export default Logout;