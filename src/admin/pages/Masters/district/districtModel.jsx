import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// stateModel.js
export const getAllDistrict = async () => {
  try {
    const response = await ApiHelper.getAll(ENDPOINTS.DISTRICT);
    
    console.log('Raw States API Response:', response.data);

    // Transform data to include both state and country info
  const transformedData = response.data.data.map(district => ({
  iDistric_id: district.iDistric_id,
  iState_id: district.iState_id,
  cDistrict_name: district.cDistrict_name,
  bactive: district.bactive,

  states: {
    iState_id: district.iState_id,
    cState_name: district?.state?.cState_name || "Unknown State"
  }
}));


    console.log('Transformed States Data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error("district API Error:", error);
    throw error;
  }
};
export const addNewDistrict = async (data) => {
  try {
    const payload = {
      iState_id: data.iState_id,
      cDistrict_name: data.cDistrict_name,
      bactive: true
    };
    const response = await ApiHelper.create(payload, ENDPOINTS.DISTRICT);
    return response.data;
  } catch (error) {
    console.error("Error creating state:", error);
    throw error;
  }
};

export const updateDistrict = async (id, districtData) => {
  try {
    console.log(`Updating district ${id} with:`, districtData);
    const payload = {
      cDistrict_name : districtData.cDistrict_name
    };
    const response = await ApiHelper.update(id, ENDPOINTS.DISTRICT, payload);
    console.log('API Response:', response);
    return response.data;
  } catch (error) {
    console.error("Error updating district:", error);
    throw error;
  }
};

export const deleteDistrict = async (id) => {
  try {
    const response = await ApiHelper.deActive(id, ENDPOINTS.DISTRICT_ID);
    return response;
  } catch (error) {
    console.error("Error deactivating district:", error);
    throw error;
  }
};