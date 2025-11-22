import React, { useState, useEffect } from 'react';
import { useIndustryController } from '../industryController';
import { useSharedController } from '../../../../api/shared/controller';

const IndustryForm = ({ onClose, onSuccess, industry, onUpdate }) => {
  const { createIndustry } = useIndustryController();
  const { companies, fetchCompanies } = useSharedController();
  const isEditing = !!industry;

  const [formData, setFormData] = useState({
    cindustry_name: '',
    icompany_id: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  // Fetch companies when component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Pre-fill data when editing
  useEffect(() => {
    if (isEditing && industry) {
      setFormData({
        cindustry_name: industry.cindustry_name || '',
        icompany_id: industry.icompany_id || '',
      });
    } else {
      setFormData({
        cindustry_name: '',
        icompany_id: '',
      });
    }
  }, [isEditing, industry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'icompany_id' ? parseInt(value) || '' : value,
    }));
  };

  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

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
      return payload.user_id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    try {
      const userId = getUserFromToken();

      if (!userId) {
        alert('User info missing! Please log in.');
        return;
      }

      if (!formData.icompany_id) {
        alert('Please select a company');
        return;
      }

      if (isEditing) {
        // Update existing industry
        const isSuccess = await onUpdate(formData);
        if (isSuccess) {
          setSuccessMessage('Lead industry updated successfully!');
          onSuccess?.();
          onClose();
        } else {
          alert('Error updating industry!');
        }
      } else {
        // Create new industry
        const payload = {
          cindustry_name: formData.cindustry_name.trim(),
          icompany_id: parseInt(formData.icompany_id),
          created_by: userId,
          dcreated_dt: new Date().toISOString(),
        };

        const isSuccess = await createIndustry(payload);

        if (isSuccess) {
          setSuccessMessage('Lead industry created successfully!');
          onSuccess?.();
          onClose();
        } else {
          alert('Error creating industry!');
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
        {isEditing ? 'Edit Lead Industry' : 'Create Lead Industry'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Industry Name</label>
          <input
            type="text"
            name="cindustry_name"
            value={formData.cindustry_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter industry name"
          />
        </div>

        {/* Company Dropdown - Similar to LeadStatusForm */}
        <div>
          <label className="block mb-1 text-sm font-medium">Company</label>
          <select
            name="icompany_id"
            value={formData.icompany_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose company</option>
            {companies.map((company, index) => (
              <option key={index} value={company.iCompany_id}>
                {company.cCompany_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </div>

        {successMessage && (
          <p className="mt-4 text-green-600 font-medium text-center" role="alert">
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default IndustryForm;