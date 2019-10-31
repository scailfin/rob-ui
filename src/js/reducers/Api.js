import {FETCH_API_SUCCESS} from '../actions/Api';
import { Urls } from '../resources/Urls';

const INITIAL_STATE = {
    name: null,
    urls: null,
    version: null
}


const api = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_API_SUCCESS:
            const {name, version, links} = action.payload;
            return {...state, name: name, version: version, urls: new Urls(links)};
        default:
            return state
    }
}

export default api;
