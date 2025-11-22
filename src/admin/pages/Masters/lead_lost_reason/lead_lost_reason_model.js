import { ENDPOINTS } from '../../../api/ApiConstant';
import * as ApiHelper from '../../../api/ApiHelper';

// GET ALL LEAD LOST REASONS (for company dropdown filtering)
export async function getAllLeadLostReasons() {
    const response = await ApiHelper.getAll(ENDPOINTS.COMPANY_LEAD_LOST_REASON);
    return response.data;
}

// GET LEAD LOST REASONS BY COMPANY ID - FIXED
export async function getLeadLostReasonsByCompanyId(companyId) {
    // If no company ID provided, get all reasons
    if (!companyId) {
        const response = await ApiHelper.getById(ENDPOINTS.CREATE_LEAD_LOST_REASON);
        return response.data;
    }
    
    // If company ID provided, get reasons for that specific company
    const response = await ApiHelper.getById(companyId, ENDPOINTS.COMPANY_LEAD_LOST_REASON);
    return response.data;
}

// CREATE LEAD LOST REASON
export async function createLeadLostReason(reqData) {
    const response = await ApiHelper.create(reqData, ENDPOINTS.CREATE_LEAD_LOST_REASON);
    return response.data;
}

// UPDATE LEAD LOST REASON - IMPROVED
export async function updateLeadLostReason(id, reqData) {
    console.log("Update request - ID:", id, "Data:", reqData);

    let reasonText;
    let companyId;
    
    if (typeof reqData === "string") {
        reasonText = reqData;
    } else if (typeof reqData === "object") {
        reasonText = reqData.lostReason || reqData.reason || reqData.lostReasonText || 
                    Object.values(reqData).find(val => typeof val === "string");
        companyId = reqData.icompany_id;
    } else {
        reasonText = String(reqData);
    }

    const payload = {
        lostReasonId: Number(id),
        lostReason: reasonText,
        icompany_id: companyId
    };

    console.log("Final update payload:", payload);

    const response = await ApiHelper.updateHelper(
        ENDPOINTS.LEAD_LOST_REASON,
        payload
    );

    return response.data;
}

// DELETE LEAD LOST REASON
export async function deleteLeadLostReason(id) {
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