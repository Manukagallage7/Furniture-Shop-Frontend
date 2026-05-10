export default function PagInator({ currentPage, totalPages, onPageChange, limit, setLimit }) {
    return (
        <div className="w-full flex flex-row justify-between items-center gap-4 mt-6 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-md">
            <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700">Items per page:</label>
                <select
                    className="px-3 py-2 border-2 border-amber-300 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer hover:border-amber-400"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                >
                    {[10, 20, 50, 100].map((option) => (
                        <option key={option} value={option}>
                            {option} per page
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-3">
                <select
                    className="px-3 py-2 border-2 border-amber-300 rounded-lg bg-white text-gray-800 font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer hover:border-amber-400"
                    value={currentPage}
                    onChange={(e) => onPageChange(parseInt(e.target.value))}
                >
                    {Array.from({ length: totalPages }, (_, i) => (
                        <option key={i} value={i + 1}>
                            Page {i + 1}
                        </option>
                    ))}
                </select>
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                    {currentPage} of {totalPages}
                </span>
            </div>
        </div>
    )
}