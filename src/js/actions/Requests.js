import {fetchStart, fetchSuccess, fetchError} from './App';


export function getFile(url, successHandler) {
    const accessToken = localStorage.getItem('accessToken');
    return dispatch => {
        // Set API key in header
        const headers = new Headers();
        headers.append('api_key', accessToken);
        return fetch(url, {headers: headers})
            .then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(fetchError(json.message));
                    });
                } else {
                    response.blob().then(blob => {
                        // Based on https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
                        // Create a new FileReader innstance
                        const reader = new FileReader();
                        // Add a listener to handle successful reading of the blob
                        reader.addEventListener('load', () => {
                            dispatch(successHandler(reader.result));
                        });

                        // Start reading the content of the blob
                        // The result should be a base64 data URL
                        reader.readAsText(blob);
                    })
                }
            })
            .catch(error => dispatch(fetchError(error.message)));
    };
}


/**
 * Generic function to send asyncronous get requests. This function takes
 * care of the error handling and the setting of the progress indicator. The
 * caller has to provide a function that is called with the response body that
 * is received by a successful request. If the optional sendSignals flag is true
 * the global fetchStart() and fetchSuccess() functions are used to signal the
 * start and the end of fetching. The function takes the following parameters:
 *
 * - url: Request Url
 * - successHandler: Function that is being called when a valid (non-error)
 *   response is received. This function is being called with the response body
 *   as the only argument.
 * - sendSignals: bool, optional
 *   Send start and success signals if true. If the value is missing it is
 *   assumed to be true.
 */
export function getUrl(
    url,
    successHandler,
    sendSignals
) {
    const accessToken = localStorage.getItem('accessToken');
    return dispatch => {
        if (sendSignals !== false) {
            dispatch(fetchStart());
        }
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
                        if (sendSignals !== false) {
                            dispatch(fetchSuccess());
                        }
                        dispatch(successHandler(json));
                    })
                }
            })
            .catch(error => dispatch(fetchError(error.message)));
    };
}


/**
 * Generic function to send asyncronous post/put requests. This function takes
 * care of the error handling and the setting of the progress indicator. The
 * caller has to provide a function that is called with the response body that
 * is received by a successful request. The function takes the following
 * parameters:
 *
 * - url: Request Url
 * - data: Request body
 * - successHandler: Function that is being called when a valid (non-error)
 *   response is received. This function is being called with the response body
 *   as the only argument.
 * - method: Method name to distinguish between POST and PUT requests. The
 *   default is POST.
 */
export function postUrl(
    url,
    data,
    successHandler,
    sendSignals,
    method
) {
    // Ensure that the method os set
    if (method == null) {
        method = 'POST';
    }
    return dispatch => {
        const accessToken = localStorage.getItem('accessToken');
        if (sendSignals !== false) {
            dispatch(fetchStart());
        }
        const headers = {
            'api_key': accessToken
        };
        let body = null;
        if (data instanceof FormData) {
            body = data;
        } else {
            body = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
        }
        return fetch(url, {method, headers, body})
            .then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(fetchError(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(successHandler(json));
                        if (sendSignals !== false) {
                            dispatch(fetchSuccess());
                        }
                    })
                }
            })
            .catch(error => dispatch(fetchError(error.message)));
    };
}
