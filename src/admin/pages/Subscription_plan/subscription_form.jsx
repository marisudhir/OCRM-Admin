import React, { useState, useEffect } from "react";

export default function SubscriptionForm({ onSubmit, initialData, currencyList }) {
 
    console.log("Currency list : ",currencyList)
  const [form, setForm] = useState({
    planName: "",
    maxUserCount: "",
    price: "",
    currencyId:"",
    durationType: 'monthly',
  });

  // Load data for editing
  useEffect(() => {
    if (initialData) {
      setForm({
        planName: initialData.plan_name || "",
        maxUserCount: Number(initialData.iMax_users) || "",
        price: Number(initialData.price) || "",
        currencyId: Number(initialData.currency_id) || "",
        durationType: initialData.duration_type || "monthly",

      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert numeric fields
    if (name === "maxUserCount" || name === "price" || name === "currencyId") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    // Reset form
    setForm({
      planName: "",
      maxUserCount: "",
      price: "",
      currencyId: "",
      durationType: "monthly",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-2xl"
    >
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? "Edit Subscription" : "Add Subscription"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Plan Name</label>
          <input
            type="text"
            name="planName"
            value={form.planName}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Users</label>
          <input
            type="number"
            name="maxUserCount"
            value={form.maxUserCount}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            name="currencyId"
            value={form.currencyId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          >
            {currencyList.length > 0 ?
              (
              currencyList.map(currency =>
              <option key={currency.icurrency_id} value={currency.icurrency_id}>
               {currency.currency_code} - {currency.country_name}
              </option>
              )
             )
              : (<option disabled>No currency found</option>)
            }

          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration</label>
          <select
            name="durationType"
            value={form.durationType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
          >
            <option value="monthly">Monthly</option>
            <option value="annually">Annually</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initialData ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}