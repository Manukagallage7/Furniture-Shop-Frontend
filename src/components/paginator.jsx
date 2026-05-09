export default function PagInator({currentPage, totalPages, setPage, limit, setLimit}){

    return (
        <div className="flex items-center justify-center mt-4 space-x-2">
            <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                Previous
            </button>
            <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                Next
            </button>
        </div>
    )
}