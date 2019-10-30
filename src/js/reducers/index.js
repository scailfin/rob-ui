import { combineReducers } from 'redux';
import api from './Api';
import app from './App';

const rootReducer = combineReducers({
    api,
    app
})

export default rootReducer;
