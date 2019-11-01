import {FETCH_API_SUCCESS} from '../actions/Api';


const INITIAL_STATE = {
    name: null,
    urls: null,
    version: null
}


const api = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_API_SUCCESS:
            const {name, version, urls} = action.payload;
            return {...state, name: name, version: version, urls: urls};
        default:
            return state
    }
}

export default api;
