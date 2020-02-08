/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { fetchApiResource } from './Requests';


export const FETCH_RUNS_ERROR = 'FETCH_RUNS_ERROR';
export const FETCH_RUNS_START = 'FETCH_RUNS_START';
export const FETCH_RUNS_SUCCESS = 'FETCH_RUNS_SUCCESS';


// -- Fetch run listing -------------------------------------------------------

export function fetchRuns(api, submission) {
    return fetchApiResource(
        api.urls.listRuns(submission.id),
        (json) => ({type: FETCH_RUNS_SUCCESS, payload: json}),
        (msg) => ({type: FETCH_RUNS_ERROR, payload: msg}),
        () => ({type: FETCH_RUNS_START})
    );
}
