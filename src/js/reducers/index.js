import { combineReducers } from 'redux';
import api from './Api';
import app from './App';
import mainPanel from './MainPanel';


const rootReducer = combineReducers({
    api,
    app,
    mainPanel
})

export default rootReducer;
