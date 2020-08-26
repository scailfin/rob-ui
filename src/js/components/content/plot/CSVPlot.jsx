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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


// Use higher-order component API to create styles for the logo
const useStyles = makeStyles(theme => ({
    header: {
        fontWeight: 'bold'
    },
    table: {
        margin: theme.spacing(2)
    }
}));


function CSVPlot(props) {
    const classes = useStyles();
    const { text, format } = props;

    if (text == null) {
        return null;
    }

    const lines = text.trim().split(/\r\n|\n/);

    let headline = null;
    let start = 0;
    let columns = null;
    if (format.header) {
        columns =  lines[0];
        start = 1;
    } else if (format.columns != null) {
        columns = format.columns;
    }
    if (columns != null) {
        headline = [];
        for (let i = 0; i < columns.length; i++) {
            headline.push(
                <TableCell className={classes.header} key={i}>
                    {columns[i]}
                </TableCell>
            );
        }
    }

    const rows = [];
    for (let i = start; i < lines.length; i++) {
        const row = [];
        const cells = lines[i].split(',');
        for (let c = 0; c < cells.length; c++) {
            row.push(<TableCell key={c}>{cells[c]}</TableCell>);
        }
        rows.push(<TableRow key={i}>{row}</TableRow>);
    }

    return (
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
    );
}

CSVPlot.propTypes = {
    format: PropTypes.object.isRequired,
    text: PropTypes.string
}

export default CSVPlot;
