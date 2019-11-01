import { FETCH_BENCHMARKS_SUCCESS, SELECT_BENCHMARK } from '../actions/Benchmark';
import { FETCH_SUBMISSIONS_SUCCESS } from '../actions/Submission';


const INITIAL_STATE = {
    benchmarks: null,
    selectedBenchmark: null,
    submissions: null
}


const benchmarkListing = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_BENCHMARKS_SUCCESS:
            return {...state, benchmarks: action.payload.benchmarks};
        case FETCH_SUBMISSIONS_SUCCESS:
            return {...state, submissions: action.payload.submissions};
        case SELECT_BENCHMARK:
            return {...state, selectedBenchmark: action.payload};
        default:
            return state
    }
}

export default benchmarkListing;
