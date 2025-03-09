import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Profil from "../../pages/Profil";
import AddPost from "../../pages/AddPost";
import Log from "../log/Form";
import Layout from "../layout/Layout";

const index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/ajouter" element={<AddPost />} />
          <Route path="/login" element={<Log />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default index;
