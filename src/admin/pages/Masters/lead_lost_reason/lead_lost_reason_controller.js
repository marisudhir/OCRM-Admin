import { useState } from "react";
import * as leadLostReasonModel from "./lead_lost_reason_model";

export function useLeadLostReason() {
  const [leadLostReasons, setLeadLostReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);

  // GET ALL REASONS OR BY COMPANY ID
  const getLeadLostReasonByCompanyId = async (companyId = null) => {
    setCurrentCompanyId(companyId);
    try {
      setLoading(true);
      setError(null);
      const result = await leadLostReasonModel.getLeadLostReasonsByCompanyId(companyId);

      console.log('API Response for company', companyId, ':', result);

      if (result?.success === false) {
        setError(result?.Message || "Failed to load reasons");
        setLeadLostReasons([]);
        return;
      }

      const data = result?.data || result?.body || result || [];
      setLeadLostReasons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error in controller:', e);
      setError(e.message);
      setLeadLostReasons([]);
    } finally {
      setLoading(false);
    }
  };

  // CREATE LEAD LOST REASON - IMPROVED
const createLeadLostReasonController = async (reasonText) => {
    try {
        setError(null);
        setMessage(null);
        
        // The API expects just the reason text in the format { "lostReason": "text" }
        const payload = { 
            lostReason: reasonText 
        };

        console.log("Create payload:", payload);

        const result = await leadLostReasonModel.createLeadLostReason(payload);
        console.log("Create API response:", result);

        if (result?.success === false || result?.Message?.includes("Error") || result?.Message?.includes("Failed")) {
            setError(result?.Message || "Failed to create reason");
            return false;
        }

        setMessage(result?.Message || "Reason created successfully");

        // Refresh the list with current company filter
        await getLeadLostReasonByCompanyId(currentCompanyId);

        return true;
    } catch (err) {
        console.error("Create error:", err);
        setError(err.message);
        return false;
    }
};

  // UPDATE LEAD LOST REASON
  const updateLeadLostReasonController = async (id, reqBody) => {
    try {
      setError(null);
      setMessage(null);
      
      console.log("Update controller - ID:", id, "Body:", reqBody);

      // Ensure company ID is included in update
      let updateData = reqBody;
      if (typeof reqBody === 'object' && currentCompanyId) {
        updateData = {
          ...reqBody,
          icompany_id: parseInt(currentCompanyId)
        };
      }

      const result = await leadLostReasonModel.updateLeadLostReason(id, updateData);

      console.log("Update result:", result);

      if (result?.success === false || result?.Message?.includes("Error") || result?.Message?.includes("Failed") || result?.Message?.includes("not found") || result?.Message?.includes("already exists")) {
        setError(result?.Message || "Failed to update reason");
        return false;
      }

      setMessage(result?.Message || "Reason updated successfully");

      // Refresh the list with current company filter
      await getLeadLostReasonByCompanyId(currentCompanyId);

      return true;
    } catch (e) {
      console.error("Update error:", e);
      setError(e.message);
      return false;
    }
  };

  // DELETE LEAD LOST REASON
  const deleteLeadLostReasonController = async (id) => {
    try {
      setError(null);
      setMessage(null);
      
      const result = await leadLostReasonModel.deleteLeadLostReason(id);

      if (result?.success === false || result?.Message?.includes("Error") || result?.Message?.includes("Failed")) {
        setError(result?.Message || "Failed to delete");
        return false;
      }

      setMessage(result?.Message || "Reason deleted successfully");

      // Refresh the list with current company filter
      await getLeadLostReasonByCompanyId(currentCompanyId);

      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  return {
    leadLostReasons,
    loading,
    error,
    message,
    getLeadLostReasonByCompanyId,
    createLeadLostReasonController,
    updateLeadLostReasonController,
    deleteLeadLostReasonController,
    currentCompanyId
  };
}