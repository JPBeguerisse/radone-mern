import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewedProfil from "../../pages/ViewedProfil";
import AddPost from "../../pages/AddPost";
import Log from "../log/Form";
import Layout from "../layout/Layout";
import { EditProfil } from "src/pages/EditProfil";
import { Home } from "src/pages/Home";
import { MyProfil } from "src/pages/MyProfil";

const index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil/:id" element={<ViewedProfil />} />
          <Route path="/my-profil" element={<MyProfil />} />
          <Route path="/ajouter" element={<AddPost />} />
          <Route path="/login" element={<Log />} />
          <Route path="/edit-profil" element={<EditProfil />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default index;
