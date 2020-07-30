/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ErrorMessage from '../../util/ErrorMessage';
import Spinner from '../../util/Spinner';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { fetchLeaderboard } from '../../../actions/Benchmark';


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(0),
      overflowX: 'auto',
    },
    spinner: {
        marginTop: theme.spacing(8),
        marginRight: theme.spacing(24)
    },
    paper: {
        padding: 10,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(4),
        backgroundColor: '#f0f0f0',
        borderColor: '#a0a0a0',
        borderRadius: 4
    },
    table: {
        minWidth: 700,
    },
    row: {
        backgroundColor: '#ffffff'
    },
    plots: {
        marginTop: theme.spacing(4),
    },
    errorText: {
        color: '#912d2b',
        fontSize: '1.2em'
    }
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        benchmark: state.benchmark,
        leaderboard: state.leaderboard
    };
};


function mapDispatchToProps(dispatch) {
  return {
      poll: (api, benchmark) => (
          dispatch(fetchLeaderboard(api, benchmark, false))
      )
  };
}


function Leaderboard(props) {
    const classes = useStyles();
    const api = props.app;
    const selectedBenchmark = props.benchmark.selectedBenchmark;
    const {
        fetchError,
        isFetching,
        outputs,
        pollInterval,
        postProcRun,
        schema,
        ranking
    } = props.leaderboard;
    const poll = props.poll;
    // -- Set polling handler -------------------------------------------------
    useEffect(() => {
        let timer = null;
        if ((pollInterval > 0) && (postProcRun != null)) {
            timer = setInterval(() => (
                    poll(api, selectedBenchmark)
                ),
                pollInterval
            );
        }
        return () => {
            if (timer != null) {
                clearInterval(timer);
            }
        };
    }, [api, selectedBenchmark, postProcRun, pollInterval, poll]);
    // -- Render --------------------------------------------------------------
    if (isFetching) {
        return (
            <div className={classes.spinner}>
                <Spinner message='Loading latest results ...' showLogo={true}/>
            </div>
        );
    } else if (fetchError != null) {
        return (<ErrorMessage error={fetchError} isCritical={true} />);
    } else if ((ranking == null) || (schema == null)) {
        return null;
    }
    // -- Result table
    const headline = [];
    headline.push(<TableCell key={'col'}></TableCell>);
    for (let i = 0; i < schema.length; i++) {
        const col = schema[i];
        let align = 'right';
        if (col.type === 'string') {
            align = 'left'
        }
        headline.push(
            <TableCell key={'col-' + col.id} align={align}>
                {col.name}
            </TableCell>
        );
    }
    const rows = [];
    for (let i = 0; i < ranking.length; i++) {
        const run = ranking[i];
        const cells = [];
        cells.push(
            <TableCell key={'col'} align='left'>
                {run.submission.name}
            </TableCell>
        );
        for (let j = 0; j < schema.length; j++) {
            const col = schema[j];
            let align = 'right';
            if (col.type === 'string') {
                align = 'left'
            }
            let val = run.results[j].value;
            if (col.type === 'decimal') {
                try{
                    val = val.toFixed(6);
                } catch (err) {}
            }
            cells.push(
                <TableCell key={'col-' + col.id} align={align}>
                    {val}
                </TableCell>
            );
        }
        rows.push(<TableRow key={i} className={classes.row}>{cells}</TableRow>);
    }
    // -- Plot listing
    let plotListing = null;
    if (postProcRun != null) {
        if (postProcRun.state === 'ERROR') {
            plotListing = (
                <div>
                    <pre className={classes.errorText}>
                        {postProcRun.messages.join('\n')}
                    </pre>
                </div>
            );
        } else if (postProcRun.state === 'SUCCESS') {
            if (outputs != null) {
                const plots = [];
                for (let i = 0; i < outputs.length; i++) {
                    const res = outputs[i];
                    const fh = postProcRun.files.find((r) => (r.name === res.id));
                    if (fh.name.endsWith('.png')) {
                        const bId = selectedBenchmark.id;
                        const url = api.urls.getBenchmarkResource(bId, fh.id);
                        plots.push(
                            <div key={res.id} className={classes.plots}>
                                <Typography variant='h6' >
                                    {res.title}
                                </Typography>
                                <div align='center'>
                                    <div>
                                        <img src={url} alt={res.name} />
                                    </div>
                                    <Typography variant='caption' >
                                        {res.caption}
                                    </Typography>
                                </div>
                            </div>
                        );
                    }
                }
                plotListing = plots;
            }
        } else {
            plotListing = (<Spinner  message='Processing ...' showLogo={false}/>);
        }
    }
    // -- Assemble content
    return (
        <div className={classes.root}>
            <Box border={1} className={classes.paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {headline}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { rows }
                    </TableBody>
                </Table>
            </Box>
            { plotListing }
        </div>
    );
}


export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
