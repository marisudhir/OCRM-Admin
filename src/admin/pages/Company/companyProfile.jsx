import {
  Button,
  IconButton,
  Tabs,
  Tab,
  Box,
  Typography,
  Menu,
  MenuItem,
  TextField,
  Autocomplete,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PieChart } from '@mui/x-charts/PieChart';

import { useCompanyController } from "./companyController";
import { useSharedController } from "../../api/shared/controller";
import formatDate from "../../utils/formatDate";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import GeneralSettingsTab from "./GeneralSettingsTab";
import CompanyUser from "./companyUser.jsx"
import LeadStatus from "../Masters/Status/leadStauts.jsx";
import LeadPotential from "../Masters/Potential/leadPotential.jsx";
import LeadSource from "../Masters/Source/leadSource.jsx";
import LeadIndustry from "../Masters/Industry/industry.jsx";
import DistrictMaster from "../Masters/district/districtMasters.jsx"
import CountryMaster from "../Masters/country/countryMaster.jsx"
import StateMaster from "../Masters/States/StateMaster.jsx"
import CurrencyMaster from "../Masters/currency/currencyMaster.jsx"
import AuditLoginTab from "./AuditLoginTab";
import { useToast } from "../../../context/ToastContext.jsx";
import LeadServices from "../Masters/Services/Services.jsx";
import SubIndustry from "../Masters/Sub-Industry/SubIndustry.jsx";
import SubService from "../Masters/Sub-service/SubService.jsx";
import ProposalSentMode from "../Masters/Proposal Sent Mode/proposalSentMode.jsx";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

import { ArrowLeft } from "lucide-react";
import { LeadLostReason } from "../Masters/lead_lost_reason/lead_lost_reason_component.jsx";

