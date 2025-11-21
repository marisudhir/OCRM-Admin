import { useState, useEffect } from "react";

export function LostReasonForm({ onSubmit, editData, onCancel }) {
    const [lostReason, setLostReason] = useState("");

    useEffect(() => {
        if (editData) setLostReason(editData.reason);
    }, [editData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!lostReason.trim()) return;
        onSubmit(lostReason);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-12 rounded">
            <h3 className="font-bold">{editData ? "Edit Lost Reason" : "Create New Lost Reason"}</h3>

            <input
                className="p-2 rounded w-full border border-black"
                value={lostReason}
                placeholder="Enter lost reason..."
                onChange={(e) => setLostReason(e.target.value)}
                type="text"
            />

            <button className="p-1 bg-black text-white rounded" type="submit">
                {editData ? "Update" : "Create"}
            </button>

            <button className="p-1 bg-gray-300 text-black rounded" onClick={onCancel} type="button">
                Cancel
            </button>
        </form>
    );
}
