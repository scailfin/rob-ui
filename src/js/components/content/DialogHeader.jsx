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
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { selectDialog } from '../../actions/Submission';
import {
    CREATE_SUBMISSION, SHOW_RUNS, SUBMIT_RUN, UPLOAD_FILES
} from '../../resources/Dialog';


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
        if (submissionDialog === SUBMIT_RUN) {
            title += ' - Submit New Run'
        } else if (submissionDialog === UPLOAD_FILES) {
            title += ' - Upload Files'
        }
        showCloseButton = (submissionDialog !== SHOW_RUNS);
    }
    let closeButton = null;
    if (showCloseButton) {
        closeButton = (
            <IconButton
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
            <div>
            <Typography>
                {title}
                { closeButton }
            </Typography>
            </div>
        );
    }
    return content;
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogHeader);
