import {fetchStart, fetchSuccess, fetchError} from './App';

export const FETCH_API_SUCCESS = 'FETCH_API_SUCCESS';


export function getUrl(
    url,
    startSignal,
    successSignal,
    successHandler
) {
    const accessToken = localStorage.getItem('accessToken');
    return dispatch => {
        dispatch(startSignal());
        // Set API key in header
        const headers = new Headers();
        headers.append('Accept', 'application/json')
        headers.append('api_key', accessToken);
        return fetch(url, {headers: headers})
            .then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(fetchError(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(successSignal());
                        dispatch(successHandler(json));
                    })
                }
            })
            .catch(error => dispatch(fetchError(error.message)));
    };
}


/**
 * Generic function to send asyncronous post/put requests. This function does
 * the error handling. All other actions are optional. The function takes the
 * following parameters:
 *
 * - url: Request Url
 * - data: Request body
 * - startSignal: Function that is dispatched to signal the beginning of the
 *   request (i.e., prior to calling fetch). This function is called without
 *   any arguments.
 * - successSignal: Function that is being called after the request has
 *   completed successfully. This function is called without any arguments.
 * - successHandler: Function that is being called when a valid (non-error)
 *   response is received. This function is being called with the response body
 *   as the only argument.
 * - accessToken: API key to be included in the request header
 * - method: Method name to distinguish between POST and PUT requests. The
 *   default is POST.
 */
export function postUrl(
    url,
    data,
    startSignal,
    successSignal,
    successHandler,
    method
) {
    // Ensure that the method os set
    if (method == null) {
        method = 'POST';
    }
    return dispatch => {
        const accessToken = localStorage.getItem('accessToken');
        dispatch(startSignal());
        return fetch(
            url, {
                method: method,
                headers: {
                  'Content-Type': 'application/json',
                  'api_key': accessToken
              },
              body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(fetchError(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(successHandler(json));
                        dispatch(successSignal());
                    })
                }
            })
            .catch(error => dispatch(fetchError(error.message)));
    };
}


export function fetchApi() {
    // This should move elsewhere. Note that the trailing '/' is essential!
    const apiUrl = 'http://localhost:5000/rob/api/v1/';
    return getUrl(apiUrl, fetchStart, fetchSuccess, fetchApiSuccess)
}


function fetchApiSuccess(payload) {
    return {
        type: FETCH_API_SUCCESS,
        payload
    }
}
