import React, { useState, useEffect } from 'react';
import { useServices } from '../useServices';
import { useSharedController } from '../../../../api/shared/controller';
import { toast } from 'react-toastify';
import { getCompanyIdFromToken, getUserIdFromToken } from '../../../../utils/tokenUtils';

const ServiceForm = ({ onClose, onSuccess, service, onUpdate }) => {
  const { createLeadServices } = useServices();
  const { companies, fetchCompanies } = useSharedController();
  const isEditing = !!service;

  // Local state variables
  const [formData, setFormData] = useState({
    serviceName: '',
    cservice_name: '',
    icompany_id: ''
  });

  // Get user info from token
  const userId = getUserIdFromToken();

  // Fetch companies when component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Initialize form with service data when editing
  useEffect(() => {
    if (isEditing && service) {
      setFormData({
        serviceName: service.serviceName || service.cservice_name || '',
        cservice_name: service.cservice_name || service.serviceName || '',
        icompany_id: service.icompany_id || ''
      });
    } else {
      // Set default company from token for new entries
      const tokenCompanyId = getCompanyIdFromToken();
      if (tokenCompanyId) {
        setFormData(prev => ({
          ...prev,
          icompany_id: tokenCompanyId
        }));
      }
    }
  }, [isEditing, service]);

  // Handle change for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'icompany_id' ? parseInt(value) || '' : value
    }));
  };

  // Handle form submission
// In ServiceForm component - handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted:', formData);
  console.log('Editing service:', service); // Debug log
  
  // Validate form data
  if (!formData.serviceName.trim()) {
    toast.error('Service name is required!');
    return;
  }

  if (!formData.icompany_id) {
    toast.error('Please select a company!');
    return;
  }

  if (!userId) {
    toast.error('User information not found. Please log in again.');
    return;
  }

  try {
    let success = false;
    
    if (isEditing && service) {
      // Use serviceId instead of iservice_id
      const serviceId = service.serviceId || service.iservice_id;
      
      if (!serviceId) {
        toast.error("Service ID not found for editing!");
        return;
      }

      console.log('Updating service with ID:', serviceId); // Debug log
      
      // Update existing service
      const updateData = {
        cservice_name: formData.serviceName.trim(),
        serviceName: formData.serviceName.trim(),
        icompany_id: formData.icompany_id,
        dupdated_dt: new Date().toISOString(),
        updated_by: userId
      };
      
      success = await onUpdate(serviceId, updateData);
      if (success) {
        toast.success("Lead service updated successfully!");
        onSuccess?.();
        onClose();
      } else {
        toast.error("Error updating service!");
      }
    } else {
      // Create new service
      const createData = {
        serviceName: formData.serviceName.trim(),
        cservice_name: formData.serviceName.trim(),
        icompany_id: formData.icompany_id,
        created_by: userId,
        dcreated_dt: new Date().toISOString()
      };

      success = await createLeadServices(createData);
      if (success) {
        toast.success("Lead service created successfully!");
        onSuccess?.();
        onClose();
      } else {
        toast.error("Error creating service!");
      }
    }
  } catch (err) {
    console.error('Submit error:', err);
    toast.error('Submission failed: ' + err.message);
  }
};
  // Get company name for display
  const getSelectedCompanyName = () => {
    if (!formData.icompany_id) return 'Not selected';
    const selectedCompany = companies.find(company => company.iCompany_id === formData.icompany_id);
    return selectedCompany ? selectedCompany.cCompany_name : 'Unknown Company';
  };

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl mb-4">
        {isEditing ? 'Edit Lead Service' : 'Create Lead Service'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        {/* Service Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Service Name</label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service name"
            required
          />
        </div>

        {/* Company Selection Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium">Company <span className="text-red-500">*</span></label>
          <select
            name="icompany_id"
            value={formData.icompany_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose company</option>
            {companies.map((company, index) => (
              <option key={company.iCompany_id || index} value={company.iCompany_id}>
                {company.cCompany_name}
              </option>
            ))}
          </select>
          {formData.icompany_id && (
            <p className="text-xs text-green-600 mt-1">
              Selected: {getSelectedCompanyName()}
            </p>
          )}
        </div>

        {/* User Info Display (Read-only) */}
        <div className="bg-gray-50 p-3 rounded border">
          <label className="block text-sm font-medium text-gray-600 mb-1">User Information</label>
          <div className="text-sm text-gray-700">
            <p>User ID: {userId || 'Not available'}</p>
            <p className="text-xs text-gray-500 mt-1">
              User information is automatically taken from your account
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;