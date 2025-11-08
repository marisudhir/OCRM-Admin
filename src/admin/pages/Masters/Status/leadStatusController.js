import { useEffect, useState } from 'react';
import * as leadStatusModel from './leadStatusModel';

export const useLeadStatusController = () => {
  const [leadStatus, setLeadStatus] = useState([]);
  const [error, setError] = useState(null); // Optional: Error state

  // Fetch all lead statuses
  const fetchLeadStatus = async () => {
    try {
      const data = await leadStatusModel.getAllLeadStatus();
      setLeadStatus(data);
    } catch (err) {
      console.error('Failed to fetch lead status:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  // Create a new lead status
  const createLeadStatus = async (formData) => {
    try {
      await leadStatusModel.addNewLeadStatus(JSON.stringify(formData));
      await fetchLeadStatus();
      return true;
    } catch (err) {
      console.error('Failed to create lead status:', err);
      setError(err.message || 'Could not create lead status');
      return false;
    }
  };

 
  return {
    leadStatus,
    createLeadStatus,
    fetchLeadStatus,
    error, 
  };
};
