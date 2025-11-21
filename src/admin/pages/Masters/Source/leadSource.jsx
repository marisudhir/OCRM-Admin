import React, { useState, useEffect, useMemo } from 'react';
import LeadSourceForm from './Sub-Components/leadSourceForm';
import { useLeadSourceController } from './leadSourceController';
import formatDate from '../../../utils/formatDate';

const LeadSource = ({ company = "" }) => {
  const { leadSource, fetchLeadSource, deleteLeadSource, loading, error } = useLeadSourceController();

  // State for filtering by company
  const [selectedCompany, setSelectedCompany] = useState(company);
  // State for form visibility and mode
  const [showForm, setShowForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch data on component mount
  useEffect(() => {
    fetchLeadSource();
  }, []);

  // Generate unique list of companies
  const companies = useMemo(() => {
    if (!leadSource || leadSource.length === 0) return [];
    return [...new Set(leadSource.map(source => source.company?.cCompany_name || "Unknown Company"))];
  }, [leadSource]);

  // Filter lead sources based on selected company
  const filteredLeadSource = useMemo(() => {
    if (!leadSource) return [];
    return selectedCompany
      ? leadSource.filter(source => (source.company?.cCompany_name || "Unknown Company") === selectedCompany)
      : leadSource;
  }, [leadSource, selectedCompany]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeadSource.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeadSource.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCompany, filteredLeadSource.length]);

  // Handle Edit
  const handleEdit = (source) => {
    setEditingSource(source);
    setShowForm(true);
  };

  // Handle Delete
  const handleDelete = async (sourceId, sourceName) => {
    if (window.confirm(`Are you sure you want to delete "${sourceName}"?`)) {
      const success = await deleteLeadSource(sourceId);
      if (success) {
        // Success message or notification can be added here
        console.log('Lead source deleted successfully');
      }
    }
  };

  // Handle Form Close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingSource(null);
  };

  // Handle Form Success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSource(null);
    fetchLeadSource(); // Refresh data
  };

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading lead source data...</p>
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
          Lead Sources
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
            + Add Lead Source
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <LeadSourceForm 
                onClose={handleFormClose} 
                onSuccess={handleFormSuccess}
                editData={editingSource}
              />
            </div>
          </div>
        )}

        {/* Lead Source Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Source Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No lead sources found for the selected criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((source, index) => (
                  <tr
                    key={source.source_id || `source-${indexOfFirstItem + index}`} 
                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {source.source_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {source.company?.cCompany_name || "Unknown Company"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {source.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(source.updated_at) || "Unknown Date"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(source)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(source.source_id, source.source_name)}
                          className="text-red-600 hover:text-red-900 transition-colors"
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
};

export default LeadSource;