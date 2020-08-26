/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CSVPlot from './CSVPlot'
import ImagePlot from './ImagePlot';
import Spinner from '../../util/Spinner';
import Typography from '@material-ui/core/Typography';


// Use higher-order component API to create styles for the logo
const useStyles = makeStyles(theme => ({
    plot: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
}));


/*
 * Helper function to fetch resources asynchronoupsly. Base on:
 * https://blog.bitsrc.io/fetching-data-in-react-using-hooks-c6fdd71cb24a
 */
function useFetch(url, ftype) {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    useEffect(() => {
        if (ftype === 'image') {
            return;
        }
        setLoading(true)
        fetch(url)
            .then(res => {
                if (ftype === 'json') {
                    res.json().then(body => {
                        setResponse(body)
                        setLoading(false)
                    })
                } else {
                    res.text().then(body => {
                        setResponse(body)
                        setLoading(false)
                    })
                }
            })
            .catch(() => {
                setHasError(true)
                setLoading(false)
            })
    }, [ url, ftype ])
    return [ response, loading, hasError ];
 }



/*
 * Create plot component for a workflow resource (file).
 */
function Plot(props) {
    const classes = useStyles();
    const { resource, url } = props;

    const ftype = resource.format.type;

    const [response, loading, hasError] = useFetch(url, ftype);

    let content = null;

    if (loading) {
        content =  (<Spinner  message='Loading ...' showLogo={false}/>);
    } else if (hasError) {
        return (<p>Error loading data</p>);
    } else {
        let plot = null;
        switch(ftype) {
            case 'image':
                plot = (<ImagePlot resource={resource} url={url} />);
                break;
            case 'csv':
                plot = (<CSVPlot format={resource.format} text={response} />);
                break;
            default:
                return null;
        }
        content = (
            <>
                <Typography variant='h6' >
                    {resource.title}
                </Typography>
                { plot }
                <Typography variant='caption' >
                    {resource.caption}
                </Typography>
            </>
        );
    }

    return (
        <div className={classes.plot}>
            { content }
        </div>
    );
}

Plot.propTypes = {
    resource: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
}

export default Plot;
