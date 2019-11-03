import { SELECT_SUBMISSION } from './Submission.js'
import { getUrl, postUrl } from './Requests';


export function cancelRun(url, submission) {
    return postUrl(
        url,
        {reason: 'Canceled at user request'},
        (json) => (successFetchRun(submission, json)),
        'PUT',
        false
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
    submission.runs.forEach((r) => {
        if (r.id === run.id) {
            updatedRuns.push(run);
            runFound = true;
        } else {
            updatedRuns.push(r);
        }
    });
    if (!runFound) {
        updatedRuns.push(run);
    }
    return {
        type: SELECT_SUBMISSION,
        payload: {
            ...submission,
            runs: updatedRuns
        }
    }
}
