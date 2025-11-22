import React, { useState, useReducer, useCallback } from 'react';

import {
  Box,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import EditIcon from '@mui/icons-material/Edit';

import ToggleButton from '../../components/ToggleSwitch'
import Collapsible from '../../components/Collipsable'
import { useCompanyController , fetchAllCompanyData } from './companyController';

// --- Constants & Utilities ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APP_PASSWORD_REGEX = /^[a-z]*$/; // Lowercase letters only


// --- Reducer for Default Email Account Form ---
const emailFormReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
        errors: {
          ...state.errors,
          [action.field]: '', // Clear error on change
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    case 'RESET_FORM':
      return {
        ...state,
        formData: action.payload, // Set to saved data
        errors: { name: '', email: '', appPassword: '' },
      };
    default:
      return state;
  }
};


// --- Sub-component: General Settings Section ---
const GeneralSettingsSection = ({ formData, handleChange, settings }) => {

  const [localSettings, setLocalSettings] = useState(settings || {});

  const ToggleSection = ({ label, status, name, companyId, sub_name }) => {
    const { changeSettingsStatus } = useCompanyController();
    console.log(
      "The toggle section props are11:",
      label,
      status,
      name,
      sub_name,
      companyId
    );

    

    const handleToggleChange = (name, status, data) => {
      setLocalSettings((prev) => {
        // copy previous state
        const updated = { ...prev };

        if (data.sub_name) {
          updated[data.sub_name] = {
            ...updated[data.sub_name],
            [name]: status,
          };
        } else {
          updated[name] = status;
        }

        // send full updated object to backend
        changeSettingsStatus(JSON.stringify(updated), data.companyId);

        return updated;
      });
    };

    return (
      <div className="flex justify-between mt-4">
        <Typography>{label}</Typography>
        <ToggleButton
          status={status}
          name={name}
          data={{ companyId, sub_name }}
          onToggle={handleToggleChange}
        />
      </div>
    );
  };


  return (
  <>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <Box>
        {/* <Typography variant="subtitle1" className="font-semibold text-gray-800">
          Preferred Currency
        </Typography>
        <Typography variant="body2" className="text-gray-500 mt-1">
          All pricing and reports will use this currency.
        </Typography> */}
      </Box>

      {/* <FormControl
        variant="outlined"
        sx={{ minWidth: 120, mt: { xs: 2, sm: 0 } }}
      >
        <Select
          name="currency"
          value={formData.currency || "INR"} // Default to INR if not set
          onChange={handleChange}
          inputProps={{ "aria-label": "Preferred Currency" }}
          size="small"
        >
          <MenuItem value="INR">₹ INR</MenuItem>
          <MenuItem value="USD">$ USD</MenuItem>
          <MenuItem value="EUR">€ EUR</MenuItem>
        </Select>
      </FormControl> */}
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <Box>
        <Typography variant="subtitle1" className="font-semibold text-gray-800">
          Account Status
        </Typography>
        <Typography variant="body2" className="text-gray-500 mt-1">
          Define the current state of the admin account.
        </Typography>
      </Box>
      <FormControl
        variant="outlined"
        sx={{ minWidth: 120, mt: { xs: 2, sm: 0 } }}
      >
        <Select
          name="status"
          value={formData.status || "active"} // Default to active if not set
          onChange={handleChange}
          inputProps={{ "aria-label": "Account Status" }}
          size="small"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="trial">Trial</MenuItem>
        </Select>
      </FormControl>
    </div>
      <div> {console.log("The settings are:", settings)}
      <ToggleSection
        label="DCRM"
        status={localSettings.DCRM}
        name="DCRM"
       companyId={settings?.companyId}
      />
      {/* <ToggleSection
        label="Poster generator"
        status={localSettings.PosterGenerator}
        name="PosterGenerator"
        companyId={settings?.companyId}
      /> */}
      {/* <ToggleSection
        label="Reminder"
        status={localSettings.Reminder}
        name="Reminder"
        companyId={settings?.companyId}
      />
      <ToggleSection
        label="Website lead tab"
        status={localSettings.WebsiteLead}
        name="WebsiteLead"
        companyId={settings?.companyId}
      />
      <ToggleSection
        label="Import"
        status={localSettings.Import}
        name="Import"
        companyId={settings?.companyId}
      />
      <ToggleSection
        label="Export"
        status={localSettings.Export}
        name="Export"
        companyId={settings?.companyId}
      />
      <ToggleSection
        label="File attachment"
        status={localSettings.FileAttachment}
        name="FileAttachment"
        companyId={settings?.companyId}
      />
      <ToggleSection
        label="Email"
        status={localSettings.Email}
        name="Email"
        companyId={settings?.companyId}
      /> */}

      {/* Collapsible Reports */}
      <Collapsible title="Report" className="mt-5">
        <ToggleSection
          label="Lead lost"
          status={localSettings?.Reports?.LostLeadReport}
          name="LostLeadReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Sales by stage"
          status={localSettings.Reports?.SalesStageReport}
          name="SalesStageReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Lead by territory"
          status={localSettings.Reports?.TerritoryLeadReport}
          name="TerritoryLeadReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Lead conversion"
          status={localSettings.Reports?.LeadConversionReport}
          name="LeadConversionReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Lead owner activity"
          status={localSettings.Reports?.LeadOwnerActivityReport}
          name="LeadOwnerActivityReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Prospects lost lead"
          status={localSettings.Reports?.ProspectsLostLeadsReport}
          name="ProspectsLostLeadsReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="First response time opportunity"
          status={localSettings.Reports?.FirstResponseTimeOppurtunityReport}
          name="FirstResponseTimeOppurtunityReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Company Overall report"
          status={localSettings.Reports?.CompanyOverallReport}
          name="CompanyOverallReport"
          sub_name="Reports"
          companyId={settings?.companyId}
        />
      </Collapsible>

      {/* Collapsible Masters */}
      <Collapsible title="Master" className="mt-5">
        <ToggleSection
          label="Status master"
          status={localSettings.Masters?.StatusMaster}
          name="StatusMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Currency master"
          status={localSettings.Masters?.CurrencyMaster}
          name="CurrencyMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Potential master"
          status={localSettings.Masters?.PotentialMaster}
          name="PotentialMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Industry master"
          status={localSettings.Masters?.IndustryMaster}
          name="IndustryMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Lead source master"
          status={localSettings.Masters?.SourceMaster}
          name="SourceMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Service master"
          status={localSettings.Masters?.ServiceMaster}
          name="ServiceMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Proposal send mode master"
          status={localSettings.Masters?.ProposalModeMaster}
          name="ProposalModeMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Email template master"
          status={localSettings.Masters?.EmailTemplateMaster}
          name="EmailTemplateMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
        <ToggleSection
          label="Lead Lost reason"
          status={localSettings.Masters?.LeasLostReasonMaster}
          name="LeasLostReasonMaster"
          sub_name="Masters"
          companyId={settings?.companyId}
        />
      </Collapsible>
    </div>
  </>
  );
}

