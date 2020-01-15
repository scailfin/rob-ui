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
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { selectDialog } from '../../actions/Submission';
import {
    CREATE_SUBMISSION, SHOW_RUNS, SUBMIT_RUN, UPLOAD_FILES
} from '../../resources/Dialog';


const useStyles = makeStyles(theme => ({
    headerTitle: {
        paddingLeft: 10,
        paddingTop: 10
    },
    headerButton: {
        textAlign: 'right'
    },
    iconButton: {
        color: '#004b87',
        '&:hover': {
            backgroundColor: '#e7f4ff'
        }
    },
    root: {
        marginTop: theme.spacing(1),
        height: 50,
        color: '#004b87'
    },
}));


const mapStateToProps = state => {
    return {
        mainPanel: state.mainPanel
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectDialog: (dialogId) => dispatch(selectDialog(dialogId))
  };
}


function DialogHeader(props) {
    const { selectedSubmission, submissionDialog } = props.mainPanel;
    const classes = useStyles();
    // -- Main Content (render) -----------------------------------------------
    let title = null;
    let showCloseButton = false;
    if (submissionDialog === CREATE_SUBMISSION) {
        title = 'New Submission ...';
        showCloseButton = true;
    } else if (selectedSubmission != null) {
        title = selectedSubmission.name;
        if (submissionDialog === SHOW_RUNS) {
            title = 'Runs (' + title + ')'
        } else if (submissionDialog === SUBMIT_RUN) {
            title = 'Submit New Run (' + title + ')'
        } else if (submissionDialog === UPLOAD_FILES) {
            title = 'Upload Files (' + title + ')'
        }
        showCloseButton = (submissionDialog !== SHOW_RUNS);
    }
    let closeButton = null;
    if (showCloseButton) {
        closeButton = (
            <IconButton
                className={classes.iconButton}
                onClick={() => (props.selectDialog(SHOW_RUNS))}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>
        );
    }
    let content = null;
    if (title != null) {
        content = (
            <Grid container className={classes.root}>
                <Grid item xs={9}>
                    <Typography variant='subtitle2' className={classes.headerTitle}>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={3} className={classes.headerButton}>
                    { closeButton }
                </Grid>
            </Grid>
        );
    }
    return content;
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogHeader);
