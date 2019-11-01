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
    const { id, name, description, instructions, links } = benchmark;
    return {
        type: SELECT_BENCHMARK, payload: {
            id,
            name,
            description,
            instructions,
            urls: new Urls(links)
        }
    }
}
