// LeadPotential.js - Update the table and handlers
import React, { useState, useEffect, useMemo } from 'react';
import LeadPotentialForm from './Sub-Components/leadPotentialForm';
import { useLeadPotentialController } from './leadPotentialController';
import formatDate from '../../../utils/formatDate';

const LeadPotential = ({ company = "" }) => {
  const {
    leadPotential,
    fetchLeadPotential,
    loading,
    error,
    deletePotential
  } = useLeadPotentialController();

  const [selectedCompany, setSelectedCompany] = useState(company);
  const [showForm, setShowForm] = useState(false);
  const [editingPotential, setEditingPotential] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch on mount
  useEffect(() => {
    fetchLeadPotential();
  }, []);

  // Companies list for filter dropdown
  const companies = useMemo(() => {
    if (!leadPotential || leadPotential.length === 0) return [];
    return [...new Set(leadPotential.map(potential => potential.company?.cCompany_name || "Unknown Company"))];
  }, [leadPotential]);

  // Filtered by company
const filteredLeadPotential = useMemo(() => {
  if (!leadPotential) return [];

  // Filter out inactive (bactive === false)
  const activeOnly = leadPotential.filter(p => p.bactive !== false);

  return selectedCompany
    ? activeOnly.filter(p => (p.company?.cCompany_name || "Unknown Company") === selectedCompany)
    : activeOnly;
}, [leadPotential, selectedCompany]);


  // Pagination indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeadPotential.slice(indexOfFirstItem, indexOfLastItem);

  // Total pages
  const totalPages = Math.ceil(filteredLeadPotential.length / itemsPerPage);

  // Paginate
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCompany, filteredLeadPotential.length]);

  // Delete handler
  const handleDelete = async (id) => {
    if (!id) {
      alert("Error: Cannot delete - missing lead potential ID");
      return;
    }

    if (window.confirm('Are you sure you want to delete this lead potential?')) {
      const success = await deletePotential(id);
      if (success) {
        alert('Lead potential deleted successfully!');
      } else {
        alert('Failed to delete lead potential!');
      }
    }
  };

  // Edit handler
  const handleEdit = (potential) => {
    setEditingPotential(potential);
    setShowForm(true);
  };

  // Close form modal
  const handleFormClose = () => {
    setShowForm(false);
    setEditingPotential(null);
  };

  // After successful create/update, refresh list & close form
  const handleFormSuccess = () => {
    fetchLeadPotential();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead potential data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-600 text-lg">Error: {error.message || "Failed to fetch data."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 leading-tight">
          Lead Potential
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          {/* Dropdown Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="">All Companies</option>
              {companies.map((company, index) => (
                <option key={company || index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowForm(true)}
          >
            + Add Lead Potential
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <LeadPotentialForm 
                onClose={handleFormClose} 
                onSuccess={handleFormSuccess} 
                editData={editingPotential}
              />
            </div>
          </div>
        )}

        {/* Lead Potential Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No lead potentials found for the selected criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((potential, index) => (
                  <tr 
                    key={potential.ileadpoten_id || index} 
                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {potential.clead_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {potential.company?.cCompany_name || "Unknown Company"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(potential.dcreated_dt) || "Unknown Date"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(potential)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(potential.ileadpoten_id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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

export default LeadPotential;