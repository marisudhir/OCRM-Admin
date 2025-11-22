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
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import EditIcon from '@mui/icons-material/Edit';

import ToggleButton from '../../components/ToggleSwitch'
import Collapsible from '../../components/Collipsable'
import { useCompanyController  } from './companyController';

// Import your API functions
import * as companyModel from './companyModel';

// --- Constants & Utilities ---
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APP_PASSWORD_REGEX = /^[a-z]*$/;

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
const GeneralSettingsSection = ({ formData, handleChange, settings, company }) => {
  const [localSettings, setLocalSettings] = useState(settings || {});

  const ToggleSection = ({ label, status, name, companyId, sub_name }) => {
    const { changeSettingsStatus } = useCompanyController();

    const handleToggleChange = (name, status, data) => {
      setLocalSettings((prev) => {
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
      {/* Account Status Dropdown - Corrected Version */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <Box>
          <Typography variant="subtitle1" className="font-semibold text-gray-800">
            Account Status
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Define the current state of the company account.
          </Typography>
        </Box>
        <FormControl
          variant="outlined"
          sx={{ minWidth: 120, mt: { xs: 2, sm: 0 } }}
        >
          <Select
            name="status"
            value={formData.status || (company?.bactive ? "active" : "inactive")}
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

      <div>
        <ToggleSection
          label="DCRM"
          status={localSettings.DCRM}
          name="DCRM"
          companyId={company?.iCompany_id}
        />
        
        {/* Collapsible Reports */}
        <Collapsible title="Report" className="mt-5">
          <ToggleSection
            label="Lead lost"
            status={localSettings?.Reports?.LostLeadReport}
            name="LostLeadReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Sales by stage"
            status={localSettings.Reports?.SalesStageReport}
            name="SalesStageReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Lead by territory"
            status={localSettings.Reports?.TerritoryLeadReport}
            name="TerritoryLeadReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Lead conversion"
            status={localSettings.Reports?.LeadConversionReport}
            name="LeadConversionReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Lead owner activity"
            status={localSettings.Reports?.LeadOwnerActivityReport}
            name="LeadOwnerActivityReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Prospects lost lead"
            status={localSettings.Reports?.ProspectsLostLeadsReport}
            name="ProspectsLostLeadsReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="First response time opportunity"
            status={localSettings.Reports?.FirstResponseTimeOppurtunityReport}
            name="FirstResponseTimeOppurtunityReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Company Overall report"
            status={localSettings.Reports?.CompanyOverallReport}
            name="CompanyOverallReport"
            sub_name="Reports"
            companyId={company?.iCompany_id}
          />
        </Collapsible>

        {/* Collapsible Masters */}
        <Collapsible title="Master" className="mt-5">
          <ToggleSection
            label="Status master"
            status={localSettings.Masters?.StatusMaster}
            name="StatusMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Currency master"
            status={localSettings.Masters?.CurrencyMaster}
            name="CurrencyMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Potential master"
            status={localSettings.Masters?.PotentialMaster}
            name="PotentialMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Industry master"
            status={localSettings.Masters?.IndustryMaster}
            name="IndustryMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Lead source master"
            status={localSettings.Masters?.SourceMaster}
            name="SourceMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Service master"
            status={localSettings.Masters?.ServiceMaster}
            name="ServiceMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Proposal send mode master"
            status={localSettings.Masters?.ProposalModeMaster}
            name="ProposalModeMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Email template master"
            status={localSettings.Masters?.EmailTemplateMaster}
            name="EmailTemplateMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
          />
          <ToggleSection
            label="Lead Lost reason"
            status={localSettings.Masters?.LeasLostReasonMaster}
            name="LeasLostReasonMaster"
            sub_name="Masters"
            companyId={company?.iCompany_id}
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
    size: "small",
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

// --- Main Component: GeneralSettingsTab ---
const GeneralSettingsTab = ({
  company,
  openCompanyStatusDialog,
  handleCloseCompanyStatusDialog,
  handleToggleCompanyStatus,
}) => {
  // State for General Settings fields
  const [generalSettingsFormData, setGeneralSettingsFormData] = useState({
    status: company?.bactive ? "active" : "inactive",
  });

  const handleGeneralSettingsChange = useCallback(async (e) => {
    const { name, value } = e.target;
    
    // Update local state immediately for better UX
    setGeneralSettingsFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    // Update company status via API when dropdown changes
    if (name === 'status' && company?.iCompany_id) {
      try {
        // CORRECTED: Proper mapping between dropdown values and bactive
        let bactive;
        if (value === "active") {
          bactive = true;
        } else if (value === "inactive") {
          bactive = false;
        } else if (value === "trial") {
          // For trial, you can decide what to set - here I'm setting it to active
          bactive = true;
        }

        console.log(`Updating company ${company.iCompany_id} status:`, {
          dropdownValue: value,
          bactive: bactive
        });
        
        // Prepare data for API call
        const updateData = {
          bactive: bactive,
          cCompany_name: company.cCompany_name,
          // Include other required fields for your API
        };

        // Call API to update company status
        const response = await companyModel.editCompany(updateData, company.iCompany_id);
        console.log('✅ Company status updated successfully:', response);
        
        // Optional: Show success message or refresh data
        // You can add a toast notification here
        
      } catch (error) {
        console.error('❌ Failed to update company status:', error);
        
        // Revert the local state if API call fails
        setGeneralSettingsFormData(prevData => ({
          ...prevData,
          [name]: company?.bactive ? "active" : "inactive"
        }));
        
        // Optional: Show error message to user
        // alert('Failed to update company status. Please try again.');
      }
    }
  }, [company]);

  const companySettings = company?.companySettings;
  
  return (
    <Box className="space-y-8">
      <GeneralSettingsSection
        formData={generalSettingsFormData}
        handleChange={handleGeneralSettingsChange}
        settings={companySettings}
        company={company}
      />
      <Divider sx={{ my: 4 }} />
      <DefaultEmailAccountSection />
      <Divider sx={{ my: 4 }} />

      {/* Company Status Confirmation Dialog (if still needed for other actions) */}
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