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
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';


// Use higher-order component API to create styles for the logo
const useStyles = makeStyles(theme => ({
    critical: {
        color: theme.palette.secondary.main,
        marginTop: theme.spacing(8)
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    errorMessage: {
      marginLeft: theme.spacing(2),
    },
    icon: {
      fontSize: 20,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    }
}));


function ErrorMessage(props) {
    const classes = useStyles();
    /*
     * Call the provided onClose handler if a snackbar is dismissed.
     */
    const onClose = () => {
        props.onClose();
    }
    /*
     * Render error message. The style depends on the value of the isCritical
     * flag.
     */
    const { error, isCritical } = props;
    if (!isCritical) {
        return (
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'right',}}
                open={true}
                autoHideDuration={6000}
                onClose={onClose}
            >
                <SnackbarContent
                    className={classes.error}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                        <ErrorIcon
                            className={classes.icon}
                        />
                            <span className={classes.errorMessage}>
                                {error}
                            </span>
                        </span>
                    }
                    action={[
                        <IconButton
                            key="close"
                            aria-label="close"
                            color="inherit"
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    } else {
        return (
            <Typography variant='h6' align='center' className={classes.critical}>
                { error }
            </Typography>
        );

    }
}

ErrorMessage.propTypes = {
    error: PropTypes.string.isRequired,
    isCritical: PropTypes.bool.isRequired,
    onClose: PropTypes.func
}

export default ErrorMessage;
