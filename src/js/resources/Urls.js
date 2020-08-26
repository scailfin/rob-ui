/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

/*
 * The API returns a list of Url patterns. Each entry in the list contains an
 * unique identifier ('action') and the pattern ('pattern'). The Url pattern
 * contains references to variables (e.g., benchmarkId) enclosed in curly
 * brackets.
 *
 * The set of patterns (and action identifier) is fixed. This class provides a
 * wrapper around the different routes that replaces references to placeholders
 * in the pattern with given argument values.
 */
export class Urls {
    constructor(links) {
        this.links = links;
    }
    /*
     * Get the Url pattern reference that is associated with the given action
     * identifier. The result is null if no reference with the given key
     * exists.
     */
    get(key) {
        const ref = this.links.find((ref) => (ref.action === key));
        if (ref != null) {
            return ref.pattern;
        } else {
            return null;
        }
    }
    /*
     * Get listing of all benchmarks.
     */
    getBenchmark(benchmarkId) {
        return this.get('benchmarks:get').replace('{benchmarkId}', benchmarkId);
    }
    /*
     * Get listing of all benchmarks.
     */
    getBenchmarkResource(benchmarkId, resourceId) {
        return this.get('benchmarks:resource')
            .replace('{benchmarkId}', benchmarkId)
            .replace('{resourceId}', resourceId);
    }
    /*
     * Get listing of all benchmarks.
     */
    listBenchmarks() {
        return this.get('benchmarks:list');
    }
    /*
     * Shortcut to get link to the API service descriptor.
     */
    home() {
        return this.get('home');
    }
    /*
     * Get current leader board ranking for the given benchmark.
     */
    getLeaderboard(benchmarkId) {
        return this.get('benchmarks:ranking').replace('{benchmarkId}', benchmarkId);
    }
    /*
     * Send user login credentials.
     */
    login() {
        return this.get('users:login');
    }
    /*
     * Send user logout request.
     */
    logout() {
        return this.get('users:logout');
    }
    /*
     * Get Url to POST a create submission request
     */
    createSubmission(benchmarkId) {
        return this.get('submissions:create').replace('{benchmarkId}', benchmarkId);
    }
    /*
     * Get Url to DELETE a submission
     */
    deleteSubmission(submissionId) {
        return this.get('submissions:delete').replace('{submissionId}', submissionId);
    }
    /*
     * Get listing of user submissions
     */
    getSubmission(submissionId) {
        return this.get('submissions:get').replace('{submissionId}', submissionId);
    }
    /*
     * Get listing of user submissions
     */
    listSubmissions(benchmarkId) {
        return this.get('benchmarks:submissions').replace('{benchmarkId}', benchmarkId);
    }
    /*
     * Get list of handles for all files that have previously been uploaded for
     * a submission.
     */
    getSubmissionFiles(submissionId) {
        return this.get('uploads:list').replace('{submissionId}', submissionId);
    }
    /*
     * Url to download a given submission file
     */
    downloadSubmissionFile(submissionId, fileId) {
        return this.get('uploads:download')
            .replace('{submissionId}', submissionId)
            .replace('{fileId}', fileId);
    }
    /*
     * Url for submission file uploads
     */
    uploadSubmissionFile(submissionId) {
        return this.get('uploads:upload').replace('{submissionId}', submissionId);
    }
    /*
     * Post cancel request for active run
     */
    cancelRun(runId) {
        return this.get('runs:cancel').replace('{runId}', runId);
    }
    /*
     * Url to download all run result files in a single archive.
     */
    downloadRunArchive(runId) {
        return this.get('runs:archive')
            .replace('{runId}', runId);
    }
    /*
     * Url to download a given run file
     */
    downloadRunFile(runId, fileId) {
        return this.get('runs:resource')
            .replace('{runId}', runId)
            .replace('{resourceId}', fileId);
    }
    /*
     * Url to fetch run handle.
     */
    getRun(runId) {
        return this.get('runs:get').replace('{runId}', runId);
    }
    /*
     * Get listing of all runs for a submission.
     */
    listRuns(submissionId) {
        return this.get('submissions:runs').replace('{submissionId}', submissionId);
    }
    /*
     * Get list of active runs.
     */
    pollRuns(submissionId) {
        return this.get('runs:poll').replace('{submissionId}', submissionId);
    }
    /*
     * Url to submit a new ron for the given submission
     */
    submitRun(submissionId) {
        return this.get('submissions:submit').replace('{submissionId}', submissionId);
    }
}
