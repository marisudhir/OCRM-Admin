// Removed chart imports and chart data – keeping only what you need
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResellerController } from '../Reseller/resellerController';
import CompanyForm from '../Company/companyForm';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import Card from '../../components/card';
import { useDashboardController } from '../Dashboard/dashboardController';

// Reusable Reseller Table
const ResellerGrid = ({ data }) => {
  const navigate = useNavigate();

  const handleRowClick = (resellerId) => {
    navigate(`/reseller-profile/${resellerId}`);
  };

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center py-8">No resellers found.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Reseller ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Created Date
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((reseller) => (
            <tr
              key={reseller.ireseller_id}
              className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
              onClick={() => handleRowClick(reseller.ireseller_id)}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {reseller.ireseller_id}
              </td>

              <td className="px-6 py-4 text-sm text-gray-800">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                    {reseller.creseller_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="ml-4 font-semibold text-gray-900">
                    {reseller.creseller_name || 'Unknown'}
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-800">
                {reseller.cEmail}
              </td>

              <td className="px-6 py-4">
                {reseller.bactive ? (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </td>

              <td className="px-6 py-4 text-sm text-gray-800">
                {formatDate(reseller.dCreated_dt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Component
const Reseller = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { fetchAllResellerData, resellerData } = useResellerController();
  const { dashboardData } = useDashboardController();

  useEffect(() => {
    fetchAllResellerData();
  }, []);

  const filteredData = resellerData.filter((reseller) =>
    `${reseller.cEmail} ${reseller.creseller_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Search + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-8">
          <input
            type="text"
            placeholder="Search resellers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm"
          />

          <button
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
            onClick={() => setShowForm(true)}
          >
            + Add Reseller
          </button>

          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
              <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
                <CompanyForm
                  onClose={() => setShowForm(false)}
                  onSuccess={fetchAllResellerData}
                />
              </div>
            </div>
          )}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card title="Total Company" count={dashboardData?.totalCompany} icon="/icons/company_list.png" />
          <Card title="Total Reseller" count={dashboardData?.totalReseller} icon="/icons/reseller.png" />
          <Card
            title="Total Users"
            count={
              <>
                {dashboardData?.totalUsers}
                <div className="text-sm text-gray-600 mt-2">
                  <span className="text-green-600">Active: {dashboardData?.activeUsers}</span>
                  <span className="ml-3 text-red-600">Inactive: {dashboardData?.inActiveUsers}</span>
                </div>
              </>
            }
            icon="/icons/crm_users.jpg"
          />
        </div>

        {/* Reseller Grid */}
        <div className="mt-8">
          {filteredData.length > 0 ? (
            <ResellerGrid data={filteredData} />
          ) : (
            <p className="text-gray-500 text-center py-8">No resellers match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reseller;
