// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead services (only active ones)
export const getAllLeadServicesByCompanyId = async (requestParams) => {
  console.log(ENDPOINTS.LEAD_SERVICE);
  const res = await ApiHelper.getWithQueryParam(ENDPOINTS.LEAD_SERVICE, requestParams);
  console.log("The response data is :", res);
  // Filter only active services if backend doesn't do it
  return res?.data.data.filter(service => service.bactive !== false); 
};

// to add a new lead service
export const addNewLeadService = async (data) => {
  console.log(ENDPOINTS.LEAD_SERVICE);
  return await ApiHelper.create(data, ENDPOINTS.LEAD_SERVICE);
};

// to update an existing lead service
export const updateLeadService = async (serviceId, data) => {
  console.log('Updating service with ID:', serviceId);
  console.log('Update data:', data);
  
  // Clean the serviceId to ensure it's a proper number/string
  const cleanServiceId = String(serviceId).replace(/[^0-9]/g, '');
  console.log('Cleaned service ID:', cleanServiceId);
  
  return await ApiHelper.update(cleanServiceId, ENDPOINTS.LEAD_SERVICE, data);
};

// to delete (soft delete) a lead service
export const deleteLeadService = async (serviceId) => {
  console.log('Deleting service with ID:', serviceId);
  
  // Clean the serviceId to ensure it's a proper number/string
  const cleanServiceId = String(serviceId).replace(/[^0-9]/g, '');
  console.log('Cleaned service ID:', cleanServiceId);
  
  return await ApiHelper.deactive(cleanServiceId, ENDPOINTS.LEAD_SERVICE);
};