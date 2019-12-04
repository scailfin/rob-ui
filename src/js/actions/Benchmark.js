/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { getUrl } from './Requests';
import { Urls } from '../resources/Urls';


export const FETCH_BENCHMARKS_SUCCESS = 'FETCH_BENCHMARKS_SUCCESS';
export const SELECT_BENCHMARK = 'SELECT_BENCHMARK';


export function fetchBenchmarks(url) {
    return getUrl(url, fetchBenchmarksSuccess);
}


function fetchBenchmarksSuccess(json) {
    return {
        type: FETCH_BENCHMARKS_SUCCESS, payload: json
    }
}


export function selectBenchmark(benchmark) {
    const url = new Urls(benchmark.links).get('leaderboard');
    return getUrl(url, (json) => (fetchLeaderboardSuccess(benchmark, json)), false);
}


function fetchLeaderboardSuccess(benchmark, leaderboard) {
    const { id, name, description, instructions, links } = benchmark;
    return {
        type: SELECT_BENCHMARK,
        payload: {
            id,
            name,
            description,
            instructions,
            leaderboard,
            urls: new Urls(links)
        }
    }
}
