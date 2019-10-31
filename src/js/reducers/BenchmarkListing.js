import { FETCH_BENCHMARKS_SUCCESS } from '../actions/Benchmark';
import { Urls } from '../resources/Urls';


const INITIAL_STATE = {
    benchmarks: null,
    urls: null
}


const benchmarkListing = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_BENCHMARKS_SUCCESS:
            const { benchmarks, links } = action.payload;
            return {...state, benchmarks: benchmarks, urls: new Urls(links)};
        default:
            return state
    }
}

export default benchmarkListing;
