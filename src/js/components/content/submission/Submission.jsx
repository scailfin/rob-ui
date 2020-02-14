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
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ErrorMessage from '../../util/ErrorMessage';
import FileUploads from './FileUploads';
import RunListing from '../run/RunListing.jsx';
import Spinner from '../../util/Spinner';
import SubmitRunForm from '../run/SubmitRunForm';
import { selectDialog } from '../../../actions/Benchmark';
import { SHOW_RUNS, SUBMIT_RUN, UPLOAD_FILES } from '../../../resources/Dialog';


const useStyles = makeStyles(theme => ({
    emptyTabMsg: {
        marginTop: theme.spacing(4),
    },
    instructions: {
        marginTop: theme.spacing(4),
    },
    spinner: {
        marginTop: theme.spacing(8),
        marginRight: theme.spacing(24)
    },
    uploadForm: {
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing(8),
        padding: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ebebeb'
    },
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        benchmark: state.benchmark,
        submission: state.submission
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectDialog: (api, dialogId, behcnmark, submission) => dispatch(
          selectDialog(api, dialogId, behcnmark, submission)
      )
  };
}


function Submission(props) {
    const classes = useStyles();
    const selectedDialog = props.benchmark.selectedDialog;
    const { fetchError, isFetching, selectedSubmission} = props.submission;
    // -- Render --------------------------------------------------------------
    if (isFetching) {
        return (
            <div className={classes.spinner}>
                <Spinner message='Loading submission ...' showLogo={true}/>
            </div>
        );
    } else if (fetchError != null) {
        return (<ErrorMessage error={fetchError} isCritical={true} />);
    } else if (selectedSubmission == null) {
        return null;
    } else if (selectedDialog === SHOW_RUNS) {
        return (<RunListing />);
    } else if (selectedDialog === SUBMIT_RUN) {
        return (<SubmitRunForm />);
    } else if (selectedDialog === UPLOAD_FILES) {
        return (<FileUploads />);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Submission);
