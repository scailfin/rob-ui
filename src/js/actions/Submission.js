/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { getFile, getUrl, postUrl } from './Requests';
import { Urls } from '../resources/Urls';


export const CREATE_SUBMISSIONS_SUCCESS = 'CREATE_SUBMISSIONS_SUCCESS';
export const FETCH_SUBMISSIONS_SUCCESS = 'FETCH_SUBMISSIONS_SUCCESS';
export const SELECT_DIALOG = 'SELECT_DIALOG';
export const SELECT_SUBMISSION = 'SELECT_SUBMISSION';
export const UPDATE_SUBMISSION = 'UPDATE_SUBMISSION';


export function createSubmission(url, name) {
    return postUrl(url, {name}, createSubmissionSuccess);
}


function createSubmissionSuccess(response) {
    return {
        type: CREATE_SUBMISSIONS_SUCCESS,
        payload: response
    }
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


export function fetchSubmissions(url) {
    return getUrl(url, fetchSubmissionsSuccess);
}


function fetchSubmissionsSuccess(json) {
    return {
        type: FETCH_SUBMISSIONS_SUCCESS, payload: json
    }
}


export function selectDialog(dialogId) {
    return {type: SELECT_DIALOG, payload: dialogId}
}


/**
 * Set the selected submission that is shown in the main panel. At the beginning
 * when the submission listing is fetched we only receive a list of submission
 * descriptors. These descriptors do not contain information about submission
 * runs, uploaded files and the submission parameters. If a submission is to be
 * shown in the main panel for which we only have the descriptor yet we need to
 * fetch the full submission handle.
 */
export function selectSubmission(submission) {
    // The submission may either be a descriptor or a handle. We assume that
    // it is a descriptor if any of the properties that are only included in
    // the submission handle are missing.
    const { files, parameters, runs } = submission;
    if ((parameters == null) || (runs == null) || (files == null)) {
        const { links } = submission;
        const urls = new Urls(links);
        return dispatch => {
            dispatch({
                type: SELECT_SUBMISSION,
                payload: {...submission, urls: urls, fetching: true}
            })
            return dispatch(getUrl(urls.self(), selectSubmission, false))
        }
    } else {
        // If the response is coming directly from the server we still need to
        // set the urls class.
        const { urls, links } = submission;
        if (urls == null) {
            submission['urls'] = new Urls(links);
        }
        return {
            type: SELECT_SUBMISSION,
            payload: submission
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
            postUrl(
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
