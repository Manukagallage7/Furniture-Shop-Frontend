import { Routes, Route } from "react-router-dom";
import Header from "../../components/header.jsx";

export default function ClientPage() {
    return (
            <div className="w-full h-screen max-h-screen">
                <Header />
                <div className="w-full h-[calc(100%-100px)]">
                </div>
                <Routes path="/">
                    <Route path="/" element={<h1>Home Page</h1>} />
                    <Route path="/products" element={<h1>Products Page</h1>} />
                    <Route path="/about-us" element={<h1>About Us Page</h1>} />
                    <Route path="/contact-us" element={<h1>Contact Us Page</h1>} />
                </Routes>
            </div>
    )
}