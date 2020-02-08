/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ErrorMessage from '../../app/ErrorMessage';
import Grid from '@material-ui/core/Grid';
import Spinner from '../../app/Spinner';
import Submission from './Submission.jsx';
import SubmissionsNavbar from './SubmissionsNavbar.jsx';
import { dismissError } from '../../../actions/Submission';



const useStyles = makeStyles(theme => ({
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        submissions: state.submissions
    };
};


function mapDispatchToProps(dispatch) {
  return {
      dismissError: () => (dispatch(dismissError()))
  };
}


function SubmissionPanel(props) {
    const classes = useStyles();
    const {
        fetchError,
        isFetching,
        selectedSubmission,
        submissionDialog,
        submissions
    } = props.submissions;
    // - Handler for minor error dismiss
    const onErrorDismiss = () => {
        props.dismissError();
    }
    // -- Component Content (render) ------------------------------------------
    // Show logo with linear progress bar while still loading
    let errorMessage = null;
    if (isFetching) {
        return (<Spinner message={'Loading your submissions ...'} showLogo={true} />);
    } else if (fetchError) {
        const { error, isCritical } = fetchError;
        if (isCritical) {
            return (<ErrorMessage error={error} isCritical={isCritical}/>);
        } else {
            errorMessage = (
                <ErrorMessage
                    error={error}
                    isCritical={false}
                    onClose={onErrorDismiss}
                />
            )
        }
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <SubmissionsNavbar />
            </Grid>
            <Grid item xs={9}>
                <div>
                    <Submission />
                </div>
            </Grid>
            { errorMessage }
        </Grid>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionPanel);
