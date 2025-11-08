import { useState, useMemo, useEffect } from 'react';
import { useCompanyController } from './companyController';
import CompanyForm from './companyForm';
import { Link } from 'react-router-dom';

// ---
// ## Reusable Company Card (CompanyGrid) Enhanced Design
// ---
const CompanyGrid = ({ data }) => {
  const initial = data.cCompany_name?.charAt(0).toUpperCase() || '?';

  return (
    <Link to={`/company-profile/${data.iCompany_id}`} className="block h-full">

      <div
        className=" bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out 
        transform hover:-translate-y-0.5 overflow-hidden p-7 sm:p-8 border border-gray-200 flex flex-col h-full  ">
        {/* Top Section: Company Name, Initial, Website */}
        <div className="flex items-start gap-5 mb-6">

          {/* Increased gap and margin */}
          {/* Profile Initial Circle */}
          <div
            className="
            w-14 h-14 flex items-center justify-center
            bg-blue-50 text-blue-700 font-bold rounded-full text-2xl
            flex-shrink-0
            border border-blue-200 {/* Subtle border */}
          "
          >
            {initial}
          </div>
          <div className="flex-grow">

            {/* Allows name/website to take available space */}
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight mb-0.5">
              {data.cCompany_name}
            </h2>
            <p className="text-base text-blue-600 hover:underline">{data.cWebsite}</p>
          </div>
        </div>
        {/* Separator Line */}
        <div className="border-t border-gray-100 my-4"></div> {/* Subtle separator */}
        {/* Details Section: Phone, Plan, City */}
        <div className="text-base text-gray-700 flex-grow">

          {/* Allows details section to grow */}
          <div className="flex justify-between items-center mb-3">

            <span className="font-medium text-gray-500">Phone:</span>
            <span className="font-semibold text-gray-800">{data.iPhone_no}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-gray-500">Plan:</span>
            <span
            // className={`
            //   text-sm font-bold px-3 py-1.5 rounded-full
            //   uppercase
            //   ${
            //     data.pricing_plan?.plan_name.toLowerCase() === 'gold'
            //       ? 'bg-yellow-50 text-yellow-700'
            //       : data.pricing_plan.plan_name.toLowerCase() === 'silver'
            //         ? 'bg-gray-100 text-gray-700'
            //         : data.pricing_plan.plan_name.toLowerCase() === 'bronze'
            //           ? 'bg-amber-50 text-amber-700'
            //           : 'bg-indigo-50 text-indigo-700'
            //   }`}
            >
              {data.pricing_plan?.plan_name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-500">City:</span>
            <span className="font-semibold text-gray-800">{data.city?.cCity_name}</span>
          </div>
        </div>
        {/* Status Badge at the bottom, aligned to right */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">

          {/* Separated and aligned */}
          <span
            className={`
              text-sm font-semibold px-4 py-2 rounded-full
              uppercase tracking-wide
              ${data.bactive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            `}
          >
            {data.bactive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </Link>
  );
};

// ---
// ## Company Table Row (CompanyTableRow)
// ---
const CompanyTableRow = ({ data }) => {
  return (
    <Link to={`/company-profile/${data.iCompany_id}`} className="contents">
      <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ease-in-out">
        <td className="px-6 py-4 whitespace-nowrap text-sm  text-gray-800 ">
          {data.cCompany_name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
          {data.cWebsite || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
          {data.iPhone_no}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
          {data.city?.cCity_name || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <span
            className={`
              text-xs font-bold px-3 py-1.5 rounded-full
              uppercase
              ${data.pricing_plan.plan_name.toLowerCase() === 'gold'
                ? 'bg-yellow-50 text-yellow-700'
                : data.pricing_plan.plan_name.toLowerCase() === 'silver'
                  ? 'bg-gray-100 text-gray-700'
                  : data.pricing_plan.plan_name.toLowerCase() === 'bronze'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-indigo-50 text-indigo-700'
              }`}
          >
            {data.pricing_plan.plan_name}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
          <span
            className={`
              text-xs font-semibold px-3 py-1.5 rounded-full
              uppercase tracking-wide
              ${data.bactive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            `}
          >
            {data.bactive ? 'Active' : 'Inactive'}
          </span>
        </td>
      </tr>
    </Link>
  );
};

// ---  
// ## Company Table Component
// ---
const CompanyTable = ({ data, sortConfig, requestSort }) => {
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ⬆' : ' ⬇';
    }
    return '';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('cCompany_name')}
            >
              Name {getSortIndicator('cCompany_name')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('cWebsite')}
            >
              Website {getSortIndicator('cWebsite')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('iPhone_no')}
            >
              Phone {getSortIndicator('iPhone_no')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('city.cCity_name')}
            >
              City {getSortIndicator('city.cCity_name')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('pricing_plan.plan_name')}
            >
              Plan {getSortIndicator('pricing_plan.plan_name')}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('bactive')}
            >
              Status {getSortIndicator('bactive')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((company) => (
            <CompanyTableRow key={company.iCompany_id} data={company} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---
// ## Main Company Page (Company) Enhanced Design
// ---
const Company = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewType, setViewType] = useState('grid');
  const [sortConfig, setSortConfig] = useState({ key: 'dModifiedDate', direction: 'descending' });

  const { companyData, fetchAllCompanyData, createCompany } = useCompanyController();



  useEffect(() => {
    fetchAllCompanyData();
    console.log("Fetching company data...")
  }, []);

  //   useEffect(() => {
  //   console.log("🔍 Company Data Debug:", {
  //     companyData,
  //     type: typeof companyData,
  //     isArray: Array.isArray(companyData),
  //     keys: companyData ? Object.keys(companyData) : 'no data'
  //   });
  // }, [companyData]);

  // Filter data based on search query
  const filteredData = useMemo(() => {
    // Ensure companyData is always an array
    const dataArray = Array.isArray(companyData) ? companyData : [];

    return dataArray.filter((company) => {
      // Ensure all properties exist before calling .toLowerCase()
      const companyName = company.cCompany_name || '';
      const website = company.cWebsite || '';
      const phone = company.iPhone_no || '';
      const cityName = company.city?.cCity_name || '';
      const planName = company.pricing_plan?.plan_name || '';
      const org = company.cOrg || '';
      const email = company.cEmail || '';

      return `${companyName} ${website} ${phone} ${cityName} ${planName} ${org} ${email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [companyData, searchQuery]);

  // Sort data based on sortConfig
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        // Handle nested properties for sorting
        if (sortConfig.key.includes('.')) {
          const [parentKey, childKey] = sortConfig.key.split('.');
          aValue = a[parentKey]?.[childKey];
          bValue = b[parentKey]?.[childKey];
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        // Handle string comparison (case-insensitive for most fields)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          // Special handling for dates
          if (sortConfig.key === 'dModifiedDate' || sortConfig.key === 'dCreatedDate') {
            const dateA = new Date(aValue);
            const dateB = new Date(bValue);
            if (dateA < dateB) {
              return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (dateA > dateB) {
              return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
          }
          // Default string comparison
          if (aValue.toLowerCase() < bValue.toLowerCase()) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue.toLowerCase() > bValue.toLowerCase()) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
        }
        // Handle boolean (status)
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          if (aValue === bValue) return 0;
          if (sortConfig.direction === 'ascending') {
            return aValue ? -1 : 1; // Active (true) comes before Inactive (false)
          } else {
            return aValue ? 1 : -1; // Inactive (false) comes before Active (true)
          }
        }
        // Default number comparison or fallback
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      key = null;
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 font-sans antialiased">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Companies <span className="text-blue-600">Overview</span>
        </h1>
        {/* Bell Icon for Notifications */}
        <button
          className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full transition-colors"
          title="Notifications"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Box */}
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, website, phone, city, plan, org, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full px-4 py-2 pl-10
                border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                shadow-sm
                placeholder-gray-400 text-gray-700
              "
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Grid/List Toggle Icons */}
        <div className="flex gap-2 justify-center sm:justify-start flex-shrink-0">
          <button
            onClick={() => setViewType('grid')}
            className={`
              p-2 border border-gray-300 rounded-lg
              ${viewType === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 bg-white'}
              hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors
            `}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3h5v5H3V3zm0 9h5v5H3v-5zm9-9h5v5h-5V3zm0 9h5v5h-5v-5z" />
            </svg>
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`
              p-2 border border-gray-300 rounded-lg
              ${viewType === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 bg-white'}
              hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors
            `}
            title="List View"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" />
            </svg>
          </button>
        </div>

        {/* Create Company Button */}
        <div className="flex-shrink-0">
          <button
            className="
              px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg
              shadow-md hover:bg-blue-700 hover:shadow-lg transition-all
              flex items-center justify-center gap-2
            "
            onClick={() => setShowForm(true)}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Create Company
          </button>

          {/* Renders the form according to the state (Modal) */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div
                className="
                bg-white p-7 rounded-xl shadow-2xl
                w-full max-w-lg md:max-w-xl lg:max-w-2xl
                transform scale-95 animate-fade-in
              "
              >
                <CompanyForm onClose={() => setShowForm(false)} onSuccess={fetchAllCompanyData} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conditional Rendering of Grid or List */}
      {sortedData.length > 0 ? (
        viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {sortedData.map((company) => (
              <CompanyGrid key={company.iCompany_id} data={company} />
            ))}
          </div>
        ) : (
          <CompanyTable data={sortedData} sortConfig={sortConfig} requestSort={requestSort} />
        )
      ) : (
        <p className="text-gray-600 text-lg text-center col-span-full py-10">
          No companies match your search criteria.
        </p>
      )}
    </div>
  );
};

export default Company;