// --- Sub-component: Default Email Account Section ---
const DefaultEmailAccountSection = () => {
  const initialEmailState = {
    formData: {
      name: '',
      email: '',
      appPassword: '',
    },
    errors: {
      name: '',
      email: '',
      appPassword: '',
    },
  };

  const [state, dispatch] = useReducer(emailFormReducer, initialEmailState);
  const { formData, errors } = state;
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(true);
  const [savedEmailData, setSavedEmailData] = useState({
    name: '',
    email: '',
    appPassword: '',
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name, value });
  }, []);

  const validateEmailForm = useCallback(() => {
    let newErrors = { name: '', email: '', appPassword: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is mandatory.';
      isValid = false;
    } else if (formData.name.length > 25) {
      newErrors.name = 'Name cannot exceed 25 characters.';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is mandatory.';
      isValid = false;
    } else if (formData.email.length > 50) {
      newErrors.email = 'Email Address cannot exceed 50 characters.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Invalid Email Address format.';
      isValid = false;
    }

    if (!formData.appPassword.trim()) {
      newErrors.appPassword = 'App Password is mandatory.';
      isValid = false;
    } else if (formData.appPassword.length > 75) {
      newErrors.appPassword = 'App Password cannot exceed 75 characters.';
      isValid = false;
    } else if (!APP_PASSWORD_REGEX.test(formData.appPassword)) {
      newErrors.appPassword = 'App Password can only contain lowercase letters (a–z).';
      isValid = false;
    }

    dispatch({ type: 'SET_ERRORS', errors: newErrors });
    return isValid;
  }, [formData]);

  const handleSaveEmailAccount = () => {
    if (validateEmailForm()) {
      console.log("Saving email account details:", formData);
      setSavedEmailData(formData);
      setIsEmailEditing(false);
      setShowPassword(false);
    }
  };

  const handleEditEmailAccount = () => {
    dispatch({ type: 'RESET_FORM', payload: savedEmailData });
    setIsEmailEditing(true);
  };

  const commonTextFieldProps = {
    fullWidth: true,
    variant: "outlined",
    size: "small", // Make text fields smaller
    sx: {
      '.MuiInputBase-input': { height: '24px', padding: '10px 14px' },
      '.MuiInputLabel-root': { transform: 'translate(14px, 10px) scale(1)' },
      '.MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.75)' },
    },
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" component="h2" className="font-bold text-gray-800">
          Default Email Account
        </Typography>
        {isEmailEditing ? (
          <Button
            variant="contained"
            onClick={handleSaveEmailAccount}
            sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditEmailAccount}
            sx={{ color: '#2563EB', borderColor: '#2563EB', '&:hover': { borderColor: '#1D4ED8', color: '#1D4ED8' } }}
          >
            Edit
          </Button>
        )}
      </div>

      <Box className="space-y-4">
        {/* Name Field */}
        <div className="flex items-center gap-4">
          <Typography component="label" htmlFor="email-name" className="text-sm font-medium text-gray-600 w-32 flex-shrink-0">
            Name <span className="text-red-600">*</span>
          </Typography>
          {isEmailEditing ? (
            <TextField
              id="email-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              inputProps={{ maxLength: 25 }}
              error={!!errors.name}
              helperText={errors.name || `Characters: ${formData.name.length}/25`}
              {...commonTextFieldProps}
            />
          ) : (
            <Typography className="text-base font-medium text-gray-800 py-2">
              {savedEmailData.name || '-'}
            </Typography>
          )}
        </div>

        {/* Email Address Field */}
        <div className="flex items-center gap-4">
          <Typography component="label" htmlFor="email-address" className="block text-sm font-medium text-gray-600 w-32 flex-shrink-0">
            Email Address <span className="text-red-600">*</span>
          </Typography>
          {isEmailEditing ? (
            <TextField
              id="email-address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              inputProps={{ maxLength: 50 }}
              error={!!errors.email}
              helperText={errors.email || `Characters: ${formData.email.length}/50`}
              {...commonTextFieldProps}
            />
          ) : (
            <Typography className="text-base font-medium text-gray-800 py-2">
              {savedEmailData.email || '-'}
            </Typography>
          )}
        </div>

        {/* App Password Field */}
        <div className="flex items-center gap-4 relative">
          <Typography component="label" htmlFor="app-password" className="block text-sm font-medium text-gray-600 w-32 flex-shrink-0">
            App Password <span className="text-red-600">*</span>
          </Typography>
          {isEmailEditing ? (
            <>
              <TextField
                id="app-password"
                type={showPassword ? "text" : "password"}
                name="appPassword"
                value={formData.appPassword}
                onChange={handleChange}
                placeholder="Enter app password"
                inputProps={{ maxLength: 75 }}
                error={!!errors.appPassword}
                helperText={errors.appPassword || `Characters: ${formData.appPassword.length}/75 (lowercase letters (a–z) only, no symbols)`}
                {...commonTextFieldProps}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 hover:text-gray-700"
                sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}
              >
                {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </IconButton>
            </>
          ) : (
            <Typography className="text-base font-medium text-gray-800 py-2">
              {savedEmailData.appPassword ? '********' : '-'}
            </Typography>
          )}
        </div>
      </Box>
    </>
  );
};

