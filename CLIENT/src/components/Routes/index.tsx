import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import AddPost from '../../pages/AddPost';
import NavBar from '../NavBar';
import Log from "../log/Form";



const index = () => {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/profil" element={<Profil/>}/>
                <Route path="/ajouter" element={<AddPost/>}/>
                <Route path="/login" element={<Log/>}/>
            </Routes>
        </Router>
    );
};

export default index;