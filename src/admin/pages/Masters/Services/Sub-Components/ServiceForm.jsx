import React, { useState, useEffect } from 'react';
import { useServices } from '../useServices';
import { useToast } from '../../../../../context/ToastContext';
import { getCompanyIdFromToken , getUserIdFromToken} from '../../../../utils/tokenUtils' ;

const ServiceForm = ({ onClose, onSuccess, service, onUpdate }) => {
  const { createLeadServices } = useServices();
  const { showToast } = useToast();
  const isEditing = !!service;

  // Local state variables
  const [formData, setFormData] = useState({
    serviceName: '',
    cservice_name: ''
  });

  // Get company and user info from token
  const companyId = getCompanyIdFromToken();
  const userId = getUserIdFromToken();

  // Initialize form with service data when editing
  useEffect(() => {
    if (isEditing && service) {
      setFormData({
        serviceName: service.serviceName || service.cservice_name || '',
        cservice_name: service.cservice_name || service.serviceName || ''
      });
    }
  }, [isEditing, service]);

  // Handle change for input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Validate token data
    if (!companyId) {
      alert('Company information not found. Please log in again.');
      return;
    }

    if (!userId) {
      alert('User information not found. Please log in again.');
      return;
    }

    try {
      let success = false;
      
      if (isEditing) {
        // Update existing service
        const updateData = {
          cservice_name: formData.serviceName || formData.cservice_name,
          serviceName: formData.serviceName || formData.cservice_name,
          dupdated_dt: new Date().toISOString(),
          icompany_id: companyId, // From token
          updated_by: userId // From token
        };
        
        success = await onUpdate(service.iservice_id, updateData);
        if (success) {
          showToast("success", "Lead service updated successfully!");
          onSuccess?.();
          onClose();
        } else {
          alert("Error updating service!");
        }
      } else {
        // Create new service
        const createData = {
          serviceName: formData.serviceName,
          cservice_name: formData.serviceName,
          icompany_id: companyId, // From token
          created_by: userId, // From token
          dcreated_dt: new Date().toISOString()
        };

        success = await createLeadServices(createData);
        if (success) {
          showToast("success", "Lead service created successfully!");
          onSuccess?.();
          onClose();
        } else {
          alert("Error creating service!");
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Submission failed: ' + err.message);
    }
  };

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl">
        {isEditing ? 'Edit Lead Service' : 'Create Lead Service'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium">Service Name</label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter service name"
            required
          />
        </div>

        {/* Display company info (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Company</label>
          <div className="w-full border p-2 rounded bg-gray-50 text-gray-700">
            {companyId ? `Company ID: ${companyId}` : 'Not available'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Company information is automatically taken from your account</p>
        </div>

        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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