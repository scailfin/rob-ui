import {getUrl} from './Api';
import {fetchStart, fetchSuccess} from './App';


export const FETCH_BENCHMARKS_SUCCESS = 'FETCH_BENCHMARKS_SUCCESS';
export const SELECT_BENCHMARK = 'SELECT_BENCHMARK';


export function fetchBenchmarks(url) {
    const startSignal = () => (fetchStart('BL'));
    return getUrl(url, startSignal, fetchSuccess, fetchBenchmarksSuccess);
}


function fetchBenchmarksSuccess(json) {
    return {
        type: FETCH_BENCHMARKS_SUCCESS, payload: json
    }
}


export function selectBenchmark(benchmark) {
    return {
        type: SELECT_BENCHMARK, payload: benchmark
    }
}
