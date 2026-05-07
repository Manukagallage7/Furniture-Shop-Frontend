import { Routes, Route } from "react-router-dom";
import Header from "../../components/header.jsx";
import ProductPage from "./productPage.jsx";
import ProductOverviewPage from "./productOverViewPage.jsx";
import CartPage from "./cartPage.jsx";

export default function ClientPage() {
    return (
            <div className="w-full h-screen max-h-screen">
                <Header />
                <div className="w-full h-[calc(100%-100px)]">
                    <Routes path="/">
                    <Route path="/" element={<h1>Home Page</h1>} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about-us" element={<h1>About Us Page</h1>} />
                    <Route path="/contact-us" element={<h1>Contact Us Page</h1>} />
                    <Route path="/product-overview/:productId" element={<ProductOverviewPage />} />
                    <Route path="/*" element={<h1>404 Page</h1>} />
                </Routes>
                </div>
            </div>
    )
}