// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead status (only active ones)
export const getAllIndustry = async () => {
  console.log(ENDPOINTS.INDUSTRIES);
  const res = await ApiHelper.getAll(ENDPOINTS.INDUSTRIES);
  console.log("The response is :", res);
  // Filter only active industries if backend doesn't do it
  return res.data.filter(industry => industry.bactive !== false); 
};

// to add a new lead status
export const addNewIndustry = async (data) => {
  console.log(ENDPOINTS.INDUSTRIES);
  return await ApiHelper.create(data, ENDPOINTS.INDUSTRIES);
};

// to update an existing lead status
export const updateIndustry = async (industryId, data) => {
  console.log('Updating industry with ID:', industryId);
  console.log('Update data:', data);
  
  // Clean the industryId to ensure it's a proper number/string
  const cleanIndustryId = String(industryId).replace(/[^0-9]/g, '');
  console.log('Cleaned industry ID:', cleanIndustryId);
  
  return await ApiHelper.update(cleanIndustryId, ENDPOINTS.INDUSTRIES, data);
};

// to delete (soft delete) a lead status
export const deleteIndustry = async (industryId) => {
  console.log('Deleting industry with ID:', industryId);
  
  // Clean the industryId to ensure it's a proper number/string
  const cleanIndustryId = String(industryId).replace(/[^0-9]/g, '');
  console.log('Cleaned industry ID:', cleanIndustryId);
  
  return await ApiHelper.deactive(cleanIndustryId, ENDPOINTS.INDUSTRIES);
};