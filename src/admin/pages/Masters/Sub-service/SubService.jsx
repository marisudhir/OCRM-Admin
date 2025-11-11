import { useState, useEffect, useMemo } from 'react';
import formatDate from '../../../utils/formatDate';
import { useSubService } from './useSubService';

const SubService = ({ company = {} }) => {
  console.log("company details are : ", company.iCompany_id)
  // Custom hooks for CRUD operations
  const { subService, fetchLeadSubService, loading, error } = useSubService(); // Assuming useLeadPotentialController provides loading and error states
  // Fetch data on component mount
  useEffect(() => {
    fetchLeadSubService(company.iCompany_id);
  }, [ company?.iCompany_id]); // Dependency array to prevent infinite loop


  // State to set the company values from the lead status list.
  const [selectedCompany, setSelectedCompany] = useState(company?.iCompany_id ?? '');
  // State to control the form visibility
  const [showForm, setShowForm] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust items per page here




  // Filter the data based on the dropdown menu
  // Memoize to re-calculate only when leadPotential or selectedCompany changes

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subService.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subService.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [ subService.length]); // Added filteredLeadPotential.length as a dependency


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
          Lead Sub-service
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-end items-center mb-6">
          {/* Dropdown Filter */}
          <div className="w-full sm:w-auto">
            {/* <select
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
            </select>  */}
          </div>

          {/* Add Button */}
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setShowForm(true)}
          >
            + Add Sub service
          </button>
        </div>

        {/* Renders the form according to the state */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              {/* <LeadPotentialForm onClose={() => setShowForm(false)} onSuccess={fetchLeadPotential} /> */}
            </div>
          </div>
        )}

        {/* Lead Potential Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sub-Service 
                </th>
                
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No lead potentials found for the selected criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((subService, index) => (
                  <tr
                    key={subService.ilead_potential_id || `potential-${indexOfFirstItem + index}`} // Using a stable ID or generated one
                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {subService.subservice_name || "Unknown"}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(subService.dcreated_dt) || "Unknown Date"}
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
                className={`px-4 py-2 rounded-lg transition-colors ${currentPage === number + 1
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

export default SubService;