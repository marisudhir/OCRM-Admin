import React, { useState, useEffect } from 'react';
import useCountryController from './countryController';
import CountryForm from './Sub-Component/countryForm';
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  try {
    return new Date(dateString).toLocaleDateString('en-GB', options);
  } catch (e) {
    console.error('Date formatting error:', e);
    return dateString;
  }
};

const CountryMaster = () => {
  const { 
    countries: rawCountries = [], 
    fetchCountries, 
    addNewCountry,
    updateCountry,
    deleteCountry,
    loading, 
    error 
  } = useCountryController();
  
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Ensure countries is always an array
  const countries = Array.isArray(rawCountries) ? rawCountries : [];

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleEdit = (country) => {
    setCurrentCountry(country);
    setShowForm(true);
  };

  const handleAdd = () => {
    setCurrentCountry(null);
    setShowForm(true);
  };
const handleFormSubmit = async (formData) => {
  try {
    let success = false;
    if (formData.iCountry_id) {
      // ✅ FIXED: Pass both ID and data
      success = await updateCountry(formData.iCountry_id, formData);
    } else {
      success = await addNewCountry(formData);
    }

    if (success) {
      setSuccessMessage(
        formData.iCountry_id
          ? 'Country updated successfully!'
          : 'Country added successfully!'
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowForm(false);
      fetchCountries();
    }
  } catch (err) {
    console.error('Form submission error:', err);
  }
};


  const handleDelete = async (countryId) => {
    if (window.confirm('Are you sure you want to deactivate this Country?')) {
      await deleteCountry(countryId);
      fetchCountries();
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = countries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  if (loading && countries.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
        <button onClick={fetchCountries} className="ml-2 underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Country Master</h1>
        
        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            + Add Country
          </button>
        </div>

        {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <CountryForm
      initialData={currentCountry || {}}
      onSubmit={handleFormSubmit}
      onClose={() => setShowForm(false)}
      loading={loading}
    />
  </div>
)}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((country, index) => (
                <tr key={country.iCountry_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{indexOfFirstItem + index + 1}</td>
<td className="px-6 py-4 whitespace-nowrap">{country.cCountry_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      country.bactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {country.bactive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(country.cCreate_dt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(country)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(country.iCountry_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center mt-4 space-x-4">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
    >
      Previous
    </button>

    <span className="text-gray-700 font-medium">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default CountryMaster;