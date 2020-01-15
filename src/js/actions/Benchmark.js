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


export const DESELECT_BENCHMARK = 'DESELECT_BENCHMARK';
export const FETCH_BENCHMARKS_SUCCESS = 'FETCH_BENCHMARKS_SUCCESS';
export const SELECT_BENCHMARK = 'SELECT_BENCHMARK';
export const SELECT_TAB = 'SELECT_TAB';
export const UPDATE_BENCHMARK = 'UPDATE_BENCHMARK';


export const deselectBenchmark = () => ({type: DESELECT_BENCHMARK});

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
    return getUrl(url, (json) => (fetchLeaderboardSuccess(benchmark, json, SELECT_BENCHMARK)), false);
}


export const selectTab = (tabId) => ({type: SELECT_TAB, payload: tabId});


export function updateBenchmark(benchmark) {
    const url = benchmark.urls.get('leaderboard');
    return dispatch => {
        dispatch(fetchLeaderboardSuccess(benchmark, null, UPDATE_BENCHMARK));
        return dispatch(
            getUrl(
                url,
                (json) => (fetchLeaderboardSuccess(benchmark, json, UPDATE_BENCHMARK)),
                false
            )
        );
    }
}


function fetchLeaderboardSuccess(benchmark, leaderboard, actionType) {
    const { id, name, description, instructions, links } = benchmark;
    return {
        type: actionType,
        payload: {
            id,
            name,
            description,
            instructions,
            leaderboard,
            links,
            urls: new Urls(links)
        }
    }
}
