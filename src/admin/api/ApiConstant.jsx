// Load the base API URL from the .env file
export const BASE_URL = import.meta.env.VITE_API_URL;


// Define all API endpoints relative to BASE_URL
export const ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  GET_ATTRIBUTE: `${BASE_URL}/attribute`,
  GET_ATTRIBUTE_USER_ID: `${BASE_URL}/user-attribute/user`,
  USER_SETTINGS: `${BASE_URL}/users/userAccess`,
  UPDATE_ATTRIBUTE_USER_ID: `${BASE_URL}/user-attribute`,
  DASHBOARD: `${BASE_URL}/admin/dashboard`,
  LEAD_STATUS: `${BASE_URL}/lead-status/`,
  PROPOSAL_SENT_MODE: `${BASE_URL}/proposal-send-mode`,
  COMPANIES : `${BASE_URL}/company`,
  COMPANY_SETTINGS : `${BASE_URL}/company/settings`,
  COMPANIES_ID : `${BASE_URL}/company`,
  BUSSINESS_TYPE:`${BASE_URL}/business-type`,
  LEAD_POTENTIAL : `${BASE_URL}/lead-potential/`,
  INDUSTRY : `${BASE_URL}/lead-industry/`,
  INDUSTRIES : `${BASE_URL}/lead-industry`,
  LEAD_SOURCE : `${BASE_URL}/lead-source/`,
  CITY : `${BASE_URL}/city`, 
  USER : `${BASE_URL}/users/`,
  ROLE : `${BASE_URL}/role/`,  
  PLAN: `${BASE_URL}/pricing-plan`,
  ADMIN_DASHBOARD : `${BASE_URL}/admin-dashboard`,
  RESELLER : `${BASE_URL}/reseller/`, 
  USER_TAB : (companyId) => `${BASE_URL}/users/company/${companyId}`,
  AUDIT_LOGS : (companyId) => `${BASE_URL}/admin-dashboard/userAudit/${companyId}`,

  //Masters

  DISTRICT: `${BASE_URL}/district`,
  DISTRICT_ID: `${BASE_URL}/district/`,
  STATE: `${BASE_URL}/state`,
  STATE_ID: `${BASE_URL}/state/`,
  COUNTRY: `${BASE_URL}/country`,
  COUNTRY_ID: `${BASE_URL}/country/`,
  CITIES: `${BASE_URL}/cities`,
  CITY_ID: `${BASE_URL}/cities/`,
  CURRENCY: `${BASE_URL}/currency`,
  CURRENCY_ID: `${BASE_URL}/currency/`,
  //SUBSCRIPTION API ENDPOINT 
  SUBSCRIPTION_CREATE:`${BASE_URL}/subscription/createSubscription`,
  ALL_SUBSCRIPTION_GET:`${BASE_URL}/subscription/getAllSubscription`,
  EDIT_SUBSCRIPTION:`${BASE_URL}/subscription/updateSubscription`,
  SUBSCRIPTION_STATUS_CHANGE:`${BASE_URL}/subscription/changeStatus`,
  CREATE_MODULE:`${BASE_URL}/module`,
  GET_ALL_MODULES:`${BASE_URL}/module`,
  EDIT_MODULE:`${BASE_URL}/module`,
  CHANGE_MODULE_STATUS:`${BASE_URL}/module/changeSts`,
  GET_ACTIVE_MODULES:`${BASE_URL}/module/fetchActiveModules`,
  GET_ACTIVE_SUBSCRIPTION:`${BASE_URL}/subscription/getActiveSubscription`,
  GET_ALL_ALLOCATED_MODULES:`${BASE_URL}/subscriptionPlanModule/getAllocateModule`,
  CREATE_MODULE_ALLOCATION:`${BASE_URL}/subscriptionPlanModule/allocateModule`,
  EDIT_MODULE_ALLOCATION:`${BASE_URL}/subscriptionPlanModule/editAllocatedModules`,
  CHANGE_MODULE_ALLOCATION_STATUS:`${BASE_URL}/subscriptionPlanModule/changeModuleAllocationSts`,
  GET_ALLOCATED_MODULES_BY_SUBSC_ID:`${BASE_URL}/subscriptionPlanModule/getAllocatedModulesBySubsId`,
  //STORAGE  DETAILS  API ENDPOINT 
  GET_STORAGE_DETAILS:`${BASE_URL}/fileSizeTracking`,
  COMPANY_LEAD_LOST_REASON : `${BASE_URL}/lead-lostreason`,
  CREATE_LEAD_LOST_REASON:`${BASE_URL}/lead-lostreason`,
  LEAD_SERVICE:`${BASE_URL}/lead-service`,
  LEAD_SUB_SERVICE:`${BASE_URL}/sub-service`
};

