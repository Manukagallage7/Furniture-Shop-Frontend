import { Link } from "react-router-dom";
import { BiCart } from "react-icons/bi";

export default function Header() {
    return (
        <header className=" relative bg-blue-500 flex justify-center items-center gap-8">
            <Link to="/" className="text-white text-2xl font-bold py-4">Home</Link>
            <Link to="/products" className="text-white text-2xl font-bold py-4">Products</Link>
            <Link to="/about-us" className="text-white text-2xl font-bold py-4">About Us</Link>
            <Link to="/contact-us" className="text-white text-2xl font-bold py-4">Contact Us</Link>
            <Link to="/cart" className=" absolute right-30 text-white text-2xl font-bold py-4">
                <BiCart className="text-white text-3xl ml-4" />
            </Link>
        </header>
    )
}