import { useEffect, useState } from 'react';
import * as leadSourceModel from './leadSourceModel';

export const useLeadSourceController = () => {
  const [leadSource, setLeadSource] = useState([]);
  const [error, setError] = useState(null); // Optional: Error state

  // Fetch all lead statuses
  const fetchLeadSource = async () => {
    try {
      const data = await leadSourceModel.getAllLeadSource();
      setLeadSource(data);
    } catch (err) {
      console.error('Failed to fetch lead status:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  // Create a new lead status
  const createLeadSource = async (formData) => {
    try {
      await leadSourceModel.addNewLeadSource(formData);
      await fetchLeadSource();
      return true;
    } catch (err) {
      console.error('Failed to create lead status:', err);
      setError(err.message || 'Could not create lead status');
      return false;
    }
  };



  return {
    leadSource,
    createLeadSource,
    fetchLeadSource,
    error, // Optional: expose to show in UI
  };
};