// --- Sub-component: Enabled Modules Section ---
// const EnabledModulesSection = () => {
//   const [modules, setModules] = useState([
//     {
//       name: "Leads",
//       description: "Manage potential customers before they convert into contacts or deals.",
//     },
//     {
//       name: "Contacts",
//       description: "Store individual contact details of clients, suppliers, or partners.",
//     },
//     {
//       name: "Deals",
//       description: "Track ongoing sales activities and their progress toward closure.",
//     },
//     {
//       name: "Support",
//       description: "Record and resolve customer issues using a structured ticketing system.",
//     },
//   ]);

//   const [openAddModuleDialog, setOpenAddModuleDialog] = useState(false);
//   const [newModuleName, setNewModuleName] = useState('');
//   const [newModuleDescription, setNewModuleDescription] = useState('');
//   const [moduleNameError, setModuleNameError] = useState(false);
//   const [moduleDescriptionError, setModuleDescriptionError] = useState(false);

//   const handleOpenAddModuleDialog = () => {
//     setNewModuleName('');
//     setNewModuleDescription('');
//     setModuleNameError(false);
//     setModuleDescriptionError(false);
//     setOpenAddModuleDialog(true);
//   };

//   const handleCloseAddModuleDialog = () => {
//     setOpenAddModuleDialog(false);
//   };

//   const handleAddModule = () => {
//     let hasError = false;

//     if (newModuleName.trim() === '' || newModuleName.length > 25) {
//       setModuleNameError(true);
//       hasError = true;
//     } else {
//       setModuleNameError(false);
//     }

//     const wordCount = newModuleDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
//     if (wordCount > 100) {
//       setModuleDescriptionError(true);
//       hasError = true;
//     } else {
//       setModuleDescriptionError(false);
//     }

