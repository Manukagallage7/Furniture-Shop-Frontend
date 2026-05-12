import { Route, Routes, Link, useLocation } from "react-router-dom"
import { MdSpaceDashboard, MdLogout, MdMenu, MdClose } from "react-icons/md";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaFileContract, FaFirstOrderAlt } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import ProductsAdminPage from "./admin/productsAdminPage";
import AddProductPage from "./admin/addProductPage";
import UpdateProductPage from "./admin/updateProductPage";
import OrderAdminPage from "./admin/ordersAdminPage";
import UserAdminPage from "./admin/userAdminPage";
import AdminProfilePage from "./admin/adminProfilePage";
import InquiryAdminPage from "./admin/inquiryAdminPage";

const menuItems = [
    { icon: MdSpaceDashboard, label: "Dashboard", path: "/admin/", id: "dashboard" },
    { icon: MdProductionQuantityLimits, label: "Products", path: "/admin/products", id: "products" },
    { icon: FaFirstOrderAlt, label: "Orders", path: "/admin/orders", id: "orders" },
    { icon: FaUser, label: "Users", path: "/admin/users", id: "users" },
    { icon: FaFileContract, label: "Inquiries", path: "/admin/inquiry", id: "inquiry" },
    { icon: FaUser, label: "Profile", path: "/admin/profile", id: "profile" },
];

const DashboardHome = () => (
    <div className="p-8">
        <h1 className="text-4xl font-bold" style={{ color: "#213C51" }}>Welcome Back</h1>
        <p className="mb-8" style={{ color: "#213C51" }}>Manage your furniture shop operations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard icon={MdProductionQuantityLimits} title="Products" desc="Manage inventory" bgColor="#DAA464" />
            <DashboardCard icon={FaFirstOrderAlt} title="Orders" desc="View & track orders" bgColor="#DEC384" />
            <DashboardCard icon={FaUser} title="Users" desc="Manage customers" bgColor="#E8DDB4" textColor="#767F9E" />
        </div>
    </div>
);

const DashboardCard = ({ icon: Icon, title, desc, bgColor, textColor = "#FFFFFF" }) => (
    <div className="rounded-lg p-6" style={{ backgroundColor: bgColor, color: textColor }}>
        <Icon className="text-4xl mb-3" />
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-sm">{desc}</p>
    </div>
);

const NavLink = ({ item, isActive }) => {
    const Icon = item.icon;
    return (
        <Link
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200"
            style={{
                backgroundColor: isActive ? "#DAA464" : "transparent",
                color: "#E8DDB4"
            }}
        >
            <Icon className="text-xl" />
            <span className="font-medium">{item.label}</span>
        </Link>
    );
};

export default function AdminPage() {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="w-full h-screen flex flex-row" style={{ backgroundColor: "#E8DDB4" }}>
            {/* Vertical Sidebar */}
            <div
                className="h-full flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                    width: sidebarOpen ? "280px" : "80px",
                    backgroundColor: "#213C51"
                }}
            >
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between" style={{ borderBottomColor: "#DEC384", borderBottomWidth: "1px" }}>
                    {sidebarOpen ? (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#DAA464" }}>
                                    <span className="text-white font-bold">F</span>
                                </div>
                                <div>
                                    <span className="text-lg font-bold whitespace-nowrap" style={{ color: "#E8DDB4" }}>Furniture</span>
                                    <p style={{ color: "#DEC384" }} className="text-xs">Admin Panel</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-lg transition-all duration-200"
                                style={{ backgroundColor: "#DAA464", color: "#FFFFFF" }}
                            >
                                <MdClose size={18} />
                            </button>
                        </>
                    ) : (
                        <div className="w-full flex items-center justify-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 rounded-lg transition-all duration-200"
                                style={{ backgroundColor: "#DAA464", color: "#FFFFFF" }}
                            >
                                <MdMenu size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 py-6 px-2">
                    {sidebarOpen && (
                        <p className="text-xs font-semibold px-4 mb-4 uppercase" style={{ color: "#DEC384" }}>Menu</p>
                    )}
                    <div className={sidebarOpen ? "space-y-2" : "space-y-4 flex flex-col items-center py-4"}>
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path ||
                                (item.path === "/admin/" && location.pathname === "/admin");

                            return sidebarOpen ? (
                                <NavLink
                                    key={item.id}
                                    item={item}
                                    isActive={isActive}
                                />
                            ) : (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className="p-3 rounded-lg transition-all duration-200 flex items-center justify-center"
                                    style={{
                                        backgroundColor: isActive ? "#DAA464" : "transparent",
                                        color: "#E8DDB4"
                                    }}
                                    title={item.label}
                                >
                                    <Icon className="text-2xl" />
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout Section - Only show when open */}
                {sidebarOpen && (
                    <div className="p-4" style={{ borderTopColor: "#DEC384", borderTopWidth: "1px" }}>
                        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200" style={{ color: "#FFFFFF", backgroundColor: "#DAA464" }}>
                            <MdLogout className="text-xl" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 h-full overflow-y-auto" style={{ backgroundColor: "#E8DDB4" }}>
                <Routes path="/">
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/products" element={<ProductsAdminPage />} />
                    <Route path="/products/addProduct" element={<AddProductPage />} />
                    <Route path="/products/editProduct" element={<UpdateProductPage />} />
                    <Route path="/orders" element={<OrderAdminPage />} />
                    <Route path="/users" element={<UserAdminPage />} />
                    <Route path="/profile" element={<AdminProfilePage />} />
                    <Route path="/inquiry" element={<InquiryAdminPage />} />
                </Routes>
            </div>
        </div>
    )
}