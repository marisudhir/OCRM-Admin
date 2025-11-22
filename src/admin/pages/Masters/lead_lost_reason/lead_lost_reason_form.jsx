import { useState, useEffect } from "react";

export function LostReasonForm({ onSubmit, editData, onCancel, loading = false }) {
    const [lostReason, setLostReason] = useState("");
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (editData) {
            setLostReason(editData.reason || editData.lostReason || editData.cLeadLostReason || "");
        }
    }, [editData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");
        
        if (!lostReason.trim()) {
            setFormError("Please enter a lost reason");
            return;
        }
        
        console.log("Form submitting with data:", lostReason);
        onSubmit(lostReason);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-lg text-gray-800">
                {editData ? "Edit Lost Reason" : "Create New Lost Reason"}
            </h3>

            {formError && (
                <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
                    {formError}
                </div>
            )}

            <input
                className="p-3 rounded w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                value={lostReason}
                placeholder="Enter lost reason..."
                onChange={(e) => setLostReason(e.target.value)}
                type="text"
                disabled={loading}
            />

            <div className="flex gap-3">
                <button 
                    className="flex-1 p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Processing..." : (editData ? "Update" : "Create")}
                </button>

                <button 
                    className="flex-1 p-2 bg-gray-300 text-black rounded hover:bg-gray-400 disabled:bg-gray-200 transition-colors"
                    onClick={onCancel} 
                    type="button"
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}