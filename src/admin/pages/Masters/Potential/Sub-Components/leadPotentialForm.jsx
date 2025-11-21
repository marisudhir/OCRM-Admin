import React, { useState, useEffect } from 'react';
import { useSharedController } from '../../../../api/shared/controller';
import  useLeadPotentialController  from '../leadPotentialController';

const LeadPotentialForm = ({ onClose, onSuccess, editData }) => {
  const { createLeadPotential, updateLeadPotential } = useLeadPotentialController();
  const { companies, fetchCompanies } = useSharedController();

  const [formData, setFormData] = useState({
    clead_name: '',
    icompany_id: '',
    // updatedBy: 3 // Default user ID
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        clead_name: editData.clead_name || '',
        icompany_id: editData.icompany_id || '',
        // updatedBy: 3
      });
    } else {
      setFormData({
        clead_name: '',
        icompany_id: '',
        // updatedBy: 3
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'icompany_id' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.clead_name || !formData.icompany_id) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    let isSuccess = false;
    
    try {
      if (editData && editData.ileadpoten_id) {
        // Update existing lead potential
        isSuccess = await updateLeadPotential(editData.ileadpoten_id, formData);
      } else {
        // Create new lead potential
        isSuccess = await createLeadPotential(formData);
      }

      if (isSuccess) {
        onSuccess?.();
        onClose();
      } else {
        alert(`Error ${editData ? 'updating' : 'creating'} lead potential!`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Error ${editData ? 'updating' : 'creating'} lead potential!`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl mb-4">
        {editData ? 'Edit' : 'Create'} Lead Potential
      </h1>  
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            name="clead_name"
            value={formData.clead_name}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Company</label>
          <select
            name="icompany_id"
            value={formData.icompany_id}
            onChange={handleChange}
            required
            disabled={submitting}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Choose company</option>
            {companies.map((company, index) => (
              <option key={index} value={company.iCompany_id}>
                {company.cCompany_name}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Processing...' : (editData ? 'Update' : 'Submit')}
          </button>
        </div>       
      </form>
    </div>       
  );
};

export default LeadPotentialForm;