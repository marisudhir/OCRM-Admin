import React, { useEffect, useState, useCallback } from "react";
import * as companyModel from './companyModel'; 
import { create } from "../../api/ApiHelper";

export const useCompanyController = () => {

  const [companyData, setCompanyData] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [userAttributes, setUserAttributes] = useState([]);
  const [error, setError] = useState(null);
  const [usersByCompany, setUsersByCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [storageDetails,setStorageDetails]=useState([]);
  const [ businessType, setBussinessType] = useState([])


  // Function to fetch all company details
  const fetchAllCompanyData = useCallback(async () => {
    try {
      const data = await companyModel.getAllCompantData();
      console.info("All company date api hit!")
      setCompanyData(data);
    } catch (err) {
      console.error('Failed to fetch company data:', err);
      setError(err.message || 'Something went wrong');
    }
  }, []);

  // useEffect(() => {
  //   fetchAllCompanyData();
  // }, []);

  const changeUserStatus = async (userId, newStatus) => {
    try { 
      const response = await companyModel.changeUserStatus(userId);
      if(response.status === 204) {
      console.log("User status changed successfully:", response);
       setUsersByCompany(prevUsers =>
      prevUsers.map(user =>
        user.iUser_id === userId
          ? { ...user, bactive: newStatus } 
          : user
      )
    );
      }
    } catch (err) {
      console.error('Failed to change user status:', err);  
    }
  }


  const fetchAuditLogs = async (company_id) => {
    try {
      const data = await companyModel.getAuditLogs(company_id);
      return data;
    } catch (err) {
      console.error('Failed to fetch company data:', err);
      setError(err.message || 'Something went wrong');
    }
  }

  const changeSettingsStatus = async (settingsData,  companId) => {
     try { 
      const response = await companyModel.changeSettingStatus(settingsData, companId);
      if(response.status === 200) {
        console.log("User status changed successfully:", response);
      }
    } catch (err) {
      console.error('Failed to change user status:', err);  
    }
  }


  const changeUserSettingsStatus  = async (settingsData) => {
     try { 
      const response = await companyModel.changeUserSettingsStatus(settingsData);
      if(response.status === 200) {
        console.log("User status changed successfully:", response);
        return true;
      }
    } catch (err) {
      console.error('Failed to change user status:', err);
      return false;
    }
  }


  // Function to fetch company by ID
  const fetchCompanyDataById = async (id) => {
    try {
      console.log("This is the company data function!")
      const data = await companyModel.getCompanyById(id);
      // console.log("Company details are:", data);
      return data;
    } catch (err) {
      console.error('Failed to fetch company data:', err);
      setError(err.message || 'Something went wrong');
    }
  }

const createCompany = async (data) => {
    try {
        // --- 1. Construct the Base Payload with Direct Fields ---
        const payload = {
            // Mandatory direct fields
            cCompany_name: data.cCompany_name,
            iPhone_no: data.iPhone_no,
            cWebsite: data.cWebsite,
            caddress1: data.caddress1,
            caddress2: data.caddress2,
            caddress3: data.caddress3,
            cGst_no: data.cGst_no,
            icin_no: data.icin_no,
            iUser_no: data.iUser_no,
            bactive: data.bactive,
            
            // Optional direct fields, cast/checked as needed
            cpincode: data.cpincode ? parseInt(data.cpincode) : null,
            cLogo_link: data.cLogo_link || "", // Fallback value
            cPan_no: data.cPan_no || null,
            industry: data.industry || null,
            cemail_address: data.cemail_address || null,
            fax_no: data.fax_no || null,
        };

        // --- 2. Conditionally Add Relational Fields (ID > 0 Check) ---
        
        // City ID
        const cityId = parseInt(data.icity_id);
        if (!isNaN(cityId) && cityId > 0) {
            payload.city = { connect: { icity_id: cityId } };
        }

        // Pricing Plan ID (maps 'isubscription_plan' to 'plan_id')
        const planId = parseInt(data.isubscription_plan);
        if (!isNaN(planId) && planId > 0) {
            payload.pricing_plan = { connect: { plan_id: planId } };
        }

        // Business Type ID (maps 'ibusiness_type' to 'id')
        const businessTypeId = parseInt(data.ibusiness_type);
        if (!isNaN(businessTypeId) && businessTypeId > 0) {
            payload.businessType = { connect: { id: businessTypeId } };
        }

        // Currency ID
        const currencyId = parseInt(data.icurrency_id);
        if (!isNaN(currencyId) && currencyId > 0) {
            payload.currency = { connect: { icurrency_id: currencyId } };
        }
        
        // Reseller ID (maps 'ireseller_id' to 'ireseller_id')
        const resellerId = parseInt(data.ireseller_id);
        if (!isNaN(resellerId) && resellerId > 0) {
            payload.reseller = { connect: { ireseller_id: resellerId } };
        }
        
        // Reseller Admin ID (FIXED: Using the relational connect object)
        const resellerAdminId = parseInt(data.ireseller_admin);
        if (!isNaN(resellerAdminId) && resellerAdminId > 0) {
            // Assumes the relation is named 'resellerAdmin' and connects via 'iUser_id' in the User table
            payload.resellerAdmin = { connect: { iUser_id: resellerAdminId } }; 
        }

        // --- 3. Call the Model Function ---
        const res = await companyModel.addNewCompany(payload);
   
        console.log("Company created with ID:", res.data.iCompany_id);
        return true;

    } catch (err) {
        console.error("Failed to create company:", err);
        return false;
    }
};

 //function to create an admin user when the company is created
  const createAdminUser = async (data) => {
    try {
      console.log("Creating admin user with data:", data);
      const res = await companyModel.addAdminUser(data);
      console.log("The response is :", res);
      await fetchAllCompanyData();
      return true;
    } catch (err) {
      console.error('Failed to create admin user:', err);
      setError(err.message || 'Could not create admin user');
      return false;
    }
  }


  //function to create normal user for an company 
 const createUser = async (data) => {
    try {
      console.log("Creating  user with data:", data);
      const res = await companyModel.addAdminUser(data);
      

    //  await companyModel.getUsersByCompanyId (data.iCompany_id);

      console.log("The response is :", res);
      return true;
    } catch (err) {
      console.error('Failed to create admin user:', err);
      console.log("The response is:", err.response.data.error)
      setError(err.response.data.error || 'Could not create admin user');
      return false;
    }
  }

// Final version - companyController.js
const editCompanyDetails = async (data, company_id) => {
  setLoading(true);
  try {
    console.log("🔄 Starting company edit process...");
    
    // Extract company ID safely
    let actualCompanyId;
    
    if (typeof company_id === 'object' && company_id.iCompany_id) {
      actualCompanyId = company_id.iCompany_id;
    } else if (data.iCompany_id) {
      actualCompanyId = data.iCompany_id;
    } else {
      actualCompanyId = company_id;
    }
    
    actualCompanyId = parseInt(actualCompanyId);
    
    if (isNaN(actualCompanyId)) {
      throw new Error(`Invalid company ID: ${company_id}`);
    }
    
    // Clean payload for backend
    const payload = { 
      cCompany_name: data.cCompany_name || "",
      iPhone_no: data.iPhone_no || "",
      cWebsite: data.cWebsite || "",
      caddress1: data.caddress1 || "",
      caddress2: data.caddress2 || "",
      caddress3: data.caddress3 || "",
      cemail_address: data.cemail_address || "",
      cGst_no: data.cGst_no || "",
      icin_no: data.icin_no || "",
      cPan_no: data.cPan_no || "",
      industry: data.industry || "",
      fax_no: data.fax_no || "",
      iUser_no: data.iUser_no ? parseInt(data.iUser_no) : 1,
      cpincode: data.cpincode || "",
      cLogo_link: data.cLogo_link || "",
      bactive: data.bactive !== undefined ? data.bactive : true,
      icity_id: data.icity_id ? parseInt(data.icity_id) : null,
      icurrency_id: data.icurrency_id ? parseInt(data.icurrency_id) : null,
      ibusiness_type: data.ibusiness_type ? parseInt(data.ibusiness_type) : null,
      isubscription_plan: data.isubscription_plan ? parseInt(data.isubscription_plan) : null,
      ireseller_id: data.ireseller_id ? parseInt(data.ireseller_id) : 1 // default to 1 if not provided
    };
    
    console.log("📤 Final payload for backend:", payload);
    console.log("🎯 Company ID:", actualCompanyId);
    
    const res = await companyModel.editCompany(payload, actualCompanyId);
    
    console.log("✅ Company edit successful");
    setMessage("Company details updated successfully");
    setLoading(false);
    
    return {
      success: true,
      companyId: actualCompanyId,
      data: res
    };
    
  } catch (err) {
    console.error("❌ Failed to update company details:", err);
    const errorMsg = err.response?.data?.error || err.message || 'Could not update company details';
    setError(errorMsg);
    setLoading(false);
    return {
      success: false,
      error: errorMsg
    };
  }
};

  // Function to fetch users by company ID
  const fetchUsersByCompanyId = async (companyId) => {
    try {
      const res = await companyModel.getUsersByCompanyId(companyId);
      setUsersByCompany(res.data); 
      setError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch users by company:", err);
      setError(err.message || "Something went wrong");
      return [];
    }
  };

// In companyController.js - Fix the fetchBussinessType function
const fetchBussinessType = async () => {
  try {
    const res = await companyModel.getBussinessType();
    console.log("Business types fetched:", res);
    
    // Extract the data array from the response
    const businessTypes = res.data || [];
    setBussinessType(businessTypes);
    setError(null);
    return businessTypes;  
  } catch (error) {
    console.error("Failed to fetch BusinessType:", error);
    setError(error.message || "Something went wrong");
    return [];
  }
};
  const fetchAttributes = async (companyId) => {
    try {
      const res = await companyModel.getAllAttributes(companyId);
      console.log("Attributes fetched:", res);
      setAttributes(res); 
      setError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch attributes  :", err);
      setError(err.message || "Something went wrong");
      return [];
    }
  };


  const fetchUserAttributes = async (userId) => {
    try {
      const res = await companyModel.getUserAttributes(userId);
      console.log('User related attributes fetched:', res);
      
      setUserAttributes(res); 
      setError(null);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch users related attributes:", err);
      setError(err.message || "Something went wrong");
      return [];
    }
  };
  
  //FUNCTION TO CALL THE STORAGE API BINDING MODEL 
  const storageDetailsController=async(companyId)=>{
    try {
      const result=await companyModel.getStorageDetails(companyId)
      console.log("Company id in storage function :",companyId)
      setError(null);
      setStorageDetails(result);
    } catch (e) {
      setError(e.message||"Something went wrong")
      return []
    }
  }

  const updateAttributeStatus = async (iuaId, status) => {
  try {
    const response = await companyModel.updateAttributeStatus(iuaId, status);
    return response;
  } catch (err) {
    console.error('Failed to update attribute status:', err);
    throw err;
  }
};

// Apply user attribute changes
const applyUserAttributeChanges = async (targetUserId, stagedAttributes, existingUserAttributes) => {
  try {
    const response = await companyModel.applyUserAttributeChanges(
      targetUserId, 
      stagedAttributes, 
      existingUserAttributes
    );
    return response;
  } catch (err) {
    console.error('Failed to apply attribute changes:', err);
    throw err;
  }
};



  // useEffect(() => {
  //   fetchAllCompanyData();
  // }, []);

  return {
    companyData,
    fetchCompanyDataById,
    fetchAttributes,
    fetchUserAttributes,
    attributes,
    userAttributes,
    createCompany,
    fetchAllCompanyData,
    changeUserStatus,
    changeSettingsStatus,
    editCompanyDetails,
    changeUserSettingsStatus,
    createUser,
    fetchBussinessType,
    error,
    message,
    loading,
    usersByCompany,
    setUsersByCompany,
    fetchUsersByCompanyId,
    fetchAuditLogs,
    storageDetailsController,
    storageDetails,
    updateAttributeStatus,
  applyUserAttributeChanges,
  };
}


