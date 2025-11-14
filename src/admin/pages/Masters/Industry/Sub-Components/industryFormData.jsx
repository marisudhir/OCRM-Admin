import React, { useState } from 'react';
import { useIndustryController } from '../industryController';

const LeadPotentialForm = ({ onClose, onSuccess }) => {
  const { createIndustry } = useIndustryController();

  const [formData, setFormData] = useState({
    cindustry_name: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Clear prior success message

    try {
      const { userId, companyId } = getUserAndCompanyFromToken();

      if (!userId) {
        alert('User info missing! Please log in.');
        return;
      }
      if (!companyId) {
        alert('Company info missing! Please log in.');
        return;
      }

      const payload = {
        cindustry_name: formData.cindustry_name.trim(),
        icompany_id: companyId,
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
    } catch (err) {
      console.error('Submit error:', err);
      alert('Submission failed: ' + err.message);
    }
  };

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl">Create Lead-industry</h1>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium" htmlFor="cindustry_name">
            Name
          </label>
          <input
            type="text"
            id="cindustry_name"
            name="cindustry_name"
            value={formData.cindustry_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>

        {successMessage && (
          <p className="mt-4 text-green-600 font-medium" role="alert">
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default LeadPotentialForm;
