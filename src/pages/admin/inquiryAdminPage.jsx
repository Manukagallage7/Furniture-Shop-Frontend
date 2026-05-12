import { useEffect, useState } from "react";
import axios from "axios";
import Loader from '../../components/loader';
import { toast } from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { MdReply } from "react-icons/md";

export default function InquiryAdminPage() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [deleteModal, setDeleteModal] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please log in");
                setInquiries([]);
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/contact/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            let inquiriesData = [];
            if (Array.isArray(response.data)) {
                inquiriesData = response.data;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                inquiriesData = response.data.data;
            } else if (response.data?.inquiries && Array.isArray(response.data.inquiries)) {
                inquiriesData = response.data.inquiries;
            }

            setInquiries(inquiriesData);
            toast.success("Inquiries loaded successfully");
        } catch (error) {
            console.error("Error fetching inquiries:", error);
            setInquiries([]);
            toast.error(error.response?.data?.message || "Error loading inquiries");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteModal(id);
    };

    const confirmDelete = async () => {
        if (!deleteModal) return;

        setDeleting(true);
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/contact/delete/${deleteModal}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Inquiry deleted successfully");
            setInquiries(inquiries.filter(i => i._id !== deleteModal));
            setSelectedInquiry(null);
            setDeleteModal(null);
        } catch (error) {
            toast.error("Error deleting inquiry");
        } finally {
            setDeleting(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/contact/inquiries/${selectedInquiry.email}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Status updated");
            const updatedInquiry = { ...selectedInquiry, status: newStatus };
            setSelectedInquiry(updatedInquiry);
            setInquiries(inquiries.map(i => i._id === selectedInquiry._id ? updatedInquiry : i));
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) {
            toast.error("Please enter a reply");
            return;
        }

        setSending(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/contact/inquiries/${selectedInquiry._id}/reply`,
                { reply: replyText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success("Reply sent successfully");
            setReplyText("");

            // Update the inquiry
            const updatedInquiry = { ...selectedInquiry, replied: true, replyText };
            setSelectedInquiry(updatedInquiry);
            setInquiries(inquiries.map(i => i._id === selectedInquiry._id ? updatedInquiry : i));
        } catch (error) {
            console.error("Error sending reply:", error);
            toast.error("Error sending reply");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="w-full h-full bg-linear-to-br from-stone-50 via-amber-50 to-stone-100 p-4 sm:p-6 md:p-8 overflow-auto">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <div className="bg-linear-to-r from-amber-800 to-amber-700 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-5 sm:p-6 md:p-8 text-white">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Customer Inquiries</h1>
                    <p className="text-amber-100 text-sm sm:text-base md:text-lg">Total Inquiries: <span className="font-bold">{inquiries.length}</span></p>
                </div>
            </div>

            {/* Table Section */}
            {loading ? (
                <Loader />
            ) : (
                <div className="w-full">
                    {inquiries.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <p className="text-gray-500 text-lg">No inquiries yet</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-x-auto border-2 border-gray-200">
                            <table className="w-full">
                                <thead className="bg-linear-to-r from-amber-700 to-amber-600 text-white sticky top-0">
                                    <tr>
                                        <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Name</th>
                                        <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Email</th>
                                        <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Phone</th>
                                        <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Subject</th>
                                        <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Date</th>
                                        <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Message</th>
                                        <th className="border-b-2 border-gray-300 p-3 sm:p-4 text-left text-xs sm:text-sm font-bold uppercase tracking-wide">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.map(inquiry => (
                                        <tr
                                            key={inquiry._id}
                                            className="border-b border-gray-200 hover:bg-amber-50 transition duration-200 cursor-pointer"
                                            onClick={() => setSelectedInquiry(inquiry)}
                                        >
                                            <td className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-gray-800">{inquiry.fullName}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">{inquiry.email}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">{inquiry.phone}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-800 font-semibold">{inquiry.subject}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-sm text-gray-700 truncate max-w-xs">{inquiry.message}</td>
                                            <td className="p-3 sm:p-4 text-xs sm:text-sm">
                                                <span className={`px-2 sm:px-3 py-1 rounded-full font-bold text-xs whitespace-nowrap ${inquiry.replied ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {inquiry.replied ? 'Replied' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Inquiry Details Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInquiry(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-amber-800">Inquiry Details</h2>
                            <button onClick={() => setSelectedInquiry(null)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                        </div>

                        {/* Inquiry Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-600">
                                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Name</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">{selectedInquiry.fullName}</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Email</p>
                                <p className="text-sm text-gray-800 mt-1 break-all">{selectedInquiry.email}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Phone</p>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{selectedInquiry.phone}</p>
                            </div>
                            <div className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-600">
                                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide">Subject</p>
                                <p className="text-lg font-semibold text-gray-800 mt-1">{selectedInquiry.subject}</p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Message</p>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                        </div>

                        {/* Submitted Date */}
                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-6">
                            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Submitted Date</p>
                            <p className="text-lg font-semibold text-amber-900">{new Date(selectedInquiry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>

                        {/* Status Editor */}
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-6">
                            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Update Status</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleUpdateStatus("Pending")}
                                    className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${selectedInquiry.status === "Pending" ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                                >
                                    Pending
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus("In Progress")}
                                    className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${selectedInquiry.status === "In Progress" ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                                >
                                    In Progress
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus("Resolved")}
                                    className={`flex-1 py-2 px-3 rounded-lg font-semibold transition ${selectedInquiry.status === "Resolved" ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                                >
                                    Resolved
                                </button>
                            </div>
                        </div>

                        {/* Existing Reply */}
                        {selectedInquiry.replied && selectedInquiry.replyText && (
                            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600 mb-6">
                                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Your Reply</p>
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedInquiry.replyText}</p>
                            </div>
                        )}

                        {/* Reply Section */}
                        {!selectedInquiry.replied && (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">Send Reply</p>
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    rows="4"
                                    className="w-full p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {!selectedInquiry.replied && (
                                <button
                                    onClick={handleReply}
                                    disabled={sending}
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    <MdReply size={20} />
                                    {sending ? "Sending..." : "Send Reply"}
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(selectedInquiry._id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                <MdDelete size={20} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        {/* Header with Icon */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-white bg-opacity-20 rounded-full p-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-center">Delete Inquiry?</h3>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-700 text-center mb-2">
                                Are you sure you want to delete this inquiry?
                            </p>
                            <p className="text-gray-500 text-sm text-center">
                                This action cannot be undone. The inquiry and all associated data will be permanently removed.
                            </p>

                            {/* Inquiry Preview */}
                            {selectedInquiry && (
                                <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                                    <p className="text-xs text-gray-600 font-semibold mb-1">Subject:</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate">{selectedInquiry.subject}</p>
                                    <p className="text-xs text-gray-600 mt-2">From: {selectedInquiry.fullName}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex gap-3">
                            <button
                                onClick={() => setDeleteModal(null)}
                                disabled={deleting}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
