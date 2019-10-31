import { combineReducers } from 'redux';
import api from './Api';
import app from './App';
import benchmarkListing from './BenchmarkListing';


const rootReducer = combineReducers({
    api,
    app,
    benchmarkListing
})

export default rootReducer;
