import React, { useState, useEffect } from 'react';
import { useIndustryController } from './industryController';
import IndustryForm from './Sub-Components/industryFormData';
import formatDate from '../../../utils/formatDate';

const LeadIndustry = () => {
  const { industries, fetchIndustryData, updateIndustry, deleteIndustry } = useIndustryController();
  const [showForm, setShowForm] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchIndustryData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;  
  const currentIndustries = industries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(industries.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getUserAndCompanyFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return { userId: null, companyId: null };

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return {
        userId: payload.user_id || null,
        companyId: payload.company_id || null,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return { userId: null, companyId: null };
    }
  };

  const handleEdit = (industry) => {
    setEditingIndustry(industry);
    setShowForm(true);
  };

  const handleUpdate = async (formData) => {
    const { userId, companyId } = getUserAndCompanyFromToken();
    
    if (!userId || !companyId) {
      alert('User or company info missing! Please log in.');
      return false;
    }

    const payload = {
      cindustry_name: formData.cindustry_name.trim(),
      dupdated_dt: new Date().toISOString(),
      icompany_id: companyId,
      updated_by: userId,
    };

    const success = await updateIndustry(editingIndustry.iindustry_id, payload);
    if (success) {
      setEditingIndustry(null);
      setShowForm(false);
    }
    return success;
  };

  const handleDelete = async (industry) => {
    if (!window.confirm(`Are you sure you want to delete "${industry.cindustry_name}"?`)) {
      return;
    }

    const { userId, companyId } = getUserAndCompanyFromToken();
    
    if (!userId || !companyId) {
      alert('User or company info missing! Please log in.');
      return;
    }

    const payload = {
      bactive: false,
      dupdated_dt: new Date().toISOString(),
      icompany_id: companyId,
      updated_by: userId,
    };

    const success = await deleteIndustry(industry.iindustry_id, payload);
    if (success) {
      alert('Industry deleted successfully!');
    } else {
      alert('Failed to delete industry!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 leading-tight">
          Lead Industries
        </h1>

        <div className="flex justify-end mb-6">
          <button
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
            onClick={() => {
              setEditingIndustry(null);
              setShowForm(true);
            }}
          >
            + Add Lead Industry
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4">
              <IndustryForm 
                onClose={() => {
                  setShowForm(false);
                  setEditingIndustry(null);
                }} 
                onSuccess={fetchIndustryData}
                industry={editingIndustry}
                onUpdate={handleUpdate}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  S.No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lead Industry
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentIndustries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No lead industries found.
                  </td>
                </tr>
              ) : (
                currentIndustries.map((industry, index) => (
                  <tr
                    key={industry.iindustry_id || `industry-${indexOfFirstItem + index}`}
                    className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {industry.cindustry_name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {industry.iindustry_id || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(industry.dcreated_dt) || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(industry)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(industry)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

export default LeadIndustry;