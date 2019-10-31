import { FETCH_BENCHMARKS_SUCCESS } from '../actions/Benchmark';
import { FETCH_SUBMISSIONS_SUCCESS } from '../actions/Submission';


const INITIAL_STATE = {
    benchmarks: null,
    submissions: null
}


const benchmarkListing = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_BENCHMARKS_SUCCESS:
            return {...state, benchmarks: action.payload.benchmarks};
        case FETCH_SUBMISSIONS_SUCCESS:
            return {...state, submissions: action.payload.submissions};
        default:
            return state
    }
}

export default benchmarkListing;
