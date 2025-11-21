import { useState } from "react";
import * as leadLostReasonModel from "./lead_lost_reason_model";

export function useLeadLostReason() {
  const [leadLostReasons, setLeadLostReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // ----------------------------------------------------
  // GET ALL REASONS
  // ----------------------------------------------------
  const getLeadLostReasonByCompanyId = async (companyId) => {
    try {
      setLoading(true);
      const result = await leadLostReasonModel.getLeadLostReasonsByCompanyId(companyId);

      if (result?.success === false) {
        setError(result?.Message || "Failed to load reasons");
        return;
      }

      setLeadLostReasons(result?.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // CREATE
  // ----------------------------------------------------
  const createLeadLostReasonController = async (reasonText) => {
    try {
      const payload = { lostReason: reasonText };

      const result = await leadLostReasonModel.createLeadLostReason(payload);

      if (result?.success === false) {
        setError(result?.Message || "Failed to create reason");
        return;
      }

      setMessage(result?.Message);
      setLeadLostReasons((prev) => [...prev, result?.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  // ----------------------------------------------------
  // UPDATE
  // ----------------------------------------------------
  const updateLeadLostReasonController = async (id, reqBody) => {
    try {
      const result = await leadLostReasonModel.updateLeadLostReason(id, reqBody);

      if (result?.success === false) {
        setError(result?.Message || "Failed to update reason");
        return;
      }

      setMessage(result?.Message);

      setLeadLostReasons((prev) =>
        prev.map((item) =>
          item.lostReasonId === id ? { ...item, ...result.data } : item
        )
      );
    } catch (e) {
      setError(e.message);
    }
  };

  // ----------------------------------------------------
  // DELETE
  // ----------------------------------------------------
  const deleteLeadLostReasonController = async (id) => {
    try {
      const result = await leadLostReasonModel.deleteLeadLostReason(id);

      if (result?.success === false) {
        setError(result?.Message || "Failed to delete");
        return;
      }

      setLeadLostReasons((prev) =>
        prev.filter((item) => item.lostReasonId !== id)
      );
    } catch (e) {
      setError(e.message);
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
  };
}
