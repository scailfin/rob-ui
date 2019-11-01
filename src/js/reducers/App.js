import { FETCH_START, FETCH_SUCCESS, FETCH_ERROR } from '../actions/App';
import {LOGIN_SUCCESS, LOGOUT_SUCCESS} from '../actions/Auth';
import {CLEAR_ERROR} from '../actions/Error';


const INITIAL_STATE = {
    error: null,
    fetching: false,
    username: null
}


const app = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_START:
            return {...state, fetching: true};
        case FETCH_SUCCESS:
            return {...state, fetching: false};
        case CLEAR_ERROR:
            return {...state, error: null};
        case FETCH_ERROR:
            return {...state, fetching: false, error: action.payload.error};
        case LOGIN_SUCCESS:
            const {username, token} = action.payload.response;
            localStorage.setItem('accessToken', token);
            return {...state, username: username};
        case LOGOUT_SUCCESS:
            localStorage.removeItem('accessToken');
            return {...state, username: null};
        default:
            return state;
    }
}

export default app;
