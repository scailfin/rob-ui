import {
    FETCH_START, FETCH_SUCCESS, FETCH_ERROR, SET_COMPONENT
} from '../actions/App';
import {LOGIN_SUCCESS, LOGOUT_SUCCESS} from '../actions/Auth';
import {CLEAR_ERROR} from '../actions/Error';


const INITIAL_STATE = {
    accessToken: null,
    component: null,
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
            return {
                ...state,
                username: username,
                accessToken: token,
                component: action.payload.component
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                username: null,
                accessToken: null,
                component: null
            };
        case SET_COMPONENT:
            return {...state, component: action.payload};
        default:
            return state;
    }
}

export default app;
