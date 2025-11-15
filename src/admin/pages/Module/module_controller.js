import { useState, useEffect } from "react";
import * as moduleModel from "../Module/module_mode";

export function moduleController() {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(null);

  async function fetchModules() {
    try {
      setLoading(true);
      const data = await moduleModel.getALlModules();
      setModules(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addNewModule(requestData) {
    try {
      await moduleModel.addNewModule(requestData);
      await fetchModules();
    } catch (e) {
      setError(e.message);
    }
  }

  async function updateModule(requestData) {
    try {
      const { id, ...body } = requestData;
      await moduleModel.editModule(id, body);
      await fetchModules();
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    fetchModules();
  }, []);

  return {
    modules,
    error,
    loading,
    addNewModule,
    updateModule,
    fetchModules
  };
}


// import { useEffect, useState } from "react";
// import * as moduleModel from "../Module/module_mode"
// //MODULE CONTROLLER 
// export function moduleController() {
//      //VARIABLES 
//         const [modules, setModules] = useState([])
//         const [error, setError] = useState(false);
//         const [loading, setLoading] = useState(null)
//     //FUNCTION TO GET ALL MODULES 
//     async function getAllModulesController() {
//     try {
//         setLoading(true);
//          //CALLING MODEL 
//         const data = await moduleModel.getALlModules();
//         setModules(data);
//     } catch (e) {
//         setError(e.message)
//     }finally{
//         setLoading(false )
//     }
//     } 
//     //FUNCTION TO ADD NEW MODULE 
//     async function addNewModule(requestData) {
//         try {
//         //CALLING MODEL FUNCTION
//         await moduleModel.addNewModule(requestData);
//         getAllModulesController();
//         } catch (e) {
//         setError(e.message)
//         }
//     }
//      //FUNCTION TO UPDATE  MODULE 
//     async function updateModule(requestData) {
//         try {
//         const {id,...requestBody}=requestData;
//         //CALLING MODEL FUNCTION
//         await moduleModel.editModule(id,requestBody);
//         getAllModulesController();
//         } catch (e) {
//         setError(e.message)
//         }
//     }
//     //FUNCTION TO UPDATE  MODULE 
//     async function changeModuleStatus(requestData) {
//         try {
//         const {id,...requestBody}=requestData;
//         //CALLING MODEL FUNCTION
//         await moduleModel.changeModuleStatus(id,requestBody);
//         getAllModulesController();
//         } catch (e) {
//         setError(e.message)
//         }
//     }
//     //CALLING THE getAllModules()
//     useEffect(()=>{
//     getAllModulesController();
//     },[]);

//     return{
//         modules,
//         error,
//         loading,
//         addNewModule,
//         updateModule,
//         changeModuleStatus
//     }
// }

