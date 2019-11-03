import { NO_OP } from './App';
import { SELECT_SUBMISSION } from './Submission.js'
import { getUrl, postUrl } from './Requests';


export function cancelRun(url, submission) {
    return postUrl(
        url,
        {reason: 'Canceled at user request'},
        (json) => (successFetchRun(submission, json)),
        false,
        'PUT'
    );
}


export function getRun(url, submission) {
    return getUrl(url, (json) => (successFetchRun(submission, json)), false);
}


export function submitRun(url, data, submission) {
    return postUrl(
        url,
        data,
        (json) => (successFetchRun(submission, json)),
        false
    );
}


function successFetchRun(submission, run) {
    const updatedRuns = [];
    let runFound = false;
    for (let i = 0; i < submission.runs.length; i++) {
        const r = submission.runs[i];
        if (r.id === run.id) {
            // If the run state has not changed there is no need to update
            // the application state. Instead, we return an 'no operation'.
            if (r.state === run.state) {
                return {
                    type: NO_OP
                }
            }
            updatedRuns.push(run);
            runFound = true;
        } else {
            updatedRuns.push(r);
        }
    }
    if (!runFound) {
        updatedRuns.push(run);
    }
    return {
        type: SELECT_SUBMISSION,
        payload: {...submission, runs: updatedRuns}
    }
}
