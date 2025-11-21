import React, { useState, useEffect } from 'react';

const DurationForm = ({ initialData = {}, onSubmit, onClose, loading }) => {

  const [formData, setFormData] = useState({
    plan_duration_id: null,
    duration_in_months: "",
    bactive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        plan_duration_id: initialData.plan_duration_id || null,
        duration_in_months: initialData.duration_in_months || "",
        bactive: initialData.bactive ?? true
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.duration_in_months) {
      newErrors.duration_in_months = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      duration_in_months: Number(formData.duration_in_months)
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">

      <h2 className="text-xl font-bold mb-4">
        {formData.plan_duration_id ? "Edit Duration" : "Add Duration"}
      </h2>

      <form onSubmit={handleSubmit}>

        <label className="block mb-1">Duration (Months)</label>
        <input
          type="number"
          value={formData.duration_in_months}
          name="duration_in_months"
          onChange={(e) =>
            setFormData({ ...formData, duration_in_months: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        {errors.duration_in_months && (
          <p className="text-red-500 text-xs">{errors.duration_in_months}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default DurationForm;
