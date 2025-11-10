// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead status.
export const getAllLeadServicesByCompanyId = async (requestParams) => {
  console.log(ENDPOINTS.LEAD_SERVICE);
  const res = await   ApiHelper.getWithQueryParam(ENDPOINTS.LEAD_SERVICE,requestParams);
  console.log("The response data is :", res);
  return res?.data.data; 
};

//to add an new lead status.
export const addNewLeadService = async (data) => {
  console.log(ENDPOINTS.LEAD_SERVICE);
  return await ApiHelper.create(data, ENDPOINTS.LEAD_SERVICE,);
};


