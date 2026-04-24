import { Route, Routes, Link } from "react-router-dom"
import { MdSpaceDashboard } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaFirstOrderAlt } from "react-icons/fa6";
import { FaUserSecret } from "react-icons/fa";
import ProductsAdminPage from "./admin/productsAdminPage";
import AddProductPage from "./admin/addProductPage";

export default function AdminPage() {
    return (
        <div className="w-full h-screen flex flex-row bg-gray-100">
            <div className="w-[300px] h-full bg-white items-center flex flex-col">
                <span className="text-2xl font-bold p-4 block">Admin Panel</span>
                <div className="flex flex-col ">
                    <Link to="/admin/" className="flex items-center p-4 hover:text-gray-200 gap-2"><MdSpaceDashboard /> Dashboard</Link>
                    <Link to="/admin/products" className="flex items-center p-4 hover:text-gray-200 gap-2"><MdProductionQuantityLimits /> Products</Link>
                    <Link to="/admin/orders" className="flex items-center p-4 hover:text-gray-200 gap-2"><FaFirstOrderAlt /> Orders</Link>
                    <Link to="/admin/users" className="flex items-center p-4 hover:text-gray-200 gap-2"><FaUserSecret /> Users</Link>
                </div>
            </div>
            <div className="w-[calc(100%-300px)] bg-blue-900 h-full overflow-y-auto">
                <Routes path="/">
                    <Route path="/" element={<div>Admin Dashboard</div>} />
                    <Route path="/products" element={<ProductsAdminPage />} />
                    <Route path="/products/addProduct" element={<AddProductPage />} />
                    <Route path="/orders" element={<h1>Orders</h1>} />
                    <Route path="/users" element={<h1>Users</h1>} />
                </Routes>
            </div>
        </div>
    )
}