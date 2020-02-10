/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { NO_OP, criticalError } from './App';
import { fetchApiResource, postRequest } from './Requests';

const UPDATE_SUBMISSION = 'UPDATE_SUBMISSION'
const SHOW_SUBMISSION = 'SHOW_SUBMISSION'


export function cancelRun(url, submission) {
    return postRequest(
        url,
        {reason: 'Canceled at user request'},
        (json) => (successFetchRun(submission, json, UPDATE_SUBMISSION)),
        false,
        'PUT'
    );
}


export function getRun(url, submission) {
    return fetchApiResource(url, (json) => (successFetchRun(submission, json, UPDATE_SUBMISSION)), criticalError);
}


export function submitRun(url, data, submission) {
    return postRequest(
        url,
        data,
        (json) => (successFetchRun(submission, json, SHOW_SUBMISSION)),
        false
    );
}


function successFetchRun(submission, run, actionType) {
    const updatedRuns = [];
    let runFound = false;
    for (let i = 0; i < submission.runs.length; i++) {
        const r = submission.runs[i];
        if (r.id === run.id) {
            // If the run state has not changed there is no need to update
            // the application state. Instead, we return an 'no operation'.
            if (r.state === run.state) {
                return {
                    type: NO_OP
                }
            }
            updatedRuns.push(run);
            runFound = true;
        } else {
            updatedRuns.push(r);
        }
    }
    if (!runFound) {
        updatedRuns.push(run);
    }
    return {
        type: actionType,
        payload: {...submission, runs: updatedRuns}
    }
}
