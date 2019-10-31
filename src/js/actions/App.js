export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_START = 'FETCH_START';
export const SET_COMPONENT = 'SET_COMPONENT';


export const fetchError = (error) => ({type: FETCH_ERROR, payload: {error: error}});
export const fetchSuccess = () => ({type: FETCH_SUCCESS});
export const fetchStart = () => ({type: FETCH_START});
export const setComponent = (compId) => ({type: SET_COMPONENT, payload: compId});
