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
 * Simple parser for markdown-style text.
 */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


// Component styles
const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2)
    }
}));


/**
 * Markdown component
 */
function Markdown(props) {
    const classes = useStyles();
    const markdownText = props.text;
    // Return null if the given markdown text is undefined
    if (markdownText == null) {
        return null;
    }
    const content = [];
    // Split the given text into lines. Each non-empty line is transformed into
    // a content component. Lines that do not start with a markup sequence are
    // represented as paragraphs.
    const lines = markdownText.split(/\r?\n/g);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let component = null;
        if (line.startsWith('#')) {
            const pos = line.indexOf(' ');
            let variant = null;
            if ((pos > 0) && (pos <= 6)) {
                variant = 'h' + pos;
            } else if ((pos >= 7) && (pos <= 8)) {
                variant = 'subtitle' + (pos - 6);
            }
            if (variant != null) {
                component = (
                    <Typography key={content.length} variant={variant}>
                        {line.substring(pos).trim()}
                    </Typography>
                );
            }
        } else if (line.startsWith('![')) {
            // Image reference. Expected format is ![text](text text)
            const regexpImg =  /!\[(.*)\]\((.*\s".*")\)/g;
            const match = regexpImg.exec(line);
            if (match != null) {
                const pos = match[2].indexOf(' ');
                const url = match[2].substring(0, pos).trim();
                let title = match[2].substring(pos + 1).trim()
                title = title.substring(1, title.length - 1);
                component = (
                    <div key={content.length} align='center'>
                        <div>
                            <img src={url} alt={match[1]} title={title} />
                        </div>
                    </div>
                );
            }
        }
        // If the line does not contain valid markup and it is not an empty
        // line then we display it as a paragraph.
        if ((component === null) && (line.trim() !== '')) {
            component = (
                <Typography key={content.length} variant='body1' paragraph>
                    {line}
                </Typography>
            );
        }
        content.push(component);
    }
    // Return content components insise a paper object.
    return (
        <Paper className={classes.root}>
            { content }
        </Paper>
    );
}

Markdown.propTypes = {
    text: PropTypes.string.isRequired
}

export default Markdown;
