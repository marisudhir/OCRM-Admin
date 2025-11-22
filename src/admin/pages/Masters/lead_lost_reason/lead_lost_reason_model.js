import { ENDPOINTS } from '../../../api/ApiConstant';
import * as ApiHelper from '../../../api/ApiHelper';

// GET ALL LEAD LOST REASONS
export async function getAllLeadLostReasons() {
    const response = await ApiHelper.getAll(ENDPOINTS.LEAD_LOST_REASON); // Changed endpoint
    return response.data;
}

// GET LEAD LOST REASONS BY COMPANY ID - FIXED
export async function getLeadLostReasonsByCompanyId(companyId) {
    console.log("Fetching reasons for company ID:", companyId);
    
    // If no company ID provided, get all reasons
    if (!companyId) {
        console.log("No company ID provided, fetching all reasons");
        const response = await ApiHelper.getAll(ENDPOINTS.LEAD_LOST_REASON);
        return response.data;
    }
    
    // If company ID provided, get reasons for that specific company
    const queryParams = { companyId: companyId };
    const response = await ApiHelper.getWithQueryParam(
        ENDPOINTS.LEAD_LOST_REASON,  // Use the same endpoint with query params
        queryParams
    );
    
    console.log("API Response for company:", response);
    return response.data;
}

// CREATE LEAD LOST REASON - FIXED TO MATCH API
export async function createLeadLostReason(reqData) {
    console.log("Creating lead lost reason:", reqData);
    
    // The API expects just { "lostReason": "text" }
    const payload = {
        lostReason: reqData.lostReason || reqData
    };
    
    console.log("Final create payload:", payload);
    const response = await ApiHelper.create(payload, ENDPOINTS.LEAD_LOST_REASON);
    return response.data;
}

// UPDATE LEAD LOST REASON - FIXED TO MATCH API
export async function updateLeadLostReason(id, reqData) {
    console.log("Update request - ID:", id, "Data:", reqData);

    let reasonText;
    
    if (typeof reqData === "string") {
        reasonText = reqData;
    } else if (typeof reqData === "object") {
        reasonText = reqData.lostReason || reqData.reason || reqData.lostReasonText || 
                    Object.values(reqData).find(val => typeof val === "string");
    } else {
        reasonText = String(reqData);
    }

    // API expects { "lostReason": "text", "lostReasonId": id }
    const payload = {
        lostReasonId: Number(id),
        lostReason: reasonText
    };

    console.log("Final update payload:", payload);

    // Use editWithReqBody since it sends PUT request with request body
    const response = await ApiHelper.editWithReqBody(
        ENDPOINTS.LEAD_LOST_REASON,
        payload
    );

    return response.data;
}

// DELETE LEAD LOST REASON - FIXED TO MATCH API
export async function deleteLeadLostReason(id) {
    console.log("Deleting reason ID:", id);
    
    // API expects query params: { lostReasonId: id, isActive: false }
    const params = {
        lostReasonId: Number(id),
        isActive: false
    };

    console.log("Delete params:", params);

    const response = await ApiHelper.deleteWithQueryParams(
        ENDPOINTS.LEAD_LOST_REASON,
        params
    );

    return response.data;
}