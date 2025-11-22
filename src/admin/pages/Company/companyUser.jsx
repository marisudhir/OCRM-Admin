import React, { useState, useEffect, useCallback, use } from "react";
import { useParams } from "react-router-dom";
import { useCompanyController } from "./companyController";
import * as companyModel from "./companyModel";
import { User, Lock, CreditCard, Users, ArrowLeft } from "lucide-react";
import ToggleSwitch from "../../components/ToggleSwitch";
import {useToast}  from "../../../context/ToastContext";
import AllowedAccess from "../../../Components/userAttribute/AllowedAttributes";

const CompanyUser = ({ user, companyId, setShowProfile }) => {
  const targetUserId = user.iUser_id ? parseInt(user?.iUser_id) : null;
  const [activeSection, setActiveSection] = useState("General Info");

  const {
    attributes,
    userAttributes,
    loading,
    error,
    fetchAttributes,
    fetchUserAttributes,
        changeUserSettingsStatus // Add this from controller

  } = useCompanyController();

  const [stagedAttributes, setStagedAttributes] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const { showToast } = useToast();

  // Initialize staged attributes when data loads
useEffect(() => {
  if (!loading && attributes.length > 0) {
    const initialStaged = {};
    
    // Step 1: Create entries for ALL available attributes
    attributes.forEach((attr) => {
      initialStaged[attr.iattribute_id] = false; // Default to unchecked
    });
    
    // Step 2: For attributes user already has, set to their current status
    if (userAttributes && userAttributes.length > 0) {
      userAttributes.forEach((userAttr) => {
        if (userAttr.iattribute_id in initialStaged) {
          // Set to true only if user actually has access (bactive: true)
          initialStaged[userAttr.iattribute_id] = userAttr.bactive === true;
        }
      });
    }
    
    console.log('🎯 INITIAL STATE: All attributes with user access status');
    console.log('Available attributes:', attributes.length);
    console.log('User attributes:', userAttributes.length);
    console.log('Final staged state:', initialStaged);
    
    setStagedAttributes(initialStaged);
    setHasPendingChanges(false);
  }
}, [attributes, userAttributes, loading]);

  // Fetch data when component mounts or user changes
  useEffect(() => {
    if (targetUserId) {
      console.log('Fetching data for user:', targetUserId);
      fetchAttributes();
      fetchUserAttributes(targetUserId);
    }
  }, [targetUserId]);

  const handleCheckboxChange = (attrId, checked) => {
    setStagedAttributes((prev) => ({
      ...prev,
      [attrId]: checked,
    }));
    setHasPendingChanges(true);
  };

  const handleSave = async () => {
    if (!targetUserId || isSaving || !hasPendingChanges) return;

    setIsSaving(true);
    try {
      await companyModel.applyUserAttributeChanges(
        targetUserId,
        stagedAttributes,
        userAttributes
      );

      // Refresh the user attributes after saving
      await fetchUserAttributes(targetUserId);
      
      // Show success message
      showToast("success", "Attribute access updated successfully! 🎉");
      setHasPendingChanges(false);
      
    } catch (err) {
      console.error("Failed to save attribute changes:", err);
      showToast("error", "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if we're ready to render
  const isReady = !loading && targetUserId && attributes.length > 0;
  return (
    <div className="p-6 h-full w-ful bg-white overflow-y-auto">
      <div className="flex justify-start items-center mb-4 space-x-4">
        <button
          onClick={() => setShowProfile(false)} // Go back to user list
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-xl font-bold">User profile</h2>
      </div>

      {!targetUserId && (
        <p className="text-red-700 font-bold">
          Error: No User ID provided in the URL.
        </p>
      )}
      {loading && <p>Loading attributes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {isReady &&
        !error &&
        attributes.length > 0 &&
        userAttributes?.length === 0 && (
          <div
            className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg"
            role="alert"
          >
            ⚠️ This user currently has **no attributes assigned**. Check the
            boxes below to grant access.
          </div>
        )}

      {/* New component code */}
      <div className=" bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-md p-6 flex flex-col justify-between">
          <div>
            {/* Navigation */}
            <nav className="space-y-4">
              <SidebarItem
                icon={<User />}
                text="General Info"
                active={activeSection === "General Info"}
                onClick={() => setActiveSection("General Info")}
              />
              <AllowedAccess 
  userId={targetUserId}        // User ID from your user object
  userName={user.cFull_name}   // User name for display
  companyId={companyId}        // Company ID from your company object
/>
              <SidebarItem
                icon={<Lock />}
                text="Allowed Attributes"
                active={activeSection === "Allowed Attributes"}
                onClick={() => setActiveSection("Allowed Attributes")}
              />
              
              {/* <SidebarItem
                icon={<CreditCard />}
                text="User Settings"
                active={activeSection === "User Settings"}
                onClick={() => setActiveSection("User Settings")}
              /> */}
            </nav>
          </div>
        </aside>

        {/* User personal info card */}

        {activeSection === "General Info" && (
          <>
            <main className="flex-1 p-10">
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
                {/* Profile Picture */}
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
                  />
                  <div className="flex gap-3">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                      Upload New Picture
                    </button>
                    <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                      <span>{user.bactive ? "Deactivate" : "Activate"}</span>
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <form className="grid grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={user.cFull_name}
                    type="input"
                  />
                  <Input label="Email" value={user.cEmail} type="input" />
                  <Input
                    label="Business Phone Number"
                    value={user.i_bPhone_no}
                    type="number"
                  />
                  <Input
                    label="Personal phone Number"
                    value={user.iphone_no}
                    type="phone"
                  />
                  <Input
                    label="Active status"
                    type="toggle"
                    value={user.bactive ? "Yes" : "No"}
                    readOnly="yes"
                    className={
                      user.bactive
                        ? "w-full border border-green-400 bg-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        : "w-full border bg-red-500 border-red-200  text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                    }
                  />
                  <Input label="Job TItle" value={user.cjob_title} />
                </form>

                <div className="mt-8 text-center">
                  <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                    Update
                  </button>
                </div>
              </div>
            </main>
          </>
        )}

       
     {/* Attribute List Section */}
      {activeSection === "Allowed Attributes" && (
        <div className="flex flex-col flex-1 p-6 space-y-6">
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!hasPendingChanges || isSaving || loading || !targetUserId}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-md ${
                hasPendingChanges && !isSaving
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Info message for new users */}
          {isReady && userAttributes.length === 0 && (
            <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
              ⚠️ This user currently has no attributes assigned. Check the boxes below to grant access.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {isReady &&
              Object.entries(
                attributes.reduce((acc, attr) => {
                  if (!acc[attr.module_table.cmodule_name])
                    acc[attr.module_table.cmodule_name] = [];
                  acc[attr.module_table.cmodule_name].push(attr);
                  return acc;
                }, {})
              ).map(([moduleName, moduleAttributes]) => (
                <div
                  key={moduleName}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4"
                >
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
                    <span className="text-base">Module</span> -{" "}
                    <span className="font-bold text-xl">{moduleName}</span>
                  </h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
  {moduleAttributes.map((attr) => {
    const isChecked = stagedAttributes[attr.iattribute_id] || false;
    const userHasAccess = userAttributes.find(uAttr => uAttr.iattribute_id === attr.iattribute_id);
    
    return (
      <label
        key={attr.iattribute_id}
        className="flex items-center space-x-3 border p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <input
          type="checkbox"
          checked={isChecked}
          disabled={!isReady || isSaving}
          onChange={(e) => {
            console.log(`📝 User ${targetUserId} changed attribute ${attr.iattribute_id} to ${e.target.checked}`);
            handleCheckboxChange(attr.iattribute_id, e.target.checked);
          }}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
        />
        <span className="text-gray-700 font-medium">
          {attr.cattribute_name}
        </span>
        {isChecked && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Access granted
          </span>
        )}
        {userHasAccess && !isChecked && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            Access revoked
          </span>
        )}
      </label>
    );
  })}
</div>
                </div>
              ))}
          </div>
        </div>
      )}
   
        {/* User related settings */}
        {activeSection === "User Settings" && (
          <div className="mt-6 flex-1 p-6 ">
            <div className="mt-6 flex-1 p-6">
              {[
                "isMailActive",
                "isPhoneActive",
                "isWebsiteActive",
                "isWhatsappActive",
              ].map((key) => (
                <ToggleSection
                  key={key}
                  label={key.replace("is", "")} // just for display
                  name={key}
                  value={userSettings[key]}
                  onChange={(name, status) =>
                    setUserSettings((prev) => ({ ...prev, [name]: status }))
                  }
                />
              ))}

              <div className="mt-4">
                <button
                  onClick={() => {
                    const isChanged = changeUserSettingsStatus(
                      JSON.stringify(userSettings)
                    );
                    if (isChanged) {
                      showToast("success", "Settings updated successfully!");
                    }
                    else {
                      showToast("info", "No changes detected.");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function SidebarItem({ icon, text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 cursor-pointer transition px-3 py-2 rounded-lg 
        ${
          active
            ? "text-orange-500 bg-orange-50"
            : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
        }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function Input({
  label,
  value = "",
  type = "text",
  readOnly = "no",
  className = "w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400",
}) {
  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="col-span-1">
      <label className="block text-gray-600 text-sm mb-1">{label}</label>
      <input
        type={type}
        defaultValue={value}
        onChange={handleUserDetailsChange}
        className={className}
        readOnly={readOnly === "yes" ? true : false}
      />
    </div>
  );
}

export default CompanyUser;