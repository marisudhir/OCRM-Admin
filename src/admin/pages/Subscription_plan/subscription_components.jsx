// views/SubscriptionPage.jsx
import React, { useState } from "react";

import { subscriptionCRUDOperation } from "./subscription_controller";
import SubscriptionForm from "./subscription_form";

export default function SubscriptionPage() {
  const {
    subscriptions,
    loading,
    error,
    addSubscription,
    editSubscription,
    changeSubscriptionStatusController,
    currencies
  } = subscriptionCRUDOperation();

  const [editing, setEditing] = useState(null);
  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  console.log("Currency in com: ", currencies)
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>

      {/* Subscription Form */}
      <SubscriptionForm
        onSubmit={(sub) => {
          if (editing) {
            editSubscription(editing.plan_id, { ...sub, planDurationId: editing.planDurationId, });
            setEditing(null);
          } else {
            addSubscription(sub);
          }
        }}
        initialData={editing}
        currencyList={currencies}
      />

      {/* Subscription Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Plan Name</th>
              <th className="px-4 py-2 border">Max Users</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Currency</th>
              <th className="px-4 py-2 border">Duration</th>
              <th className="px-4 py-2 border">Created By</th>
              <th className="px-4 py-2 border">Updated By</th>
              <th className="px-4 py-2 border">Active</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub, index) => (
              <tr
                key={sub.plan_id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border">{sub.plan_name}</td>
                <td className="px-4 py-2 border">{sub.iMax_users}</td>
                <td className="px-4 py-2 border">{sub.price}</td>
                <td className="px-4 py-2 border">{sub.currency}</td>
                <td className="px-4 py-2 border">{sub.duration_type}</td>
                <td className="px-4 py-2 border">{sub.createdBy}</td>
                <td className="px-4 py-2 border">{sub.updatedBy}</td>
                <td className="px-4 py-2 border">
                  {sub.bactive ? "✅" : "❌"}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => setEditing(sub)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      changeSubscriptionStatusController(sub.plan_id, { status: !sub.bactive })
                    }
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Change Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}