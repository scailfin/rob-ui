/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { fetchApiResource, postRequest } from './Requests';


/******************************************************************************
 * Action types
 *****************************************************************************/


// -- Fetch submission --------------------------------------------------------

export const FETCH_SUBMISSION_ERROR = 'FETCH_SUBMISSION_ERROR';
export const FETCH_SUBMISSION_SUCCESS = 'FETCH_SUBMISSIONS_SUCCESS';
export const FETCH_SUBMISSION_START = 'FETCH_SUBMISSION_START';


// -- Submission files --------------------------------------------------------

export const FETCH_UPLOADFILES_ERROR = 'FETCH_UPLOADFILES_ERROR';
export const FETCH_UPLOADFILES_START = 'FETCH_UPLOADFILES_START';
export const FETCH_UPLOADFILES_SUCCESS = 'FETCH_UPLOADFILES_SUCCESS';


/******************************************************************************
 * Actions
 *****************************************************************************/


// -- Errors ------------------------------------------------------------------

export const fetchSubmissionError = (error) => ({
    type: FETCH_SUBMISSION_ERROR, payload: error
})

const fetchFilesError = (msg) => ({type: FETCH_UPLOADFILES_ERROR, payload: msg});
export const dismissFilesError = () => ({
    type: FETCH_UPLOADFILES_ERROR, payload: null
})


// -- Fetch ubmission handle --------------------------------------------------

export function fetchSubmission(api, submission) {
    return fetchApiResource(
        api.urls.getSubmission(submission.id),
        (json) => ({type: FETCH_SUBMISSION_SUCCESS, payload: json}),
        fetchSubmissionError,
        () => ({type: FETCH_SUBMISSION_START})
    );
}


// -- Submission files --------------------------------------------------------

/*
 * Fetch update file list for a given submission.
 */
function fetchSubmissionFiles(api, submission) {
    return fetchApiResource(
        api.urls.getSubmissionFiles(submission.id),
        (json) => ({type: FETCH_UPLOADFILES_SUCCESS, payload: json}),
        fetchFilesError
    );
}


/**
 * Upload a file for a given submission.
 */
 export function uploadFiles(api, submission, files) {
     const url = api.urls.uploadSubmissionFile(submission.id);
     for (let i = 0; i < files.length; i++) {
         const body = new FormData();
         body.append('file', files[i]);
         return dispatch => (
             dispatch(
                 postRequest(
                     url,
                     body,
                     () => (fetchSubmissionFiles(api, submission)),
                     fetchFilesError,
                     () => ({type: FETCH_UPLOADFILES_START})
                 )
             )
         )
     }
}
