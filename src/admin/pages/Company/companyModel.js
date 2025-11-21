import * as ApiHelper from '../../api/ApiHelper';
import axios from "axios";
import { ENDPOINTS } from '../../api/ApiConstant';
import { getAll } from "../../api/ApiHelper";

// POST: Assign new attribute to user
export const assignAttributeToUser = async (userId, attributeId) => {
  const fullApiUrl = ENDPOINTS.ASSIGN_ATTRIBUTE_USER;
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("Authentication token not found!");
    throw new Error("Missing authentication token.");
  }

  try {
    // console.log('📤 POST: Assigning attribute to user', { userId, attributeId });
    
    const response = await axios.post(
      fullApiUrl,
      { 
        userId: userId,
        attributeId: attributeId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    

    return response.data;
  } catch (err) {
    console.error(`❌ POST failed for ${fullApiUrl}:`, err);
    throw err;
  }
};

// PUT: Update attribute status
export const updateAttributeStatus = async (iuaId, status) => {
  const fullApiUrl = `${ENDPOINTS.UPDATE_ATTRIBUTE_USER_ID}/${iuaId}/status`;
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("Authentication token not found!");
    throw new Error("Missing authentication token.");
  }

  try {
    // console.log('📤 PUT: Updating attribute status', { iuaId, status });
    
    const response = await axios.put(
      fullApiUrl,
      { 
        status: status
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // console.log('✅ PUT Success:', response.data);
    return response.data;
  } catch (err) {
    console.error(`❌ PUT failed for ${fullApiUrl}:`, err);
    throw err;
  }
};

// Apply user attribute changes - handles both POST and PUT
export const applyUserAttributeChanges = async (targetUserId, stagedAttributes, existingUserAttributes) => {
  const promises = [];

  // console.log('🔄 Applying attribute changes:', {
  //   userId: targetUserId,
  //   stagedAttributes,
  //   existingUserAttributes: existingUserAttributes.length
  // });

  // Create a map of existing user attributes for quick lookup
  const existingAttrMap = new Map();
  existingUserAttributes.forEach(attr => {
    existingAttrMap.set(attr.iattribute_id, attr);
  });

  for (const [attrIdString, isChecked] of Object.entries(stagedAttributes)) {
    const attrId = parseInt(attrIdString);
    const existingAttr = existingAttrMap.get(attrId);
    
    if (existingAttr && existingAttr.iua_id) {
      // Attribute already assigned to user - UPDATE (PUT) if status changed
      if (existingAttr.bactive !== isChecked) {
        // console.log(`🔄 UPDATE: Attribute ${attrId} from ${existingAttr.bactive} to ${isChecked}`);
        promises.push(updateAttributeStatus(existingAttr.iua_id, isChecked));
      }
    } else {
      // Attribute not assigned to user - CREATE (POST) if checked
      if (isChecked) {
        // console.log(`🆕 CREATE: New attribute ${attrId} for user`);
        promises.push(assignAttributeToUser(targetUserId, attrId));
      }
    }
  }
  
  // console.log(`📤 Sending ${promises.length} API requests`);
  return Promise.all(promises);
};

// GET: All available attributes
export const getAllAttributes = async (companyId) => {
  try {
    // console.log("🔄 GET: Fetching all attributes for company:", companyId);
    
    let endpoint = ENDPOINTS.GET_ATTRIBUTE;
    if (companyId) {
      endpoint = `${ENDPOINTS.GET_ATTRIBUTE}?companyId=${companyId}`;
    }
    
    const response = await ApiHelper.getAll(endpoint);
    // console.log("✅ GET Attributes Success:", response.data);
    
    return response.data.attribuites || [];
  } catch (err) {
    console.error("❌ GET: Failed to fetch all attributes:", err);
    throw err;
  }
};

// GET: User's assigned attributes
export const getUserAttributes = async (userId) => {
  try {
    // console.log("🔄 GET: Fetching attributes for user:", userId);
    
    const response = await ApiHelper.getById(userId, ENDPOINTS.GET_ATTRIBUTE_USER_ID);
    // console.log("✅ GET User Attributes Success:", response.data);
    
    // Handle different response structures
    if (response.data && response.data.error === "No attribute found for this user ID !") {
      console.warn(`User ${userId} has no assigned attributes.`);
      return [];
    }
    
    if (response.data && Array.isArray(response.data.attributes)) {
      return response.data.attributes;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn("⚠️ Unexpected user attributes response format:", response.data);
    return [];

  } catch (err) {
    const errorMessage = err?.response?.data?.error;
    
    if (errorMessage === "No attribute found for this user ID !") {
      console.warn(`User ${userId} has no assigned attributes.`);
      return [];
    }
    
    console.error("❌ GET: Failed to fetch user attributes:", err);
    throw err;
  }
};

export const changeUserSettingsStatus = async (settingsData) => {
  // console.log('Settings data being sent to changeUserSettingsStatus:', settingsData);
  const res = await ApiHelper.update_patch_no_id(ENDPOINTS.USER_SETTINGS, settingsData);
  // console.log('The response from changeUserSettingsStatus is:', res);

  return res.data;
}

// to get all the company data.
export const getAllCompantData = async () => {
  console.info("all company data api called");
  const res = await ApiHelper.getAll(ENDPOINTS.COMPANIES);
  return res.data;
};

export const getAuditLogs = async (company_id) => {
  const res = await ApiHelper.getAll(ENDPOINTS.AUDIT_LOGS(company_id));
  return res.data;
};

export const changeSettingStatus = async (data, company_id) => {
  // console.log("Changing settings status for company:", company_id, data);
  const res = await ApiHelper.update_patch(company_id, ENDPOINTS.COMPANY_SETTINGS, data);
  // console.log("The response is:", res);
  return res.data;
}

export const changeUserStatus = async (user_id) => {
  const res = await ApiHelper.deActive(user_id, ENDPOINTS.USER);
  return res.data;
};

//to add an new company.
export const addNewCompany = async (data) => {
  return await ApiHelper.create(data, ENDPOINTS.COMPANIES);
};

//to add an admin user when the company is created
export const addAdminUser = async (data) => {
  const res = await ApiHelper.create(data, ENDPOINTS.USER);
  return res.data;
};

// In companyModel.js - fix the editCompany function
// In companyModel.js - Fix the editCompany function
export const editCompany = async (data, company_id) => {
  // console.log("📝 Edit company model called:", { data, company_id });
  
  // Ensure we have a valid company_id
  let finalCompanyId;
  
  if (typeof company_id === 'object') {
    // If it's an object, extract the ID
    finalCompanyId = company_id.iCompany_id;
    console.warn("⚠️ Company ID was passed as object, extracting:", finalCompanyId);
  } else {
    finalCompanyId = company_id;
  }
  
  // Convert to number
  finalCompanyId = parseInt(finalCompanyId);
  
  if (isNaN(finalCompanyId)) {
    console.error("❌ Invalid company ID:", company_id);
    throw new Error("Invalid company ID");
  }
  
  // console.log("✅ Using company ID:", finalCompanyId);
  
  try {
    const response = await ApiHelper.update(finalCompanyId, ENDPOINTS.COMPANIES, data);
    // console.log("✅ Edit company response:", response);
    return response;
  } catch (error) {
    console.error("❌ Edit company error:", error);
    throw error;
  }
};
//to get an company data based on the id.
export const getCompanyById = async (id) => {
  const res = await ApiHelper.getById(id, ENDPOINTS.COMPANIES_ID);
  return res.data.result;
}

// to get all the user data based on the company id.
export const getUsersByCompanyId = async (companyId) => {
  try {
    const response = await getAll(ENDPOINTS.USER_TAB(companyId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

//To the storage details based on the company id 
export const getStorageDetails = async (companyId) => {
  try {
    const response = await ApiHelper.getById(companyId, ENDPOINTS.GET_STORAGE_DETAILS);
    const data = response.data;
    if (data.success) return data.data;
    throw new Error(data.message)
  } catch (e) {
    return e.message
  }
}
// In companyModel.js - Fix the getBussinessType function
export const getBussinessType = async () => {
  try {
    const res = await ApiHelper.getAll(ENDPOINTS.BUSSINESS_TYPE);
    const data = res.data;
    if (data.success) return data.data;
    throw new Error(data.message);
  } catch (error) {
    console.error("Failed to fetch business types:", error);
    throw error;
  }
};