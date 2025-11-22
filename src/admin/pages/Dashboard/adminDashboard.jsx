import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Card from "../../components/card";
import CustomTooltip from "../../components/customTooltip";
import { useDashboardController } from "./dashboardController";

function AdminDashboard() {
  const data = [
    { name: 'Jan', users: 400 },
    { name: 'Feb', users: 300 },
    { name: 'Mar', users: 500 },
    { name: 'Apr', users: 200 },
    { name: 'May', users: 350 },
    { name: 'June', users: 300 },
  ];

  const storageData = [
    { name: 'Used', value: 30 },
    { name: 'Available', value: 70 },
  ];

  const { dashboardData } = useDashboardController();
  const resellerList = dashboardData?.resellerRanking;

  const COLORS = ['#FF7043', '#4CAF50'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 font-sans antialiased">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">
        <span className="text-indigo-600">🧭</span> Admin Dashboard
      </h1>

      {/* Card Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card
          title="Total Company"
          count={dashboardData?.totalCompany}
          icon="/icons/company_list.png"
        />

        <Card
          title="Total Reseller"
          count={dashboardData?.totalReseller}
          icon="/icons/reseller_image.jpg"
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
      </div>

      {/* Row Layout: Bar chart + Donut chart */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        {/* Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl w-full lg:w-[70%]">
          <h3 className="text-xl font-semibold text-gray-700 mb-5">Server Downtime (Hrs)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barSize={30}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip content={(props) => <CustomTooltip {...props} suffix="hrs" />} />
              <Bar dataKey="users" fill="#4F46E5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl w-full lg:w-[30%] flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-5">Storage Availability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={storageData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {storageData.map((entry, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center mt-4 space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#FF7043] rounded-full" />
              <span className="text-gray-700 font-medium">Used</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#4CAF50] rounded-full" />
              <span className="text-gray-700 font-medium">Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reseller Rankings Table */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-yellow-500">🏅</span> Reseller Rankings
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700 divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">S.No</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-center">Company</th>
                <th className="px-6 py-3 text-left">Active Clients</th>
                <th className="px-6 py-3 text-left">Commission Earned</th>
                <th className="px-6 py-3 text-left">Admin ID</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resellerList?.map((user, idx) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition duration-200"
                >
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4 font-medium">{user.cFull_name}</td>
                  <td className="px-6 py-4">{user.cEmail}</td>
                  <td className="px-6 py-4 text-center">{user.iCompany_id}</td>
                  <td className="px-6 py-4">{user.activeClients}</td>
                  <td className="px-6 py-4">₹{user.companyRevenue}</td>
                  <td className="px-6 py-4">{user.iUser_id}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.bactive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.bactive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
