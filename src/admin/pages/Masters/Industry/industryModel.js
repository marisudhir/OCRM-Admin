// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';


// to get all the lead status.
export const getAllIndustry = async () => {
  console.log(ENDPOINTS.INDUSTRIES);
  const res = await ApiHelper.getAll(ENDPOINTS.INDUSTRIES);
  console.log("The errored response is :", res);
  return res.data; 
};

//to add an new lead status.
export const addNewIndustry = async (data) => {
  console.log(ENDPOINTS.INDUSTRIES);
  return await ApiHelper.create(data, ENDPOINTS.INDUSTRIES);
};


