import { Route, Routes } from "react-router-dom"

export default function AdminPage() {
    return (
        <div className="w-full h-screen flex flex-row bg-gray-100">
            <div className="w-[300px] h-full bg-white">
                
            </div>
            <div className="w-[calc(100%-300px)] bg-blue-900 h-full">
                <Routes path="/">
                    <Route path="/" element={<div>Admin Dashboard</div>} />
                    <Route path="/products" element={<h1>Products</h1>} />
                    <Route path="/orders" element={<h1>Orders</h1>} />
                    <Route path="/users" element={<h1>Users</h1>} />
                </Routes>
            </div>
        </div>
    )
}