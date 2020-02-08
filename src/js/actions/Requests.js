/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

export function getFile(url, successHandler, errorHandler) {
    const accessToken = localStorage.getItem('accessToken');
    return dispatch => {
        // Set API key in header
        const headers = new Headers();
        headers.append('api_key', accessToken);
        return fetch(url, {headers: headers})
            .then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(errorHandler(json.message));
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
            .catch(error => dispatch(errorHandler(error.message)));
    };
}


/**
 * Generic function to send asyncronous get requests. This function takes
 * care of the error handling and the setting of the progress indicator. The
 * caller has to provide a function that is called with the response body that
 * is received by a successful request. The error handler is called in case of
 * an error.
 * If the optional signal function is given it is dispatched at the start of
 * the request.
 *
 * - url: Request Url
 * - successHandler: Function that is being called when a valid (non-error)
 *   response is received. This function is being called with the response body
 *   as the only argument.
 * - errorHandler: Handler that is called in case of an error. The function
 *   will receive the error message as the only argument.
 * - startSignal:Function that is called at the start of the request
 */
export function fetchApiResource(
    url,
    successHandler,
    errorHandler,
    startSignal
) {
    const accessToken = localStorage.getItem('accessToken');
    return dispatch => {
        if (startSignal != null) {
            dispatch(startSignal());
        }
        // Set API key in header
        const headers = new Headers();
        headers.append('Accept', 'application/json')
        headers.append('api_key', accessToken);
        return fetch(url, {headers: headers})
            .then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(errorHandler(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(successHandler(json));
                    })
                }
            })
            .catch(error => dispatch(errorHandler(error.message)));
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
export function postRequest(
    url,
    data,
    successHandler,
    errorHandler,
    startSignal,
    method
) {
    // Ensure that the method os set
    if (method == null) {
        method = 'POST';
    }
    return dispatch => {
        const accessToken = localStorage.getItem('accessToken');
        if (startSignal != null) {
            dispatch(startSignal());
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
                        dispatch(errorHandler(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(successHandler(json));
                    })
                }
            })
            .catch(error => dispatch(errorHandler(error.message)));
    };
}
