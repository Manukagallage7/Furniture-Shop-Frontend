import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/loginPage.jsx"
import RegisterPage from "./pages/registerPage.jsx"
import AdminPage from "./pages/adminPage.jsx"
import { Toaster } from "react-hot-toast";
import ClientPage from "./pages/client/clientPage.jsx"
import {GoogleOAuthProvider} from "@react-oauth/google"
import ForgotPasswordPage from "./pages/forgotPasswordPage.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div>
        <Toaster position="top-right"/>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/*" element={<ClientPage />} />
        </Routes>
      </div>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
