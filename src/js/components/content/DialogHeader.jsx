/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019-2021 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
    headerTitle: {
        paddingLeft: 10,
        paddingTop: 10
    },
    headerButton: {
        textAlign: 'right'
    },
    iconButton: {
        color: '#888',
        '&:hover': {
            backgroundColor: '#bcbcbc'
        }
    },
    root: {
        marginTop: theme.spacing(1),
        height: 50,
        color: '#444'
    },
}));


function DialogHeader(props) {
    const classes = useStyles();
    const { title, onClose } = props;
    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------
    let closeButton = null;
    if (onClose != null) {
        closeButton = (
            <IconButton
                className={classes.iconButton}
                onClick={onClose}
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


DialogHeader.propTypes = {
    onClose: PropTypes.func,
    title: PropTypes.string.isRequired
}


export default DialogHeader;
