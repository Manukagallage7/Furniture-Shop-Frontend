import { Link, useLocation } from "react-router-dom";
import { BiCart } from "react-icons/bi";
import { FaUser } from "react-icons/fa";

export default function Header() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        transition-all duration-300 font-semibold text-lg
        ${isActive(path)
            ? 'text-[#DAA464] border-b-2 border-[#DAA464]'
            : 'text-white hover:text-[#DEC384]'
        }
        py-2 px-1 hover:border-b-2 hover:border-[#DEC384]
    `;

    return (
        <header className="bg-gradient-to-r from-[#213C51] to-[#2d5266] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

                <Link to="/" className="text-[#DEC384] text-3xl font-bold hover:text-[#DAA464] transition-colors pr-20">
                    FurniCo
                </Link>

                <nav className="flex gap-8 items-center">
                    <Link to="/" className={navLinkClass('/')}>
                        Home
                    </Link>
                    <Link to="/products" className={navLinkClass('/products')}>
                        Products
                    </Link>
                    <Link to="/about-us" className={navLinkClass('/about-us')}>
                        About
                    </Link>
                    <Link to="/contact-us" className={navLinkClass('/contact-us')}>
                        Contact
                    </Link>
                    <Link to="/my-orders" className={navLinkClass('/my-orders')}>
                        Orders
                    </Link>
                </nav>

                <div className="flex gap-6 items-center ">
                    <Link to="/cart"
                        className={`transition-all duration-300 relative group ${
                            isActive('/cart') ? 'text-[#DAA464]' : 'text-[#DEC384] hover:text-[#DAA464]'
                        }`}>
                        <BiCart className="text-3xl" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            0
                        </span>
                    </Link>

                    <Link to="/profile"
                        className={`transition-all duration-300 flex items-center gap-2 px-3 py-2  rounded-lg ${
                            isActive('/profile')
                                ? 'bg-[#DAA464] text-white'
                                : 'text-[#DEC384] hover:bg-[#DAA464] hover:text-white'
                        }`}>
                        <FaUser className="text-xl" />
                        <span className="font-semibold hidden sm:inline">Profile</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}