import {getUrl} from './Api';
import {fetchStart, fetchSuccess} from './App';


export const FETCH_SUBMISSIONS_SUCCESS = 'FETCH_SUBMISSIONS_SUCCESS';


export function fetchSubmissions(url) {
    const startSignal = () => (fetchStart('BL'));
    return getUrl(
        url,
        startSignal,
        fetchSuccess,
        fetchSubmissionsSuccess
    );
}


function fetchSubmissionsSuccess(json) {
    return {
        type: FETCH_SUBMISSIONS_SUCCESS, payload: json
    }
}
