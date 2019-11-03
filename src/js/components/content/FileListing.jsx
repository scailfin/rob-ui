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
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
            items.push(
                <SyntaxHighlighter key={'content'} language="javascript" style={dark}>
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
