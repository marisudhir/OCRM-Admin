import { useState } from 'react';
import * as industryModel from './industryModel';

export const useIndustryController = () => {
  const [industries, setIndustries] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all lead statuses (only active ones)
  const fetchIndustryData = async () => {
    try {
      const data = await industryModel.getAllIndustry();
      setIndustries(data);
    } catch (err) {
      console.error('Failed to fetch industries:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  // Create a new lead status
  const createIndustry = async (formData) => {
    try {
      await industryModel.addNewIndustry(formData);
      await fetchIndustryData();
      return true;
    } catch (err) {
      console.error('Failed to create industry:', err);
      setError(err.message || 'Could not create industry');
      return false;
    }
  };

  // Update an existing lead status
  const updateIndustry = async (industryId, formData) => {
    try {
      await industryModel.updateIndustry(industryId, formData);
      await fetchIndustryData();
      return true;
    } catch (err) {
      console.error('Failed to update industry:', err);
      setError(err.message || 'Could not update industry');
      return false;
    }
  };

  // Delete (soft delete) a lead status
  const deleteIndustry = async (industryId, formData) => {
    try {
      await industryModel.deleteIndustry(industryId, formData);
      await fetchIndustryData();
      return true;
    } catch (err) {
      console.error('Failed to delete industry:', err);
      setError(err.message || 'Could not delete industry');
      return false;
    }
  };

  return {
    industries,
    createIndustry,
    updateIndustry,
    deleteIndustry,
    fetchIndustryData,
    error,
  };
};