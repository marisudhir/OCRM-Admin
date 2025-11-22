import { useEffect, useState, useMemo } from "react";
import { useLeadLostReason } from "./lead_lost_reason_controller";
import { useSharedController } from "../../../api/shared/controller";
import { LostReasonForm } from "./lead_lost_reason_form";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


export function LeadLostReason({ company = "" }) {
  const {
    leadLostReasons,
    loading,
    error,
    message,
    getLeadLostReasonByCompanyId,
    createLeadLostReasonController,
    updateLeadLostReasonController,
    deleteLeadLostReasonController,
  } = useLeadLostReason();

  const { companies, fetchCompanies } = useSharedController();

  const [selectedCompany, setSelectedCompany] = useState(company || "");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load all data on component mount
  useEffect(() => {
    getLeadLostReasonByCompanyId();
    fetchCompanies();
  }, []);

  // Filter data based on selected company
  const filteredReasons = useMemo(() => {
    if (!selectedCompany) return leadLostReasons;
    
    return leadLostReasons.filter(item => 
      item.icompany_id === parseInt(selectedCompany) && item?.isActive !== false
    );
  }, [leadLostReasons, selectedCompany]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReasons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReasons.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCompany, filteredReasons.length]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    let success = false;
    
    if (editItem) {
      success = await updateLeadLostReasonController(editItem.lostReasonId || editItem.ilead_lost_reason_id, formData);
    } else {
      success = await createLeadLostReasonController(formData);
    }
    
    if (success) {
      setShowForm(false);
      setEditItem(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reason?")) {
      await deleteLeadLostReasonController(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead lost reasons...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 leading-tight">
          Lead Lost Reasons
        </h1>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
            {message}
          </div>
        )}

        {/* Filter and Add Button Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          {/* Company Dropdown Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="">All Companies</option>
              {companies.map((company, index) => (
                <option key={company.iCompany_id || index} value={company.iCompany_id}>
                  {company.cCompany_name}
                </option>
              ))}
            </select>
          </div>

          {/* Add New Button */}
          <button
            onClick={() => {
              setEditItem(null);
              setShowForm(true);
            }}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            + Add New Reason
          </button>
        </div>

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="relative bg-white rounded-xl p-6 shadow-xl w-full max-w-md mx-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditItem(null);
                }}
                className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
              >
                <CloseIcon fontSize="small" />
              </button>

              <LostReasonForm
                editData={editItem}
                onSuccess={handleSubmit}
                onClose={() => {
                  setShowForm(false);
                  setEditItem(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {selectedCompany ? "No lost reasons found for selected company." : "No lost reasons found."}
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => {
                  const companyName = companies.find(c => c.iCompany_id === item.icompany_id)?.cCompany_name || "Unknown Company";
                  
                  return (
                    <tr 
                      key={item.lostReasonId || item.ilead_lost_reason_id || index} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {item.reason || item.lostReason || item.cLeadLostReason || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.isActive === false || item.bactive === false 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.isActive === false || item.bactive === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setEditItem(item);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.lostReasonId || item.ilead_lost_reason_id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === number + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}