import React, { useState, useEffect } from "react";
import useDurationController from "./durationController";
import DurationForm from "./sub-component/duration-form";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  // accept either ISO string or backend keys. safe fallback
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Date formatting error:", e);
    return dateString;
  }
};

const DurationMaster = () => {
  const {
    durations: rawDurations = [],
    fetchDuration,
    createDuration,
    updateDuration,
    deleteDuration,
    loading,
    error,
  } = useDurationController();

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentDuration, setCurrentDuration] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // normalize durations to array
const durations = Array.isArray(rawDurations)
  ? rawDurations
      .filter((d) => d?.bactive === true)
      .sort((a, b) => {
        const dateA = new Date(a?.updated_at ?? a?.created_at ?? a?.cCreate_dt ?? 0);
        const dateB = new Date(b?.updated_at ?? b?.created_at ?? b?.cCreate_dt ?? 0);
        return dateB - dateA; // latest first
      })
  : [];

  useEffect(() => {
    fetchDuration();
  }, [fetchDuration]);

  const handleEdit = (duration) => {
    setCurrentDuration(duration);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentDuration(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let success = false;

      // backend id is plan_duration_id
      if (formData.plan_duration_id) {
        success = await updateDuration(formData.plan_duration_id, formData);
      } else {
        success = await createDuration(formData);
      }

      if (success) {
        setSuccessMessage(
          formData.plan_duration_id
            ? "Duration updated successfully!"
            : "Duration added successfully!"
        );

        // auto-clear message
        setTimeout(() => setSuccessMessage(""), 3000);

        setShowForm(false);
        await fetchDuration();
      }
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to deactivate this duration?")) {
      const ok = await deleteDuration(id);
      if (ok) {
        setSuccessMessage("Duration deactivated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        await fetchDuration();
      }
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = durations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(durations.length / itemsPerPage));

  if (loading && durations.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message || JSON.stringify(error)}
        <div className="mt-2">
          <button
            onClick={fetchDuration}
            className="underline text-sm text-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Duration Master</h1>

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add Duration
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Total: <span className="font-medium">{durations.length}</span>
          </div>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <DurationForm
              initialData={currentDuration || {}}
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
              loading={loading}
            />
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  S.No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration (Months)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No durations found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => {
                  // prefer backend fields: plan_duration_id, duration_in_months, bactive, created_at or cCreate_dt
                  const id = item.plan_duration_id;
                  const createdAt = item.created_at ?? item.cCreate_dt ?? null;

                  return (
                    <tr key={id ?? index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {indexOfFirstItem + index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.duration_in_months ?? "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.bactive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.bactive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(createdAt)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap space-x-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DurationMaster;
