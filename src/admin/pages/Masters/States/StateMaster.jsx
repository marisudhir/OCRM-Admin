import  { useState, useEffect } from 'react';
import { getAllCountry } from '../../Masters/country/countryModel';
import useStateController from './stateController';
import StateForm from './Sub-Component/stateFrom';

// Custom Confirmation Modal component to replace window.confirm
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Action</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
};

const StateMaster = () => {
  // Destructure state and actions from the controller
  const { 
    states: rawStates = [], 
    fetchStates, 
    createState,
    updateState,
    deleteState,
    loading, 
    error 
  } = useStateController();

  // State for countries data (used in the form)
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState(null);

  // UI state management
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [currentState, setCurrentState] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch countries and states on component mount
    const fetchCountries = async () => {
      setCountriesLoading(true);
      setCountriesError(null);
      try {
        const data = await getAllCountry();
        setCountries(data);
      } catch (err) {
        setCountriesError(err);
        setCountries([]);
      } finally {
        setCountriesLoading(false);
    };
  }
    useEffect(()=>{
    fetchStates();
  }, [fetchStates]);
  
  // Filter states based on search query
  const filteredStates = Array.isArray(rawStates)
    ? rawStates.filter(state =>
        state.cState_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handler to open the form for editing an existing state
  const handleEdit = (state) => {
    setCurrentState(state);
    setShowForm(true);
  };

  // Handler to open the form for adding a new state
  const handleAdd = () => {
    setCurrentState(null);
    setShowForm(true);
  };

  // Handler for form submission (create or update)
  const handleFormSubmit = async (formData) => {
    try {
      let success;
      if (formData.iState_id) {
        success = await updateState({
          ...formData,
          iState_id: formData.iState_id
        });
      } else {
        success = await createState(formData);
      }

      if (success) {
        setSuccessMessage(
          formData.iState_id 
            ? 'State updated successfully! 🎉' 
            : 'State added successfully! 🎉'
        );
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowForm(false);
        fetchStates();
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  // Handler to trigger the confirmation modal for deactivation
  const handleDeactivateClick = (stateId) => {
    setStateToDelete(stateId);
    setShowDeleteConfirm(true);
  };

  // Handler for the actual deactivation logic after confirmation
  const handleConfirmDeactivate = async () => {
    if (stateToDelete) {
      await deleteState(stateToDelete);
      fetchStates();
    }
    setShowDeleteConfirm(false);
    setStateToDelete(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStates.length / itemsPerPage);

  // Render different states based on data fetching
  if (loading && rawStates.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-blue-600 font-semibold text-lg animate-pulse">
          Loading states...
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <p className="text-red-600 font-medium mb-4">Error: {error.message}</p>
          <button 
            onClick={fetchStates}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-gray-800">State Master</h1>
          <button
            onClick={()=>{handleAdd(),fetchCountries()}}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            + Add New State
          </button>
        </div>
        
        {successMessage && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 border-l-4 border-green-500 rounded-md shadow-sm">
            {successMessage}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <StateForm
              initialData={currentState || {}}
              onSubmit={handleFormSubmit}
              onClose={() => setShowForm(false)}
              loading={loading || countriesLoading}
              countries={countries}
            />
          </div>
        )}

        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => setShowDeleteConfirm(false)}
          message="Are you sure you want to deactivate this state? This action cannot be undone."
        />

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search states..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
        </div>

        {filteredStates.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg 
              className="w-20 h-20 mb-4 text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No States Found</h3>
            <p className="text-md text-center max-w-sm mb-6">
              {searchQuery ? `No states match your search for "${searchQuery}".` : `There are currently no states in the system. Click the button above to add a new one.`}
            </p>
            {!searchQuery && (
              <button 
                onClick={handleAdd}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Add New State
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase w-16">
                      S.No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase w-1/3">
                      State Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase w-1/3">
                      Country
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase w-24">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase w-48">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((state, index) => {
                    const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <tr key={state.iState_id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {displayIndex}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {state.cState_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {state.country?.cCountry_name || `ID: ${state.iCountry_id}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            state.bactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {state.bactive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => handleEdit(state)}
                            className="text-blue-600 hover:text-blue-900 mx-2 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeactivateClick(state.iState_id)}
                            className="text-red-600 hover:text-red-900 mx-2 font-medium"
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{indexOfFirstItem + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastItem, filteredStates.length)}</span> of <span className="font-semibold">{filteredStates.length}</span> results
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StateMaster;
