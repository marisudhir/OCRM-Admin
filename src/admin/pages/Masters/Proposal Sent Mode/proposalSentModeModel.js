// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

export const getAllProposalSentMode = async () => {
  try {
    console.log("Fetching all proposal send modes...");
    
    // No company ID needed - fetch all proposal send modes
    const res = await ApiHelper.getAll(ENDPOINTS.PROPOSAL_SENT_MODE);
    
    console.log("Proposal send modes response:", res.data);
    return res.data; 
  } catch (error) {
    console.error("Error in getAllProposalSentMode:", error);
    throw error;
  }
};

export const createProposalSentMode = async (data) => {
  try {
    console.log("Creating proposal send mode:", data);
    const res = await ApiHelper.create(data, ENDPOINTS.PROPOSAL_SENT_MODE);
    return res;
  } catch (error) {
    console.error("Error creating proposal sent mode:", error);
    throw error;
  }
};

export const editProposalSentMode = async (proposalSentModeId, data) => {
  try {
    console.log("Updating proposal send mode:", proposalSentModeId, data);
    const res = await ApiHelper.update(proposalSentModeId, ENDPOINTS.PROPOSAL_SENT_MODE, data);
    return res;
  } catch (error) {
    console.error("Error updating proposal sent mode:", error);
    throw error;
  }
};

export const deleteProposalSentMode = async (proposalSentModeId) => {
  try {
    console.log("Deleting proposal send mode:", proposalSentModeId);
    const res = await ApiHelper.deActive(proposalSentModeId, ENDPOINTS.PROPOSAL_SENT_MODE);
    return res.data;
  } catch (error) {
    console.error("Error deleting proposal sent mode:", error);
    throw error;
  }
};