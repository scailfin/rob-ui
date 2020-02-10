/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { getFile, fetchApiResource, postRequest } from './Requests';
import { fetchRuns } from './RunListing';


export const CREATE_SUBMISSIONS_SUCCESS = 'CREATE_SUBMISSIONS_SUCCESS';
export const FETCH_SUBMISSIONS_START = 'FETCH_SUBMISSIONS_START';
export const FETCH_SUBMISSIONS_SUCCESS = 'FETCH_SUBMISSIONS_SUCCESS';
export const SHOW_SUBMISSION = 'SHOW_SUBMISSION';
export const SUBMISSIONS_ERROR = 'FETCH_SUBMISSIONS_ERROR';
export const UPDATE_SUBMISSION = 'UPDATE_SUBMISSION';


// -- Errors ------------------------------------------------------------------

export const criticalError = (error) => ({
    type: SUBMISSIONS_ERROR, payload: {error: error, isCritical: true}
})

export const minorError = (error) => ({
    type: SUBMISSIONS_ERROR, payload: {error: error, isCritical: false}
})

export const dismissError = () => ({type: SUBMISSIONS_ERROR, payload: null})


// -- Fetch submission listing ------------------------------------------------

export function fetchSubmissions(api, benchmark) {
    return fetchApiResource(
        api.urls.listSubmissions(benchmark.id),
        (json) => ({type: FETCH_SUBMISSIONS_SUCCESS, payload: json}),
        criticalError,
        () => ({type: FETCH_SUBMISSIONS_START})
    );
}


// -- Fetch submission handle -------------------------------------------------

export function fetchSubmission(api, submission) {
    return fetchApiResource(
        api.urls.getSubmission(submission.id),
        (json) => (showSubmission(api, json)),
        criticalError
    );
}

export const  showSubmission = (api, submission) => {
    return dispatch => {
        dispatch({type: SHOW_SUBMISSION, payload: submission});
        return dispatch(fetchRuns(api, submission));
    }
}


// -- Create new submission ---------------------------------------------------

export function createSubmission(api, benchmark, name) {
    return postRequest(
        api.urls.createSubmission(benchmark.id),
        {name},
        (json) => {return dispatch => {
            dispatch(fetchSubmissions(api, benchmark));
            return dispatch(showSubmission(api, json))
        }},
        minorError,
        () => (selectDialog(-1))
    )
}



export function downloadResource(url, submission, resourceId) {
    if (submission.contentId === resourceId) {
        return {
            type: UPDATE_SUBMISSION,
            payload: {
                ...submission,
                displayContent: null,
                contentId: null
            }
        }
    }
    return getFile(
        url,
        (content) => (
            fetchResourceSuccess(submission, resourceId, content)
        )
    );
}


function fetchResourceSuccess(submission, resourceId, content) {
    return {
        type: UPDATE_SUBMISSION,
        payload: {
            ...submission,
            displayContent: content,
            contentId: resourceId
        }
    }
}


/**
 * Upload a file for a given submission.
 */
export function uploadFile(url, submission, file) {
    const body = new FormData();
    body.append('file', file);
    return dispatch => (
        dispatch(
            postRequest(
                url,
                body,
                ((response) => (uploadFileSuccess(submission, response)))
            )
        )
    );
}


function uploadFileSuccess(submission, response) {
    return {
        type: UPDATE_SUBMISSION,
        payload: {
            ...submission,
            files: submission.files.concat([response]),
            contentId: null
        }
    }
}
