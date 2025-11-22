import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom'; // Import useNavigate for row click
import { useResellerController } from '../Reseller/resellerController'; // Adjust path if necessary
import CompanyForm from '../Company/companyForm'; // Using CompanyForm as per original code
import { Link } from 'react-router-dom'; // Keep Link for general use if needed elsewhere in the component
import formatDate from '../../utils/formatDate';
import Card from '../../components/card'; // Ensure this path is correct
import { Line, Pie } from 'react-chartjs-2'; // Combine imports for brevity

import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement, // Added BarElement for Bar chart
} from 'chart.js';


import { Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement // Register BarElement
);

// Reusable Reseller Table (Corrected for table structure)
const ResellerGrid = ({ data }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle row click
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Reseller ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Created Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((reseller) => (
            <tr
              key={reseller.ireseller_id}
              className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 ease-in-out"
              onClick={() => handleRowClick(reseller.ireseller_id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {reseller.ireseller_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-lg">
                      {reseller.creseller_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">{reseller.creseller_name || "Unknown"}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {reseller.cEmail}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {reseller.bactive ? (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
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

  // Fetch data on component mount
  useEffect(() => {
    fetchAllResellerData();
  }, []); 

  const filteredData = resellerData.filter((reseller) =>
    `${reseller.cEmail} ${reseller.creseller_name}`.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Demo data for line chart
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue Contribution',
        data: [5000, 7500, 6000, 9000, 10500], // Updated demo data for more variance
        borderColor: '#4299E1', // Tailwind blue-500
        backgroundColor: 'rgba(66, 153, 225, 0.2)', // Light blue fill
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#4299E1',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#4299E1',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow height control
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Inter, sans-serif' },
          color: '#4B5563' // gray-700
        }
      },
      tooltip: {
        backgroundColor: '#374151',
        titleFont: { size: 14, family: 'Inter, sans-serif' },
        bodyFont: { size: 12, family: 'Inter, sans-serif' },
        padding: 10,
        cornerRadius: 4,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: 'Inter, sans-serif' } },
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#E5E7EB' },
        ticks: { color: '#6B7280', font: { family: 'Inter, sans-serif' } },
        border: { display: false }
      },
    },
  };

  // Demo data for bar chart (renamed from 'data' to 'barData' to avoid conflict)
  const barData = {
    labels: ['Reseller A', 'Reseller B', 'Reseller C', 'Reseller D', 'Reseller E'], // More specific labels
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 3000, 15000, 20000], // Updated data for top 5
        backgroundColor: '#6366F1', // Tailwind indigo-500
        borderColor: '#4F46E5', // Tailwind indigo-600
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: '#818CF8', // Tailwind indigo-400
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow height control
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Inter, sans-serif' },
          color: '#4B5563'
        }
      },
      title: {
        display: true,
        text: 'Top 5 Resellers by Revenue',
        font: { size: 18, family: 'Inter, sans-serif', weight: 'bold' },
        color: '#374151'
      },
      tooltip: {
        backgroundColor: '#374151',
        titleFont: { size: 14, family: 'Inter, sans-serif' },
        bodyFont: { size: 12, family: 'Inter, sans-serif' },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        grid: { color: '#E5E7EB' },
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: { family: 'Inter, sans-serif' },
          callback: function(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(value);
          }
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: 'Inter, sans-serif' } },
        border: { display: false }
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 p-6 sm:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto"> {/* Centering content */}
        {/* Header Section: Search, View Toggles, Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search resellers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Grid/List Toggle Icons - Placeholder, assuming no state management */}
          <div className="flex gap-2 justify-center sm:justify-start">
            <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 shadow-sm transition-colors" title="Grid View">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3h5v5H3V3zm0 9h5v5H3v-5zm9-9h5v5h-5V3zm0 9h5v5h-5v-5z" />
              </svg>
            </button>
            <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 shadow-sm transition-colors" title="List View">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" />
              </svg>
            </button>
          </div>

          {/* Create Reseller Button */}
          <div>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setShowForm(true)}
            >
              + Add Reseller
            </button>

            {/* Renders the form according to the state */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"> {/* Increased z-index */}
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4"> {/* Increased padding and shadow */}
                  {/* Using CompanyForm as per original code, consider renaming/creating ResellerForm if different */}
                  <CompanyForm onClose={() => setShowForm(false)} onSuccess={fetchAllResellerData} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards Section */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
  title="Total Company"
  count={dashboardData?.totalCompany}
  icon="/icons/company_list.png"
/>

<Card
  title="Total Reseller"
  count={dashboardData?.totalReseller}
  icon="/icons/reseller.png"   // or "/icons/reseller_image.jpg"
/>

<Card
  title="Total Users"
  count={
    <>
      {dashboardData?.totalUsers}
      <div className="text-sm text-gray-600 mt-2 font-medium">
        <span className="text-green-600">Active: {dashboardData?.activeUsers}</span>
        <span className="ml-3 text-red-600">Inactive: {dashboardData?.inActiveUsers}</span>
      </div>
    </>
  }
  icon="/icons/crm_users.jpg"
/>

          {/* Note: Icon paths 'public/icons/...' should generally be '/icons/...' when deployed */}
        </div>


        {/* Charts Section */}
        <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[350px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Revenue Contribution</h2>
            <div className="flex-grow relative"> {/* Make chart responsive to container height */}
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[350px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 Resellers by Revenue</h2>
            <div className="flex-grow relative"> {/* Make chart responsive to container height */}
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>


        {/* Reseller List/Grid Display */}
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