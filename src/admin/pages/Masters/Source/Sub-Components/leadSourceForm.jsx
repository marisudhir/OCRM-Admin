import React, { useState, useEffect } from 'react';
import { useSharedController } from '../../../../api/shared/controller';
import { useLeadSourceController } from '../leadSourceController';

const LeadSourceForm = ({ onClose, onSuccess, editData = null }) => {
  const [formData, setFormData] = useState({
    source_name: '',
    description: '',
    icompany_id: 0,
    is_active: true
  });

  const { createLeadSource, updateLeadSource } = useLeadSourceController();
  const { companies, fetchCompanies } = useSharedController();

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editData) {
      setFormData({
        source_name: editData.source_name || '',
        description: editData.description || '',
        icompany_id: editData.icompany_id || 0,
        is_active: editData.is_active !== undefined ? editData.is_active : true
      });
    }
  }, [editData]);

  // Handle change for all input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'icompany_id' ? parseInt(value) : value)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    let success = false;
    if (editData) {
      success = await updateLeadSource(editData.source_id, formData);
    } else {
      success = await createLeadSource(formData);
    }
    
    if (success) {
      onClose();
      onSuccess();
    }
  };

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl">
        {editData ? 'Edit Lead Source' : 'Create Lead Source'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="source_name"
            value={formData.source_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description} 
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Company</label>
          <select
            name="icompany_id"
            value={formData.icompany_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          >
            <option value={0}>Choose company</option>
            {companies.map((company, index) => (
              <option key={index} value={company.iCompany_id}>
                {company.cCompany_name}
              </option>
            ))}
          </select>
        </div>

        {editData && (
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Active</label>
          </div>
        )}

        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            {editData ? 'Update' : 'Submit'}
          </button>
        </div>       
      </form>
    </div>       
  );
};

export default LeadSourceForm;