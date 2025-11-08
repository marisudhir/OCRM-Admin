import { useEffect, useState } from 'react';
import * as leadPotentialModel from './leadPotentialModel';

export const useLeadPotentialController = () => {
  const [leadPotential, setLeadPotential] = useState([]);
  const [error, setError] = useState(null); // Optional: Error state

  // Fetch all lead statuses
  const fetchLeadPotential = async () => {
    try {
      const data = await leadPotentialModel.getAllLeadPotential();
      setLeadPotential(data);
    } catch (err) {
      console.error('Failed to fetch lead potential:', err);
      setError(err.message || 'Something went wrong');
    }
  };

  // Create a new lead status
  const createLeadPotential = async (formData) => {
    try {
      await leadPotentialModel.addNewLeadPotential(formData);
      await fetchLeadPotential();
      return true;
    } catch (err) {
      console.error('Failed to create lead potential:', err);
      setError(err.message || 'Could not create lead potential');
      return false;
    }
  };


  return {
    leadPotential,
    createLeadPotential,
    fetchLeadPotential, 
    error, 
  };
};
