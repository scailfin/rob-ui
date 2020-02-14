/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

/*
 * The submission file uploads component has two main parts: (1) List of files
 * that were uploaded for a submission, and (2) an option to upload new files.
 */

import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CloudUpload from '@material-ui/icons/CloudUpload';
import DialogHeader from '../DialogHeader';
import Dropzone from 'react-dropzone';
import ErrorMessage from '../../util/ErrorMessage';
import FileListing from '../FileListing';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Spinner from '../../util/Spinner';
import Typography from '@material-ui/core/Typography';
import { selectDialog } from '../../../actions/Benchmark';
import { dismissFilesError, uploadFiles } from '../../../actions/Submission';
import { SHOW_RUNS } from '../../../resources/Dialog';


// -- Component styles --------------------------------------------------------

const useStyles = makeStyles(theme => ({
    cellHeader: {
        paddingLeft: theme.spacing(1)
    },
    fileList: {
        borderColor: '#cecece',
        paddingRight: theme.spacing(1),
        marginRight: theme.spacing(2),
    },
    gridColumn: {
        backgroundColor: '#fff',
        marginTop: theme.spacing(2)
    },
    paperForm: {
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        backgroundColor: '#fff'
    },
    spinner: {
        marginTop: theme.spacing(2),
    },
    uploadForm: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));


// -- Mappings between global and component state -----------------------------

/*
 * The component requires the application state to access the upload urls,
 * the selected submission, and the list of uploaded files for the submission.
 */
const mapStateToProps = state => {
    return {
        app: state.app,
        fileUploads: state.fileUploads,
        submission: state.submission
    };
};


function mapDispatchToProps(dispatch) {
  return {
      dismissFilesError: () => (dispatch(dismissFilesError())),
      selectDialog: (api, dialogId, benchmark, submission) => (
          dispatch(selectDialog(api, dialogId, benchmark, submission))
      ),
      uploadFiles: (api, submission, files) => (
          dispatch(uploadFiles(api, submission, files))
      ),
  };
}


// -- Component ---------------------------------------------------------------

function FileUploads(props) {
    const classes = useStyles();
    const selectedSubmission = props.submission.selectedSubmission;
    const { fetchError, files, isFetching } = props.fileUploads;
    // -- Event handlers ------------------------------------------------------
    const handleClose = () => {
        props.selectDialog(props.app, SHOW_RUNS);
    }
    const handleDismissError = () => {
        props.dismissFilesError();
    }
    const handleDownload = (fileId) => {
        const urls = props.app.urls;
        const url = urls.downloadSubmissionFile(selectedSubmission.id, fileId);
        window.location.href = url;
    }
    const handleFileDrop = (files) => {
        props.uploadFiles(props.app, selectedSubmission, files);
    }
    // -- Render --------------------------------------------------------------
    if (isFetching) {
        // Show spinner if the list of uploade files is currently being fetched
        // from the server.
        return (
            <div className={classes.spinner}>
                <Spinner message='Loading files ...' showLogo={false}/>
            </div>
        );
    }
    // If there is an error display it as a minor error
    let minorError = null;
    if (fetchError != null) {
        minorError = (
            <ErrorMessage
                error={fetchError}
                isCritical={false}
                onClose={handleDismissError}
            />
        );
    }
    return (
        <Paper className={classes.paperForm}>
            <DialogHeader
                title={selectedSubmission.name + ' - Input Files'}
                onClose={handleClose}
            />
            <Grid container spacing={2}>
                <Grid item xs={6} className={classes.gridColumn}>
                    <Box borderRight={1} className={classes.fileList}>
                        <FileListing
                            files={files}
                            onDownload={handleDownload}
                        />
                    </Box>
                </Grid>
                <Grid item xs={6} className={classes.gridColumn}>
                    <Box>
                        <Typography variant='h6'> Upload files ... </Typography>
                        <Dropzone
                            onDrop={acceptedFiles => handleFileDrop(acceptedFiles)}
                            multiple={false}
                        >
                          {({getRootProps, getInputProps}) => (
                            <section>
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Box className={classes.uploadForm}>
                                    <CloudUpload fontSize='large'/>
                                    <Typography variant='body2'>
                                        Drag files here, or click to select
                                    </Typography>
                                </Box>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                    </Box>
                </Grid>
            </Grid>
            { minorError }
        </Paper>
    );
}

// -- Connect component to the Redux store ------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(FileUploads);
