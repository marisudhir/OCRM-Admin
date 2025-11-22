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
  
  const id = Number(serviceId);
  if (isNaN(id) || id <= 0) {
    throw new Error(`Invalid service ID: ${serviceId}`);
  }
  
  // Create the payload that matches your backend expectation
  const updatePayload = {
    serviceId: id, // This goes in request body
    serviceName: data.serviceName || data.cservice_name,
    updatedBy: data.updated_by // Make sure this matches your backend field name
  };
  
  console.log('Update payload:', updatePayload);
  
  // Use editWithReqBody since serviceId is in request body
  return await ApiHelper.editWithReqBody(ENDPOINTS.LEAD_SERVICE, updatePayload);
};

// to delete (soft delete) a lead service
export const deleteLeadService = async (serviceId) => {
  console.log('Deleting service with ID:', serviceId);
  
  const id = Number(serviceId);
  if (isNaN(id) || id <= 0) {
    throw new Error(`Invalid service ID: ${serviceId}`);
  }
  
  console.log('Delete endpoint with query params:', ENDPOINTS.LEAD_SERVICE);
  
  // Use deleteWithQueryParams with serviceId as query parameter
  return await ApiHelper.deleteWithQueryParams(ENDPOINTS.LEAD_SERVICE, { serviceId: id });
};