import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewedProfil from "../../features/user/pages/ViewedProfil";
import AddPost from "../../pages/AddPost";
import { Form } from "../log/Form";
import Layout from "../layout/Layout";
import { EditProfil } from "src/pages/EditProfil";
import { Home } from "src/pages/Home";
import { MyProfile } from "src/features/user/pages/MyProfile";

const index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profil/:id" element={<ViewedProfil />} />
          <Route path="/my-profil" element={<MyProfile />} />
          <Route path="/ajouter" element={<AddPost />} />
          <Route path="/login" element={<Form />} />
          <Route path="/edit-profil" element={<EditProfil />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default index;
