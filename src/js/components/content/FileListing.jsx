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

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

const useStyles = makeStyles(theme => ({
}));


function FileListing(props) {
    const classes = useStyles();
    const { contentId, content, files, onDownload } = props;
    if (files.length === 0) {
        return null;
    }
    const items = [];
    for (let i = 0; i < files.length; i++) {
        const fh = files[i];
        items.push(
            <ListItem
                key={fh.id}
                button
                onClick={() => (onDownload(fh))}
            >
                <ListItemIcon>
                    <DescriptionOutlined />
                </ListItemIcon>
                <ListItemText primary={fh.name + ' (' + utc2LocalTime(fh.createdAt) + ')'} />
            </ListItem>
        );
        if (fh.id === contentId) {
            let lang = 'javascript';
            if (fh.name.endsWith('.json')) {
                lang = 'json';
            } else if (fh.name.endsWith('.py')) {
                lang = 'python'
            }
            items.push(
                <SyntaxHighlighter key={'content'} language={lang} style={okaidia}>
                  {content}
                </SyntaxHighlighter>
            );
        }
    }
    return (
        <List component="nav" className={classes.root}>
            {items}
        </List>
    );
}

FileListing.propTypes = {
    contentId: PropTypes.string,
    content: PropTypes.string,
    files: PropTypes.array.isRequired,
    onDownload: PropTypes.func.isRequired
}

export default FileListing;
