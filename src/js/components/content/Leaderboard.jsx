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
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { Urls} from '../../resources/Urls';


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    spinner: {
        marginTop: theme.spacing(8),
        marginRight: theme.spacing(24)
    },
    table: {
      minWidth: 700,
    },
    plots: {
        marginTop: theme.spacing(4),
    }
}));


function Leaderboard(props) {
    const classes = useStyles();
    if (props.leaderboard == null) {
        return (
            <div className={classes.spinner}>
                <Typography variant="overline">
                    Loading Result Table ...
                </Typography>
                <LinearProgress color='secondary'/>
            </div>
        );
    }
    const { schema, ranking, resources } = props.leaderboard;
    // -- Result table --------------------------------------------------------
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
        rows.push(<TableRow key={i}>{cells}</TableRow>);
    }
    // -- Plot listing --------------------------------------------------------
    const plots = [];
    for (let i = 0; i < resources.length; i++) {
        const res = resources[i];
        plots.push(
            <div key={res.id} className={classes.plots}>
                <Typography variant='h6' >
                    {res.name}
                </Typography>
                <div align='center'>
                    <div>
                        <img src={new Urls(res.links).self()} alt={res.name} />
                    </div>
                    <Typography variant='caption' >
                        {res.caption}
                    </Typography>
                </div>
            </div>
        );
    }
    // -- Assemble content ----------------------------------------------------
    return (
        <div className={classes.root}>
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
            <Divider />
            { plots }
        </div>
  );
}


Leaderboard.propTypes = {
  leaderboard: PropTypes.object,
};


export default Leaderboard;
