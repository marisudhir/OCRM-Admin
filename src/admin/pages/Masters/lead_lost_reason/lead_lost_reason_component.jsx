import { useEffect, useState } from "react";
import { useLeadLostReason } from "./lead_lost_reason_controller";
import { LostReasonForm } from "./lead_lost_reason_form";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function LeadLostReason({ company }) {
  const {
    leadLostReasons,
    loading,
    error,
    getLeadLostReasonByCompanyId,
    createLeadLostReasonController,
    updateLeadLostReasonController,
    deleteLeadLostReasonController,
  } = useLeadLostReason();

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Load reasons for company
  useEffect(() => {
    if (company) {
      getLeadLostReasonByCompanyId(company);
    }
  }, [company]);

  return (
    <div className="p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800">Lead Lost Reasons</h2>

        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add New
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative bg-white rounded-xl p-6 shadow-xl w-[380px] animate-slideUp">

            {/* Close */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
            >
              <CloseIcon fontSize="small" />
            </button>

            {/* FORM */}
            <LostReasonForm
              editData={editItem}
              onSubmit={(data) => {
                if (editItem) {
                  updateLeadLostReasonController(editItem.lostReasonId, data);
                } else {
                  createLeadLostReasonController(data);
                }
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Reason</th>
              <th className="px-5 py-3">Created</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>

       <tbody className="text-gray-800">
  {leadLostReasons?.filter(item => item?.isActive === true).length === 0 ? (
    <tr>
      <td colSpan={5} className="py-4 text-center text-gray-500">
        No active lost reasons found.
      </td>
    </tr>
  ) : (
    leadLostReasons
      .filter(item => item?.isActive === true)
      .map((item, index) => (
        <tr
          key={item.lostReasonId || index}
          className="hover:bg-gray-50 border-b transition"
        >
          <td className="px-5 py-3">{index + 1}</td>

          <td className="px-5 py-3 font-medium">
            {item.reason || "—"}
          </td>

          <td className="px-5 py-3">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              {item.createdAt || "—"}
            </span>
          </td>

          <td className="px-5 py-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.isActive ? "Active" : "Inactive"}
            </span>
          </td>

          <td className="px-5 py-3 flex gap-3">
            <button
              onClick={() => {
                setEditItem(item);
                setShowForm(true);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <EditIcon />
            </button>

            <button
              onClick={() =>
                deleteLeadLostReasonController(item.lostReasonId)
              }
              className="text-red-600 hover:text-red-800"
            >
              <DeleteIcon />
            </button>
          </td>
        </tr>
      ))
  )}
</tbody>

        </table>
      </div>

      {/* Loading + Error */}
      {loading && <p className="text-gray-600 mt-3">Loading...</p>}
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
