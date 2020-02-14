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
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemAvatar';
import { utc2LocalTime } from '../../resources/Timestamps';

const useStyles = makeStyles(theme => ({
}));


function FileListing(props) {
    const classes = useStyles();
    const { files, onDownload } = props;
    // -- Render --------------------------------------------------------------
    const items = [];
    files.sort((a, b) => ((b.createdAt).localeCompare(a.createdAt)));
    for (let i = 0; i < files.length; i++) {
        const fh = files[i];
        items.push(
            <ListItem
                key={fh.id}
                button
                onClick={() => (onDownload(fh.id))}
            >
                <ListItemIcon>
                    <DescriptionOutlined />
                </ListItemIcon>
                <ListItemText
                    primary={fh.name}
                    secondary={utc2LocalTime(fh.createdAt)}
                />
            </ListItem>
        );
    }
    return (
        <List component="nav" className={classes.root}>
            {items}
        </List>
    );
}

FileListing.propTypes = {
    files: PropTypes.array.isRequired,
    onDownload: PropTypes.func.isRequired
}

export default FileListing;
