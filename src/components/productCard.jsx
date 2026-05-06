import {Link } from 'react-router-dom';

export default function ProductCard(props) {
    const product = props.product
    return (
        <Link to={`/product-overview/${product.productId}`} className="w-[300px] h-[400px] flex flex-col bg-white rounded-lg shrink-0 shadow-2xl p-4 m-4 overflow-hidden">
            <img src={product.images[0]} className="w-full h-[275px] object-cover rounded-md mb-4" />
            <div className="w-full h-[125px] flex flex-col p-[3px] ">
            <h1 className="text-lg font-bold text-amber-950">{product.name || 'Untitled product'}</h1>
            <p className="text-sm text-amber-700">{product.category || 'Uncategorized'}</p>
            <div>
                {
                    product.labelledPrice > product.actualPrice ? (
                        <p>
                            <span className="text-lg font-semibold text-gray-800 line-through mr-4">Rs.{product.labelledPrice.toFixed(2)}</span>
                            <span className="text-lg font-semibold text-gray-800">Rs.{product.actualPrice.toFixed(2)}</span>
                        </p>
                    ) : (
                            <span className="text-lg font-semibold text-gray-800 ml-2">Rs.{product.actualPrice.toFixed(2)}</span>
                    )
                }
                
            </div>
        </div>
    </Link>
    )
}

    