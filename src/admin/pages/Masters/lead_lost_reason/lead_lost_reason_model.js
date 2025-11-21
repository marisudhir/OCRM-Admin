import { ENDPOINTS } from '../../../api/ApiConstant';
import * as ApiHelper from '../../../api/ApiHelper';

// GET ALL LEAD LOST REASON BY COMPANY
export async function getLeadLostReasonsByCompanyId(companyId) {
    const response = await ApiHelper.getById(companyId, ENDPOINTS.COMPANY_LEAD_LOST_REASON);
    return response.data;
}

// CREATE
export async function createLeadLostReason(reqData) {
    const response = await ApiHelper.create(reqData, ENDPOINTS.CREATE_LEAD_LOST_REASON);
    return response.data;
}

// UPDATE
export async function updateLeadLostReason(id, reqData) {

    // reqData might be an array-like object → convert to string safely
    const reasonText =
        typeof reqData === "string"
            ? reqData
            : reqData?.reason || Object.values(reqData).join("");

    const payload = {
        lostReasonId: id,
        lostReason: reasonText,
    };

    const response = await ApiHelper.editWithReqBody(
        ENDPOINTS.LEAD_LOST_REASON,
        payload
    );

    return response.data;
}


//DELETE 
export async function deleteLeadLostReason(id) {
    const params = {
        lostReasonId: id,
        isActive: false
    };

    const response = await ApiHelper.deleteWithQueryParams(
        ENDPOINTS.LEAD_LOST_REASON,
        params
    );

    return response.data;
}


