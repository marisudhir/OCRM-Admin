import { useEffect, useState } from 'react';
import * as leadSourceModel from './leadSourceModel';

export const useLeadSourceController = () => {
  const [leadSource, setLeadSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all lead sources (only active ones)
  const fetchLeadSource = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leadSourceModel.getAllLeadSource();
      // Filter only active lead sources
      const activeSources = data.filter(source => source.is_active === true);
      setLeadSource(activeSources);
    } catch (err) {
      console.error('Failed to fetch lead sources:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead source
  const createLeadSource = async (formData) => {
    setError(null);
    try {
      await leadSourceModel.addNewLeadSource(formData);
      await fetchLeadSource(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to create lead source:', err);
      setError(err.message || 'Could not create lead source');
      return false;
    }
  };

  // Update an existing lead source
  const updateLeadSource = async (sourceId, formData) => {
    setError(null);
    try {
      await leadSourceModel.updateLeadSource(sourceId, formData);
      await fetchLeadSource(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to update lead source:', err);
      setError(err.message || 'Could not update lead source');
      return false;
    }
  };

  // Delete a lead source (soft delete by setting is_active to false)
  const deleteLeadSource = async (sourceId) => {
    setError(null);
    try {
      await leadSourceModel.deleteLeadSource(sourceId);
      await fetchLeadSource(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to delete lead source:', err);
      setError(err.message || 'Could not delete lead source');
      return false;
    }
  };

  return {
    leadSource,
    loading,
    error,
    createLeadSource,
    updateLeadSource,
    deleteLeadSource,
    fetchLeadSource,
  };
};