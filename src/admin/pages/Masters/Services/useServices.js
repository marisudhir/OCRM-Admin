import { useState } from 'react';
import * as leadServiceModel from './leadServiceModel';
import { getCompanyIdFromToken, getUserIdFromToken } from '../../../utils/tokenUtils';

export const useServices = () => {
  const [leadServices, setLeadServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all lead services
  const fetchLeadServices = async (additionalDetails = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get company ID from token
      const companyId = getCompanyIdFromToken();
      
      if (!companyId) {
        throw new Error('Company ID not found in token');
      }

      const data = await leadServiceModel.getAllLeadServicesByCompanyId({
        companyId: companyId,
        additionalDetails: true
      });
      
      setLeadServices(data);
    } catch (err) {
      console.error('Failed to fetch lead services:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead service
  const createLeadServices = async (formData) => {
    setError(null);
    
    try {
      // Get company ID and user ID from token and add to form data
      const companyId = getCompanyIdFromToken();
      const userId = getUserIdFromToken();
      
      if (!companyId) {
        throw new Error('Company ID not found in token');
      }

      // Add company ID and created_by to the form data
      const dataWithCompanyId = {
        ...formData,
        icompany_id: companyId,
        created_by: userId,
        dcreated_dt: new Date().toISOString()
      };

      await leadServiceModel.addNewLeadService(dataWithCompanyId);
      await fetchLeadServices(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to create lead services:', err);
      setError(err.message || 'Could not create lead service');
      return false;
    }
  };

  // Update an existing lead service
  const updateLeadService = async (serviceId, formData) => {
    setError(null);
    
    try {
      // Get user ID from token for updated_by
      const userId = getUserIdFromToken();
      
      if (!userId) {
        throw new Error('User ID not found in token');
      }

      const updateData = {
        ...formData,
        updated_by: userId,
        dupdated_dt: new Date().toISOString()
      };

      await leadServiceModel.updateLeadService(serviceId, updateData);
      await fetchLeadServices(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to update lead service:', err);
      setError(err.message || 'Could not update lead service');
      return false;
    }
  };

  // Delete (soft delete) a lead service
  const deleteLeadService = async (serviceId) => {
    setError(null);
    
    try {
      // Get user ID from token for updated_by
      const userId = getUserIdFromToken();
      
      if (!userId) {
        throw new Error('User ID not found in token');
      }

      // For soft delete, we might need to send update data
      // If your API supports DELETE without body, use the model directly
      await leadServiceModel.deleteLeadService(serviceId);
      await fetchLeadServices(); // Refresh the list
      return true;
    } catch (err) {
      console.error('Failed to delete lead service:', err);
      setError(err.message || 'Could not delete lead service');
      return false;
    }
  };

  return {
    leadServices,
    loading,
    createLeadServices,
    updateLeadService,
    deleteLeadService,
    fetchLeadServices,
    error,
  };
};