// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead sources
export const getAllLeadSource = async () => {
  console.log(ENDPOINTS.LEAD_SOURCE);
  const res = await ApiHelper.getAll(ENDPOINTS.LEAD_SOURCE);
  console.log("The response is:", res);
  return res.data; 
};

// to add a new lead source
export const addNewLeadSource = async (data) => {
  console.log(ENDPOINTS.LEAD_SOURCE);
  return await ApiHelper.create(data, ENDPOINTS.LEAD_SOURCE);
};

// to update a lead source
export const updateLeadSource = async (sourceId, data) => {
  console.log('Updating source with ID:', sourceId);
  console.log('Update data:', data);
  
  // Clean the sourceId to ensure it's a proper number/string
  const cleanSourceId = String(sourceId).replace(/[^0-9]/g, '');
  console.log('Cleaned source ID:', cleanSourceId);
  
  return await ApiHelper.updateHelper(cleanSourceId, ENDPOINTS.LEAD_SOURCE, data);
};

// to delete a lead source (soft delete)
export const deleteLeadSource = async (sourceId) => {
  console.log('Deleting source with ID:', sourceId);
  
  // Clean the sourceId to ensure it's a proper number/string
  const cleanSourceId = String(sourceId).replace(/[^0-9]/g, '');
  console.log('Cleaned source ID:', cleanSourceId);
  
  return await ApiHelper.dective(cleanSourceId, ENDPOINTS.LEAD_SOURCE);
};