// A simple panel component to show content based on active tab
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MasterDataPanel = ({ companyData }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const cardData = [
    {
      id: 1,
      title: "Lead Status",
      description: "Current stage of the lead.",
      icon: "/icons/status.svg",
      component: "LeadStatus",
    },
    {
      id: 2,
      title: "Lead Potential",
      description: "Business value of the lead.",
      icon: "/icons/progress.svg",
      component: "LeadPotential",
    },
    {
      id: 3,
      title: "Lead Source",
      description: "Business value of the lead.",
      icon: "/icons/source.svg",
      component: "LeadSource",
    },
    {
      id: 4,
      title: "Lead Industry",
      description: "Business value of the lead.",
      icon: "/icons/industry.svg",
      component: "LeadIndustry",
    },
    {
      id: 5,
      title: "Country",
      description: "List of Country.",
      icon: "/icons/country.svg",
      component: "country",
    },
    {
      id: 6,
      title: "State",
      description: "List of State.",
      icon: "/icons/states.svg",
      component: "state",
    },
    {
      id: 7,
      title: "District",
      description: "List of Districts.",
      icon: "/icons/city.svg",
      component: "district",
    },
    {
      id: 8,
      title: "Service",
      description: "List of services",
      icon: "/icons/industrial-park.svg",
      component: "services",
    },
    {
      id: 9,
      title: "Currency",
      description: "List of currencies",
      icon: "/icons/currency.svg",
      component: "currency",
    },
    {
      id: 10,
      title: "Sub-Service",
      description: "List of currencies",
      icon: "/icons/industrial-park.svg",
      component: "sub-service",
    },
    {
      id: 11,
      title: "Proposal Sent Mode",
      description: "proposal modes like email, whatsapp etc",
      icon: "/icons/proposal_send_mode.svg",
      component: "proposal-sent-mode",
    },
    {
      id: 12,
      title: "Lead Lost Reason",
      description: "Lead lost resaon is for adding the lost reason of the lead ",
      icon: "/icons/industrial-park.svg",
      component: "lead-lost-reason",
    },
  ];

  const renderComponent = () => {
    console.log("Selected company:", companyData?.cCompany_name); // Added optional chaining
    switch (selectedComponent) {
      case "LeadStatus":
        return <LeadStatus company={companyData?.cCompany_name} />; // Added optional chaining
      case "LeadPotential":
        return <LeadPotential company={companyData?.cCompany_name} />; // Added optional chaining
      case "LeadSource":
        return <LeadSource company={companyData?.cCompany_name} />; // Added optional chaining
      case "LeadIndustry":
        return <LeadIndustry />;
      case 'district':
        return <DistrictMaster />;
      case 'country':
        return <CountryMaster />;
      case 'state':
        return <StateMaster />;
      case 'currency':
        return <CurrencyMaster />;
      case 'services':
        return <LeadServices company={companyData} />;
      case 'sub-service':
        return <SubService company={companyData} />;
      case 'proposal-sent-mode':
        return <ProposalSentMode company={companyData} />;
      case 'lead-lost-reason':
        return <LeadLostReason company={companyData.iCompany_id} />;
      default:
        return null;
    }
  };

  if (selectedComponent) {
    return (
      <div className="p-4">
        <button
          onClick={() => setSelectedComponent(null)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back to Master Cards
        </button>
        {renderComponent()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cardData.map((card) => (
        <button
          key={card.id}
          onClick={() => setSelectedComponent(card.component)}
          className="text-left group w-full"
        >
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform group-hover:-translate-y-1 border border-gray-200 h-full flex flex-col justify-between">
            <div className="flex items-start mb-4">
              <img
                src={card.icon}
                alt={card.title}
                className="w-10 h-10 mr-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {card.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

const CompanyProfile = () => {
  const navigate = useNavigate();
  const {
    fetchCompanyDataById,
    usersByCompany,
    changeUserStatus,
    editCompanyDetails,
    fetchUsersByCompanyId,
    error,
    createUser,
    loading,
    fetchAdditionalData,
    currencies,
    bussiness,
    plan,
    storageDetailsController,
    storageDetails
  } = useCompanyController();

  const { fetchAllCities, cities, fetchRoles, roles } = useSharedController();
  const { showToast } = useToast();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // States
  const [errors, setErrors] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openUserCreateDialog, setOpenUserCreateDialog] = useState(false);
  const [editCompanyData, setEditCompanyData] = useState({});
  const [openUserStatusDialog, setOpenUserStatusDialog] = useState(false);
  const [userToModify, setUserToModify] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCompanyStatusDialog, setOpenCompanyStatusDialog] = useState(false);
  const [modules, setModules] = useState([
    {
      name: "Leads",
      description: "Manage potential customers before they convert into contacts or deals.",
    },
    {
      name: "Contacts",
      description: "Store individual contact details of clients, suppliers, or partners.",
    },
    {
      name: "Deals",
      description: "Track ongoing sales activities and their progress toward closure.",
    },
    {
      name: "Support",
      description: "Record and resolve customer issues using a structured ticketing system.",
    },
  ]);
  const [userFormData, setUserFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    jobTitle: "",
    businessPhone: "",
    personalPhone: "",
    role: "",
    reporting: "",
  });

  const { id } = useParams();

  // Validation function
  const validateCompanyData = (data) => {
    const errors = {};

    if (!data.cCompany_name?.trim()) errors.cCompany_name = "Company name is required";
    if (!data.iPhone_no?.trim()) errors.iPhone_no = "Phone number is required";
    if (!data.cemail_address?.trim()) errors.cemail_address = "Email is required";
    if (!data.cGst_no?.trim()) errors.cGst_no = "GST Number is required";
    if (!data.icin_no?.trim()) errors.icin_no = "CIN Number is required";
    if (!data.caddress1?.trim()) errors.caddress1 = "Address Line 1 is required";
    if (!data.iUser_no || isNaN(data.iUser_no)) errors.iUser_no = "Valid user count is required";
    if (!data.icity_id) errors.icity_id = "City is required";

    return errors;
  };

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleOpenEditDialog = async (company) => {
    // Fetch additional data needed for the edit form
    await fetchAdditionalData(); // This should fetch cities, currencies, business types, plans
    await fetchAllCities();
    await fetchRoles(); // If needed for other parts

    setEditCompanyData({
      iCompany_id: company?.iCompany_id,
      cCompany_name: company?.cCompany_name || "",
      iPhone_no: company?.iPhone_no || "",
      cemail_address: company?.cemail_address || "",
      cWebsite: company?.cWebsite || "",
      cGst_no: company?.cGst_no || "",
      icin_no: company?.icin_no || "",
      cPan_no: company?.cPan_no || "",
      industry: company?.industry || "",
      fax_no: company?.fax_no || "",
      iUser_no: company?.iUser_no || "",
      caddress1: company?.caddress1 || "",
      caddress2: company?.caddress2 || "",
      caddress3: company?.caddress3 || "",
      cpincode: company?.cpincode || "",
      cLogo_link: company?.cLogo_link || "",
      icity_id: company?.icity_id || "",
      icurrency_id: company?.icurrency_id || "",
      ibusiness_type: company?.ibusiness_type || "",
      isubscription_plan: company?.isubscription_plan || "",
      ireseller_id: company?.ireseller_id || "",
      city: company?.city || null,
      currency: company?.currency || null,
      business_type: company?.business_type || null,
      subscription_plan: company?.subscription_plan || null
    });

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    const intFields = [
      "iUser_no", "iReseller_id", "iPhone_no", "ireseller_id",
      "isubscription_plan", "cpincode", "icity_id", "icurrency_id",
      "ibusiness_type"
    ];

    setEditCompanyData((prevData) => ({
      ...prevData,
      [name]: intFields.includes(name)
        ? value === "" ? "" : parseInt(value, 10)
        : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSaveEditedCompany = async () => {
    const newErrors = validateCompanyData(editCompanyData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("error", "Please fill all required fields");
      return;
    }

    const response = await editCompanyDetails(editCompanyData, editCompanyData.iCompany_id);
    setOpenEditDialog(false);
    if (response) {
      showToast("success", "Company details updated successfully.");
      const updatedCompany = await fetchCompanyDataById(id);
      setCompany(updatedCompany);
    } else {
      showToast("error", "Failed to update company details");
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setUserToModify(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenStatusConfirmation = () => {
    setOpenUserStatusDialog(true);
    handleMenuClose();
  };

  const handleCloseUserStatusDialog = () => {
    setOpenUserStatusDialog(false);
    setUserToModify(null);
  };

  const handleToggleUserStatus = async () => {
    if (userToModify) {
      await changeUserStatus(userToModify.iUser_id);
      handleCloseUserStatusDialog();
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUserCreate = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", userFormData);

    const jsonData = {
      cFull_name: userFormData.fullName,
      cUser_name: userFormData.username,
      cEmail: userFormData.email,
      cPassword: userFormData.password,
      i_bPhone_no: userFormData.businessPhone,
      iphone_no: userFormData.personalPhone,
      iCompany_id: company?.iCompany_id,
      irole_id: parseInt(userFormData.role),
    };

    const res = await createUser(jsonData);
    console.log(res);
    res
      ? showToast("success", "User created successfully.")
      : showToast("error", error);
    setOpenUserCreateDialog(false);
  };
  const handleUserCreateDialog = () => {
    setOpenUserCreateDialog(false);
  };

  // Effects
  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await fetchCompanyDataById(id);
        //call the controller function to get storage details 
        const storageData = await storageDetailsController(id)

        console.log("The storage company data is:", storageData);
        console.table("The company data is:", data);
        setCompany(data);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        setCompany(null);
      }
    };

    if (id) loadCompany();
  }, [id]);

  useEffect(() => {
    if (activeTab === 2 && id) {
      console.log("Fetching users for company ID:", id);
      fetchUsersByCompanyId(id);
      fetchRoles();
    }
  }, [activeTab, id]);

  // Calculations
  const totalPages = Math.ceil(
    (Array.isArray(usersByCompany) ? usersByCompany.length : 0) / usersPerPage
  );

  const paginatedUsers = (usersByCompany || []).slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const fullAddressParts = [
    company?.caddress1,
    company?.caddress2,
    company?.caddress3,
    company?.city?.cCity_name,
    company?.country?.cCountry_name,
  ].filter(Boolean);
  const fullAddress = fullAddressParts.length > 0 ? fullAddressParts.join(", ") : "-";

  const created_at = formatDate(company?.dCreated_dt);
  const modified_at = formatDate(company?.dModified_dt);
  const companyInitial = company?.cCompany_name?.charAt(0).toUpperCase() || "?";
  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen font-sans antialiased">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-gray-100">
        <div className="flex items-center gap-6">
          {company?.cLogo_link ? ( // Changed from cCompany_logo_url to cLogo_link
            <img
              src={company.cLogo_link}
              alt="Company Logo"
              className="w-20 h-20 rounded-full object-cover shadow-sm ring-2 ring-blue-200"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-4xl shadow-sm ring-2 ring-blue-200">
              {companyInitial}
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {company?.cCompany_name || "Loading Company..."} {/* Removed .result */}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              Company ID:
              <span className="font-semibold text-gray-700">
                {company?.iCompany_id || "-"} {/* Removed .result */}
              </span>
              {company && (
                <span
                  className={`
                    text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm uppercase
                    ${company.bactive // Removed .result
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {company.bactive ? "Active" : "Inactive"} {/* Removed .result */}
                </span>
              )}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Subscription Plan:
              <span className="font-semibold text-gray-700">
                {company?.pricing_plan?.plan_name || "-"} {/* Removed .result */}
              </span>
            </p>
          </div>
        </div>

        <button
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          onClick={handleOpenEditDialog}
        >
          Edit Profile
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Total Users</h3>
          <p className="text-4xl font-extrabold text-blue-600">{company?.userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Total Leads</h3>
          <p className="text-4xl font-extrabold text-green-600">{company?.totalLeads}</p> {/* Removed .result */}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Total Revenue</h3>
          <p className="text-4xl font-extrabold text-purple-600">{company?.totalRevenueAmount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100 flex flex-col justify-center items-center">
          <h3 className="text-base font-semibold text-gray-700 mb-2">Active modules</h3>
          <p className="text-4xl font-extrabold text-orange-600">{company?.allocatedModules}</p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-md p-0 border border-gray-100">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="company profile tabs"
            sx={{ ".MuiTabs-indicator": { backgroundColor: "#2563EB" } }}
          >
            <Tab label={<span className="font-semibold text-gray-700 hover:text-blue-600">Company Profile</span>} {...a11yProps(0)} />
            <Tab label={<span className="font-semibold text-gray-700 hover:text-blue-600">General Settings</span>} {...a11yProps(1)} />
            <Tab label={<span className="font-semibold text-gray-700 hover:text-blue-600">Users</span>} {...a11yProps(2)} />
            <Tab label={<span className="font-semibold text-gray-700 hover:text-blue-600">Masters</span>} {...a11yProps(3)} />
            <Tab label={<span className="font-semibold text-gray-700 hover:text-blue-600">Audit login</span>} {...a11yProps(4)} />
          </Tabs>
        </Box>

        {/* Company Profile Tab */}
        <CustomTabPanel value={activeTab} index={0}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-white rounded-xl p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6 text-base text-gray-800">
                <p className="flex items-center gap-2">
                  <img src="/icons/company.png" alt="Company" width={30} height={30} />
                  <span className="font-semibold">{company?.cCompany_name || "-"}</span> {/* Removed .result */}
                </p>
                <p className="flex items-center gap-2">
                  <PhoneIcon className="text-gray-500" />
                  <span className="font-semibold">{company?.iPhone_no || "-"}</span> {/* Removed .result */}
                </p>
                <p className="flex items-center gap-2">
                  <EmailIcon className="text-gray-500" />
                  <span className="font-semibold">{company?.cemail_address || "-"}</span> {/* Removed .result */}
                </p>
                <p className="md:col-span-2 lg:col-span-1 flex items-center gap-2">
                  <LanguageIcon className="text-gray-500" />
                  <a href={`http://${company?.cWebsite}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">
                    {company?.cWebsite || "-"} {/* Removed .result */}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <img src="/icons/reseller.png" alt="Reseller" width={30} height={30} />
                  <span className="font-semibold">{company?.iReseller_id || "-"}</span> {/* Removed .result */}
                </p>
                <p className="flex items-center gap-2">
                  <img src="/icons/user.png" alt="User" width={30} height={30} />
                  <span className="font-semibold">{company?.iUser_no || "-"}</span> {/* Removed .result */}
                </p>
                <p className="flex items-center gap-2">
                  <img src="/icons/gst.png" alt="GST Number" width={30} height={30} />
                  <span className="font-semibold">{company?.cGst_no || "-"}</span> {/* Removed .result */}
                </p>
                <p className="flex items-center gap-2">
                  <img src="/icons/cin.png" alt="CIN Number" width={30} height={30} />
                  <span className="font-semibold">{company?.icin_no || "-"}</span>
                </p>
                <p className="md:col-span-2 lg:col-span-1 flex items-start gap-2">
                  <LocationOnIcon className="text-gray-500 mt-1" />
                  <span className="font-semibold">{fullAddress}</span>
                </p>
                <p className="flex items-center gap-2">
                  <EventIcon className="text-gray-500" />
                  <span className="font-semibold">{created_at || "-"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <EditDocumentIcon className="text-gray-500" />
                  <span className="font-semibold">{modified_at || "-"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <EditDocumentIcon className="text-gray-500" />
                  <span className="font-semibold">{company?.totalLeads || "-"}</span>
                </p>
              </div>
            </div>
          </div>
          {console.log("The company daaaaaaattaaaa is :", company)}
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: storageDetails.percentageUsed, label: `Storage Used : ${storageDetails.storageUsed}` },
                  { id: 1, value: storageDetails.percentageAvailable, label: `Available Storage : ${storageDetails.storageAlloted}` },
                ],
              },
            ]}
            width={200}
            height={200}
          />



        </CustomTabPanel>

        {/* General Settings Tab */}
        <CustomTabPanel value={activeTab} index={1}>
          <GeneralSettingsTab company={company} />
        </CustomTabPanel>

        {/* Users Tab */}
        <CustomTabPanel value={activeTab} index={2}>

          {error && <p className="text-red-500 mb-4">Error: {error}</p>}


          <div className="p-6 h-screen bg-white overflow-y-auto">
            {showProfile ? (
              // 👉 PROFILE VIEW
              <div>
                {console.log('Selected User:', selectedUser)}

                <CompanyUser user={selectedUser} companyId={company?.iCompany_id} setShowProfile={setShowProfile} />
              </div>
            ) : (
              // 👉 USER LIST VIEW
              <div className="overflow-x-auto">
                <div className="flex justify-end mb-4">
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                    onClick={() => setOpenUserCreateDialog(true)}
                  >
                    + Create user
                  </button>
                </div>

                {paginatedUsers.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 border-rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedUsers.map((user) => (
                        <tr
                          key={user.iUser_id}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            setSelectedUser(user); // Save clicked user
                            setShowProfile(true);  // Switch to profile view
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.cFull_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.cEmail}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.dCreate_dt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.bactive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                              {user.bactive ? "Active" : "Deactivated"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Optional Action Button */}
                            <button className="text-blue-600 hover:text-blue-800">⋮</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-red-500">No user data available for this company.</p>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </CustomTabPanel>

        {/* Masters Tab */}
        <CustomTabPanel value={activeTab} index={3}>
          <MasterDataPanel companyData={company} /> {/* Removed .result */}
        </CustomTabPanel>

        {/* Audit Login Tab */}
        <CustomTabPanel value={activeTab} index={4}>
          <AuditLoginTab company_id={company?.iCompany_id} /> {/* Removed .result */}
        </CustomTabPanel>
      </div>

      {/* Edit Company Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="lg">
        <DialogTitle className="text-2xl font-bold text-center text-gray-900 border-b pb-4">Edit Company Details</DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <TextField label={<span>Company Name <span className="text-red-500">*</span></span>} name="cCompany_name" value={editCompanyData?.cCompany_name || ""} onChange={handleEditFormChange} fullWidth variant="outlined" error={!!errors.cCompany_name} helperText={errors.cCompany_name} />
            <TextField label={<span>Phone Number <span className="text-red-500">*</span></span>} name="iPhone_no" value={editCompanyData?.iPhone_no || ""} onChange={handleEditFormChange} fullWidth variant="outlined" error={!!errors.iPhone_no} helperText={errors.iPhone_no} />
            <TextField label={<span>Email <span className="text-red-500">*</span></span>} name="cemail_address" value={editCompanyData?.cemail_address || ""} onChange={handleEditFormChange} fullWidth variant="outlined" error={!!errors.cemail_address} helperText={errors.cemail_address} />
            <TextField label="Website" name="cWebsite" value={editCompanyData?.cWebsite || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />
            <TextField label={<span>GST Number <span className="text-red-500">*</span></span>} name="cGst_no" value={editCompanyData?.cGst_no || ""} onChange={(e) => { const upperValue = e.target.value.toUpperCase(); setEditCompanyData(prev => ({ ...prev, cGst_no: upperValue })); }} fullWidth variant="outlined" error={!!errors.cGst_no} helperText={errors.cGst_no} />
            <TextField label={<span>CIN Number <span className="text-red-500">*</span></span>} name="icin_no" value={editCompanyData?.icin_no || ""} onChange={(e) => { const upperValue = e.target.value.toUpperCase(); setEditCompanyData(prev => ({ ...prev, icin_no: upperValue })); }} fullWidth variant="outlined" error={!!errors.icin_no} helperText={errors.icin_no} />
            <TextField label="PAN Number" name="cPan_no" value={editCompanyData?.cPan_no || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />
            <TextField label="Industry" name="industry" value={editCompanyData?.industry || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />
            <TextField label="Fax Number" name="fax_no" value={editCompanyData?.fax_no || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />
            <TextField label={<span>Number of Users <span className="text-red-500">*</span></span>} name="iUser_no" type="number" value={editCompanyData?.iUser_no || ""} onChange={handleEditFormChange} fullWidth variant="outlined" error={!!errors.iUser_no} helperText={errors.iUser_no} />
            <TextField label={<span>Address Line 1 <span className="text-red-500">*</span></span>} name="caddress1" value={editCompanyData?.caddress1 || ""} onChange={handleEditFormChange} fullWidth variant="outlined" error={!!errors.caddress1} helperText={errors.caddress1} />
            <TextField label="Address Line 2" name="caddress2" value={editCompanyData?.caddress2 || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />
            <TextField label="Address Line 3" name="caddress3" value={editCompanyData?.caddress3 || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />
            <TextField label="Pincode" name="cpincode" type="number" value={editCompanyData?.cpincode || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />
            <TextField label="Logo URL" name="cLogo_link" value={editCompanyData?.cLogo_link || ""} onChange={handleEditFormChange} fullWidth variant="outlined" />

            <Autocomplete options={cities} getOptionLabel={(option) => option.cCity_name || ""} value={editCompanyData?.city || null} onChange={(event, newValue) => { setEditCompanyData((prev) => ({ ...prev, city: newValue, icity_id: newValue ? newValue.icity_id : "" })); }} isOptionEqualToValue={(option, value) => option.icity_id === value?.icity_id} renderInput={(params) => (<TextField {...params} label={<span>City <span className="text-red-500">*</span></span>} fullWidth variant="outlined" error={!!errors.icity_id} helperText={errors.icity_id} />)} />

            <Autocomplete options={currencies || []} getOptionLabel={(option) => option.currency_code || ""} value={editCompanyData?.currency || null} onChange={(event, newValue) => { setEditCompanyData((prev) => ({ ...prev, currency: newValue, icurrency_id: newValue ? newValue.icurrency_id : "" })); }} isOptionEqualToValue={(option, value) => option.icurrency_id === value?.icurrency_id} renderInput={(params) => (<TextField {...params} label="Currency" fullWidth variant="outlined" />)} />

            <Autocomplete options={bussiness || []} getOptionLabel={(option) => option.name || ""} value={editCompanyData?.business_type || null} onChange={(event, newValue) => { setEditCompanyData((prev) => ({ ...prev, business_type: newValue, ibusiness_type: newValue ? newValue.id : "" })); }} isOptionEqualToValue={(option, value) => option.id === value?.id} renderInput={(params) => (<TextField {...params} label="Business Type" fullWidth variant="outlined" />)} />

            <Autocomplete options={plan || []} getOptionLabel={(option) => option.plan_name || ""} value={editCompanyData?.subscription_plan || null} onChange={(event, newValue) => { setEditCompanyData((prev) => ({ ...prev, subscription_plan: newValue, isubscription_plan: newValue ? newValue.plan_id : "" })); }} isOptionEqualToValue={(option, value) => option.plan_id === value?.plan_id} renderInput={(params) => (<TextField {...params} label="Subscription Plan" fullWidth variant="outlined" />)} />

            <TextField
              label="Reseller ID"
              name="ireseller_id"
              type="number"
              value={editCompanyData?.ireseller_id || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseEditDialog} color="primary" variant="outlined" className="px-4 py-2 rounded-lg font-semibold">Cancel</Button>
          <Button onClick={handleSaveEditedCompany} color="primary" variant="contained" className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* User Status Dialog */}
      <Dialog open={openUserStatusDialog} onClose={handleCloseUserStatusDialog}>
        <DialogTitle className="text-xl font-bold text-gray-900">Confirm {userToModify?.bactive ? "Deactivation" : "Activation"}</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to {userToModify?.bactive ? "deactivate" : "activate"} user: <span className="font-semibold">{userToModify?.cFull_name}</span>?</Typography>
          <Typography className="mt-2 text-sm text-gray-600">This action will set the user's status to "{userToModify?.bactive ? "Inactive" : "Active"}".</Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseUserStatusDialog} color="primary" variant="outlined" className="px-4 py-2 rounded-lg font-semibold">No</Button>
          <Button onClick={handleToggleUserStatus} color={userToModify?.bactive ? "error" : "success"} variant="contained" className={`px-4 py-2 rounded-lg font-semibold ${userToModify?.bactive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`}>Yes, {userToModify?.bactive ? "Deactivate" : "Activate"}</Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      {openUserCreateDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-50 w-full max-w-2xl mx-auto">
            <form className="bg-white shadow rounded-xl max-w-5xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">Email</label>
                  <input id="email" type="email" value={userFormData.email} onChange={handleChange} placeholder="Enter email" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input id="fullName" type="text" value={userFormData.fullName} onChange={handleChange} placeholder="Enter full name" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input id="username" type="text" value={userFormData.username} onChange={handleChange} placeholder="Enter username" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input id="password" type="password" value={userFormData.password} onChange={handleChange} placeholder="Enter password" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2 col-span-2">
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input id="jobTitle" type="text" value={userFormData.jobTitle} onChange={handleChange} placeholder="Enter job title" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700">Business Phone</label>
                  <input id="businessPhone" type="tel" value={userFormData.businessPhone} onChange={handleChange} placeholder="Business phone number" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="personalPhone" className="block text-sm font-medium text-gray-700">Personal Phone</label>
                  <input id="personalPhone" type="tel" value={userFormData.personalPhone} onChange={handleChange} placeholder="Personal phone number" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <select id="role" value={userFormData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option value="" disabled className="text-gray-400">Choose role</option>
                    {roles.map((role) => (<option key={role.irole_id} value={role.irole_id}>{role.cRole_name}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="reporting" className="block text-sm font-medium text-gray-700">Reports to</label>
                  <select id="reporting" value={userFormData.reporting} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    {!usersByCompany ? (
                      <option value="" disabled className="text-gray-400">No users found</option>
                    ) : (
                      <>
                        <option value="" disabled className="text-gray-400">Choose reporting</option>
                        {usersByCompany.map((user) => (<option key={user.iUser_id} value={user.iUser_id}>{user.cFull_name}</option>
                        )

                        )}
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-center mt-6">
                <button className="bg-[#2563EB] px-4 py-2 rounded-lg text-white" onClick={handleUserCreate}>Save</button>
                <button className="bg-red-400 px-4 py-2 rounded-lg text-white" onClick={handleUserCreateDialog}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Actions Menu */}
      <Menu id="user-actions-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleOpenStatusConfirmation}>{userToModify?.bactive ? "Deactivate" : "Activate"}</MenuItem>
      </Menu>
    </div>
  );
};

export default CompanyProfile;