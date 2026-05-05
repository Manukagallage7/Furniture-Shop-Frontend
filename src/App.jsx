import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/loginPage.jsx"
import RegisterPage from "./pages/registerPage.jsx"
import AdminPage from "./pages/adminPage.jsx"
import { Toaster } from "react-hot-toast";
import ClientPage from "./pages/client/clientPage.jsx"

function App() {
  return (
    <BrowserRouter>
      <div>
        <Toaster position="top-right"/>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/*" element={<ClientPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
