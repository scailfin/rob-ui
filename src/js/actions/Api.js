import {fetchStart, fetchSuccess, fetchError} from './App';

export const FETCH_API_SUCCESS = 'FETCH_API_SUCCESS';


export function getUrl(url, handler, accessToken) {
    return dispatch => {
        dispatch(fetchStart());
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(fetchError(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(fetchSuccess());
                        dispatch(handler(json));
                    })
                }
            })
            .catch(error => dispatch(fetchError(error.message)));
    };
}


export function postUrl(url, data, handler, accessToken) {
    console.log(data)
    return dispatch => {
        dispatch(fetchStart());
        return fetch(
            url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'api_key': accessToken,
              },
              body: JSON.stringify(data)
            }).then(response => {
                if (!response.ok) {
                    response.json().then(json => {
                        dispatch(fetchError(json.message));
                    });
                } else {
                    response.json().then(json => {
                        dispatch(fetchSuccess());
                        dispatch(handler(json));
                    })
                }
            })
            .catch(error => dispatch(fetchError(error.message)));
    };
}


export function fetchApi() {
    return getUrl('http://localhost:5000/rob/api/v1', fetchApiSuccess)
}


function fetchApiSuccess(payload) {
    return {
        type: FETCH_API_SUCCESS,
        payload
    }
}
