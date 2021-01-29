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

/*
 * Action types
 */

export const FETCH_BENCHMARKS_ERROR = 'FETCH_BENCHMARKS_ERROR';
export const FETCH_BENCHMARKS_START = 'FETCH_BENCHMARKS_START';
export const FETCH_BENCHMARKS_SUCCESS = 'FETCH_BENCHMARKS_SUCCESS';


/*
 * Fetch benchmark listing from API.
 */
export function fetchBenchmarks(api) {
    const url = api.urls.listBenchmarks();
    return fetchApiResource(
        url,
        (json) => ({type: FETCH_BENCHMARKS_SUCCESS, payload: json}),
        (msg) => ({type: FETCH_BENCHMARKS_ERROR, payload: msg}),
        () => ({type: FETCH_BENCHMARKS_START})
    );
}
