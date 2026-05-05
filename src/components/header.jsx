import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="bg-blue-500 flex justify-center items-center gap-8">
            <Link to="/" className="text-white text-2xl font-bold py-4">Home</Link>
            <Link to="/products" className="text-white text-2xl font-bold py-4">Products</Link>
            <Link to="/cart" className="text-white text-2xl font-bold py-4">Cart</Link>
            <Link to="/about-us" className="text-white text-2xl font-bold py-4">About Us</Link>
            <Link to="/contact-us" className="text-white text-2xl font-bold py-4">Contact Us</Link>
        </header>
    )
}
    