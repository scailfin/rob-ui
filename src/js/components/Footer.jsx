import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


const mapStateToProps = state => {
  return { api: state.api };
};


const APIFooter = ({api}) => {
    const {name, version, urls} = api;
    let apiInfo = null;
    if ((name != null) && (version != null) && (urls != null)) {
        apiInfo = (
            <span>
                {'Connected to '}
                <Link color="inherit" href={urls.get('self')}>
                  {name}
                </Link>
                {' (Version ' + version + ').'}
            </span>
        );
    } else {
        apiInfo = (<span>{'Not connected.'}</span>);
    }
    return (
        <Box mt={8}>
            <Typography variant="body2" color="textSecondary" align="center">
                {apiInfo}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © NYU '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
  );
}

const Footer = connect(mapStateToProps)(APIFooter);

export default Footer;
