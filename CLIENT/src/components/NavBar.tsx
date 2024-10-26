import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import UserContext from './AppContext';
import Logout from './log/Logout';

const NavBar = () => {
    const [isLogin, setIsLogin] = useState(false);
    const userId = useContext(UserContext);
    return (
        <nav>
            <div className="sidebar-container">
                <div className='sidebar'>
                    <div className="logo">
                        <img src="/logo192.png" alt="logo"/>
                    </div>
                    <div className="nav-link">
                        <NavLink to="/">Accueil</NavLink>
                        
                        {/* Vérifie que userId est défini et non undefined ou null */}
                        { userId ? (
                            <>
                                <NavLink to="/ajouter">Créer +</NavLink>
                                <NavLink to="/profil">Profil</NavLink>
                            </>
                        ) : (
                            <NavLink to="/login">Se connecter</NavLink>
                        )}
                    </div>
                    <div className="nav-footer">
                        { userId && (
                            <>
                            <NavLink to="/profil">Paramètre</NavLink>
                            <Logout/>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
