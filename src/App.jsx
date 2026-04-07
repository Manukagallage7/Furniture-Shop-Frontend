import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/homePage.jsx"
import LoginPage from "./pages/loginPage.jsx"
import RegisterPage from "./pages/registerPage.jsx"
import AdminPage from "./pages/adminPage.jsx"
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-right"/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
