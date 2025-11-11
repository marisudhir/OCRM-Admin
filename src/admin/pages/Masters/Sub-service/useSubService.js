import { useReducer, useCallback } from 'react';
import * as subServiceModel from './subServiceModel';

//initialstate (instead of using useState using useReducer hook for handling all related states together)
const initialState = {
  subService: [],
  loading: false,
  error: null
}

//reducer funtion 
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, subService: action.payload, error: null };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, subService: action.payload, error: null };
    case 'ADD_SUCCESS':
      return { ...state, subService: [action.payload, ...state.subService] };
    case 'RESET_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

//fuction for fetching sub-service 
export const useSubService = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const fetchLeadSubService = useCallback(async (companyId) => {
    if (!companyId && companyId !== 0) return; //guard
    dispatch({ type: 'FETCH_START' });
    try {
      console.log("Fetched the sub-service API.")
      const data = await subServiceModel.getAllLeadSubService(companyId);
      //ensure it's always array 
      dispatch({ type: 'FETCH_SUCCESS', payload: Array.isArray(data.data) ? data.data : [] })
    } catch (e) {
      dispatch({ type: 'FETCH_FAILURE', payload: e?.message || e || 'Failed to fetch' })
    }
  }, []);
  //create sub service using useCallback hook for prevent the fuction from unwanted re-renderring
  const createLeadSubService = useCallback(async (formData) => {
    try {
      const created = await subServiceModel.addNewLeadSubService(formData);
      //if API returns created object, append it; otherwise, you can refetch 
      if (created) dispatch({ type: 'ADD_SUCCESS', payload: created });
      return true;
    } catch (e) {
      dispatch({ type: 'FETCH_FAILURE', payload: e?.message || 'Could not create' });
      return false;
    }
  }, [])

  //setting error 
  const resetError = useCallback(() => dispatch({ type: 'RESET_ERROR' }), []);
  console.log("The component render. ")
  return {
    ...state,
    fetchLeadSubService, //stable function 
    createLeadSubService, //stable function 
    resetError
  }
}

