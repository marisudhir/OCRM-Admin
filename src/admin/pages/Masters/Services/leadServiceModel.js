// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead status.
export const getAllLeadServicesByCompanyId = async (companyId) => {
  console.log("company id is : ",companyId)
  console.log(ENDPOINTS.LEAD_SERVICE);
  const res =  ApiHelper.getWithQueryParam(ENDPOINTS.LEAD_SERVICE,{companyId:companyId});
  console.log("The response data is :", res?.data);
  return res; 
};

//to add an new lead status.
export const addNewLeadService = async (data) => {
  console.log(ENDPOINTS.LEAD_SERVICE);
  return await ApiHelper.create(data, ENDPOINTS.LEAD_SERVICE,);
};