//     if (hasError) {
//       return;
//     }

//     setModules(prevModules => [
//       ...prevModules,
//       { name: newModuleName.trim(), description: newModuleDescription.trim() }
//     ]);
//     handleCloseAddModuleDialog();
//   };

//   return (
//     <>
//       <Typography variant="h5" component="h2" className="font-bold text-gray-800 mb-6">
//         Enabled Modules
//       </Typography>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
//         {modules.map((module, index) => (
//           <div
//             key={index}
//             className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
//           >
//             <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-md">
//               ✓
//             </div>
//             <div>
//               <Typography variant="subtitle1" className="font-semibold text-gray-800">
//                 {module.name}
//               </Typography>
//               <Typography variant="body2" className="text-gray-600 mt-1">
//                 {module.description}
//               </Typography>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add New Module Dialog */}
//       <Dialog open={openAddModuleDialog} onClose={handleCloseAddModuleDialog} fullWidth maxWidth="sm">
//         <DialogTitle className="text-2xl font-bold text-center text-gray-1000 border-b pb-4">
//           Add New Module
//         </DialogTitle>
//         <DialogContent dividers>
//           <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
//             <TextField
//               autoFocus
//               margin="dense"
//               id="module-name"
//               label={<span>Module Name <span className="text-red-500">*</span></span>}
//               type="text"
//               fullWidth
//               variant="outlined"
//               value={newModuleName}
//               onChange={(e) => setNewModuleName(e.target.value)}
//               inputProps={{ maxLength: 25 }}
//               error={moduleNameError}
//               helperText={moduleNameError ? "Module Name is mandatory and must be 25 characters or less." : `Characters: ${newModuleName.length}/25`}
//             />
//             <TextField
//               margin="dense"
//               id="module-description"
//               label="Description"
//               type="text"
//               fullWidth
//               multiline
//               rows={4}
//               variant="outlined"
//               value={newModuleDescription}
//               onChange={(e) => setNewModuleDescription(e.target.value)}
//               error={moduleDescriptionError}
//               helperText={
//                 moduleDescriptionError
//                   ? `Description must be 100 words or less. Current: ${newModuleDescription.trim().split(/\s+/).filter(word => word.length > 0).length} words.`
//                   : `Words: ${newModuleDescription.trim().split(/\s+/).filter(word => word.length > 0).length}/100`
//               }
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={handleCloseAddModuleDialog} color="primary" variant="outlined">
//             Cancel
//           </Button>
//           <Button onClick={handleAddModule} color="primary" variant="contained" sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}>
//             Add Module
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// --- Main Component: GeneralSettingsTab ---
const GeneralSettingsTab = ({
  company,
  openCompanyStatusDialog,
  handleCloseCompanyStatusDialog,
  handleToggleCompanyStatus,
}) => {
  // State for General Settings fields (currency and status)
  const [generalSettingsFormData, setGeneralSettingsFormData] = useState({
    currency: 'INR', // Default value
    status: 'active', // Default value
  });

  const handleGeneralSettingsChange = useCallback((e) => {
    const { name, value } = e.target;
    setGeneralSettingsFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }, []);
  const companySettings = company?.companySettings;
  console.log('The company details are:', companySettings);
  
  return (
    <Box className="space-y-8">
      <GeneralSettingsSection
        formData={generalSettingsFormData}
        handleChange={handleGeneralSettingsChange}
        settings = {companySettings}
      />
      <Divider sx={{ my: 4 }} />
      <DefaultEmailAccountSection />
      <Divider sx={{ my: 4 }} />
      {/* <EnabledModulesSection /> */}

      {/* Company Status Confirmation Dialog (can be a separate component if more complex) */}
      <Dialog open={openCompanyStatusDialog} onClose={handleCloseCompanyStatusDialog}>
        <DialogTitle className="text-xl font-bold text-gray-900">
          Confirm Company {company?.bactive ? "Deactivation" : "Activation"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to {company?.bactive ? "deactivate" : "activate"} the company: <span className="font-semibold">{company?.cCompany_name}</span>?
          </Typography>
          <Typography className="mt-2 text-sm text-gray-600">
            This action will set the company's status to "{company?.bactive ? "Inactive" : "Active"}".
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseCompanyStatusDialog} color="primary" variant="outlined">
            No
          </Button>
          <Button
            onClick={handleToggleCompanyStatus}
            color={company?.bactive ? "error" : "success"}
            variant="contained"
            sx={{
              bgcolor: company?.bactive ? 'red.600' : 'green.600',
              '&:hover': { bgcolor: company?.bactive ? 'red.700' : 'green.700' },
              color: 'white',
            }}
          >
            Yes, {company?.bactive ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GeneralSettingsTab;