/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';


/**
 * Component that continuously sends polling requests to the API and
 * dispatches the result to a given callback handler.
 *
 * Displays a cancel button to activate a given callback handler.
 *
 * https://stackoverflow.com/questions/46140764/polling-api-every-x-seconds-with-react
 */
class ApiPolling extends React.Component {
    static propTypes = {
        interval: PropTypes.number.isRequired,
        onCancel: PropTypes.func.isRequired,
        onFetch: PropTypes.func.isRequired,
        run: PropTypes.object.isRequired
    }
    /**
     * Start a timer to call the provided fetch function at the specified
     * interval.
     */
    componentDidMount() {
        const { interval, onFetch, run } = this.props;
        this.timer = setInterval(() => (onFetch(run)), interval);
    }
    /**
     * Cancel the fetch timer.
     */
    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }
    /**
     * Show a spinner with a cancel button.
     */
    render() {
        const { onCancel, run } = this.props;
        return (
            <Button
                variant="contained"
                color="secondary"
                onClick={() => (onCancel(run))}
            >
                Cancel
            </Button>
        );
    }
}

export default ApiPolling;
