export default function ProductCard(props) {
    const product = props.product || {};
    const image = product.images?.[0];
    const displayPrice = Number(product.actualPrice ?? product.price ?? product.labelledPrice ?? 0);

    return (
        <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div className="h-56 w-full bg-amber-100">
                {image ? (
                    <img
                        src={image}
                        alt={product.name || 'Product image'}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                            event.currentTarget.src = 'https://via.placeholder.com/640x480?text=No+Image';
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-amber-100 text-sm font-semibold text-amber-700">
                        No image available
                    </div>
                )}
            </div>

            <div className="space-y-3 p-5">
                <div>
                    <h2 className="text-lg font-bold text-amber-950">{product.name || 'Untitled product'}</h2>
                    <p className="text-sm text-amber-700">{product.category || 'Uncategorized'}</p>
                </div>

                <div className="flex items-center justify-between gap-3">
                    <p className="text-xl font-bold text-amber-900">Rs {displayPrice.toLocaleString()}</p>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Brand:</span> {product.brand || 'N/A'}</p>
                    <p><span className="font-semibold">Material:</span> {product.material || 'N/A'}</p>
                    <p><span className="font-semibold">Color:</span> {product.color || 'N/A'}</p>
                    <p><span className="font-semibold">Stock:</span> {product.stock ?? 0}</p>
                </div>

                {product.description && (
                    <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                        {product.description}
                    </p>
                )}
            </div>
        </div>
    );
}

    