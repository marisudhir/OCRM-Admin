import Card from "../../components/card";
import CustomTooltip from "../../components/customTooltip";
import { useDashboardController } from "./dashboardController";

function AdminDashboard() {
  const { dashboardData } = useDashboardController();
  const resellerList = dashboardData?.resellerRanking;

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
                        user.bactive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
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
