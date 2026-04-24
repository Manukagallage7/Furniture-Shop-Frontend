import { BiPlus } from 'react-icons/bi';
import { Link } from "react-router-dom";

export default function ProductsAdminPage() {
    return (
        <div className='w-full h-full border-[3px] border-gray-300'>
            <Link to="/admin/products/addProduct" className='fixed right-[40px] bottom-[40px] bg-gray-300 rounded-full p-3 shadow-2xl cursor-pointer hover:bg-gray-400 transition-colors'>
                <BiPlus className='text-3xl'/>
            </Link>
        </div>
    )
}