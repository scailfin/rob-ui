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


export const CREATE_SUBMISSION_SUCCESS = 'CREATE_SUBMISSIONS_SUCCESS';
export const FETCH_SUBMISSION_ERROR = 'FETCH_SUBMISSION_ERROR';
export const FETCH_SUBMISSION_SUCCESS = 'FETCH_SUBMISSIONS_SUCCESS';
export const FETCH_SUBMISSION_START = 'FETCH_SUBMISSION_START';

const UPDATE_SUBMISSION = 'UPDATE_SUBMISSION'


// -- Errors ------------------------------------------------------------------

export const criticalError = (error) => ({
    type: FETCH_SUBMISSION_ERROR, payload: {error: error, isCritical: true}
})

export const minorError = (error) => ({
    type: FETCH_SUBMISSION_ERROR, payload: {error: error, isCritical: false}
})

export const dismissError = () => ({type: FETCH_SUBMISSION_ERROR, payload: null})


// -- Fetch submission handle -------------------------------------------------

export function fetchSubmission(api, submission) {
    return fetchApiResource(
        api.urls.getSubmission(submission.id),
        (json) => ({type: FETCH_SUBMISSION_SUCCESS, payload: json}),
        criticalError,
        fetchSubmissionStart
    );
}


export const fetchSubmissionStart = () => ({type: FETCH_SUBMISSION_START})


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
