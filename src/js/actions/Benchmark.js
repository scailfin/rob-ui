import {getUrl} from './Api';

export const FETCH_BENCHMARKS_SUCCESS = 'FETCH_BENCHMARKS_SUCCESS';


export function fetchBenchmarks(url) {
    return getUrl(url, fetchBenchmarksSuccess);
}


function fetchBenchmarksSuccess(json) {
    return {
        type: FETCH_BENCHMARKS_SUCCESS, payload: json
    }
}
