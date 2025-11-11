// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead status.
export const getAllLeadSubService = async (companyId) => {
  const res = await ApiHelper.getWithQueryParam(ENDPOINTS.LEAD_SUB_SERVICE,{companyId:companyId});
  return res.data; 
};

//to add an new lead status.
export const addNewLeadSubService = async (data) => {
  return await ApiHelper.create(data, ENDPOINTS.LEAD_SUB_SERVICE,);
};


