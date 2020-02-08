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
     * Get listing of all runs for a submission.
     */
    listRuns(submissionId) {
        return this.get('submissions:runs').replace('{submissionId}', submissionId);
    }
}
