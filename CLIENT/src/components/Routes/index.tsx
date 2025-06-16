import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewedProfil from "../../features/user/pages/ViewedProfil";
import AddPost from "../../pages/AddPost";
import Layout from "../layout/Layout";
import { EditProfil } from "src/pages/EditProfil";
import { Home } from "src/pages/Home";
import { MyProfile } from "src/features/user/pages/MyProfile";
import ConfirmEmail from "../log/ConfirmEmail";
import { Login } from "../log/Login";
import { Register } from "../log/Register";
import { ProtectedRoute } from "../log/ProtectedRoute";
import { ForgotPasswordForm } from "../log/ForgotPasswordForm";
import ResetPasswordForm from "../log/ResetPasswordForm";

const index = () => {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmation/:token" element={<ConfirmEmail />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

        {/* Toutes les autres routes passent par ProtectedRoute */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/profil/:id" element={<ViewedProfil />} />
          <Route path="/my-profil" element={<MyProfile />} />
          <Route path="/ajouter" element={<AddPost />} />
          <Route path="/edit-profil" element={<EditProfil />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default index;
