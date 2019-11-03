import { LOGOUT_SUCCESS } from '../actions/Auth';
import { FETCH_BENCHMARKS_SUCCESS, SELECT_BENCHMARK } from '../actions/Benchmark';
import {
    CREATE_SUBMISSIONS_SUCCESS, FETCH_SUBMISSIONS_SUCCESS, SELECT_SUBMISSION
} from '../actions/Submission';


const INITIAL_STATE = {
    benchmarks: null,
    selectedBenchmark: null,
    selectedSubmission: null,
    submissions: null
}


const mainPanel = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CREATE_SUBMISSIONS_SUCCESS:
            const createdSubmission = action.payload;
            return {
                ...state,
                submissions: state.submissions.concat([createdSubmission]),
                selectedBenchmark: null,
                selectedSubmission: createdSubmission
            };
        case FETCH_BENCHMARKS_SUCCESS:
            return {...state, benchmarks: action.payload.benchmarks};
        case FETCH_SUBMISSIONS_SUCCESS:
            return {...state, submissions: action.payload.submissions};
        case LOGOUT_SUCCESS:
            return {
                ...state,
                selectedBenchmark: null,
                selectedSubmission: null,
                submissions: null
            };
        case SELECT_BENCHMARK:
            return {
                ...state,
                selectedBenchmark: action.payload,
                selectedSubmission: null
            };
        case SELECT_SUBMISSION:
            // Need to replace the selected item in the submission array in case
            // it is a submission handle that was requested from the server.
            const selectedSubmission = action.payload;
            const updatedSubmissions = [];
            state.submissions.forEach((s) => {
                if (s.id === selectedSubmission.id) {
                    updatedSubmissions.push(selectedSubmission);
                } else {
                    updatedSubmissions.push(s);
                }
            });
            return {
                ...state,
                selectedBenchmark: null,
                selectedSubmission: selectedSubmission,
                submissions: updatedSubmissions
            };
        default:
            return state
    }
}

export default mainPanel;
