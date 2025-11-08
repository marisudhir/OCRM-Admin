import {  useState } from 'react';
import * as industryModel from './industryModel';

export const useIndustryController = () => {
  const [industries, setIndusties] = useState([]);
  const [error, setError] = useState(null); // Optional: Error state

  // Fetch all lead statuses
  const fetchIndustryData = async () => {
    try {
      const data = await industryModel.getAllIndustry();
      setIndusties(data);
    } catch (err) {
      console.error('Failed to fetch lead potential:', err);
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
      console.error('Failed to create lead potential:', err);
      setError(err.message || 'Could not create lead potential');
      return false;
    }
  };

  
  return {
    industries,
    createIndustry,
    fetchIndustryData, // for component reload once create API hits
    error, // Optional: expose to show in UI
  };
};
