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
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';


const mapStateToProps = state => {
  return { app: state.app };
};


const APIFooter = ({app}) => {
    const {name, version, urls} = app;
    let apiInfo = null;
    if ((name != null) && (version != null) && (urls != null)) {
        apiInfo = (
            <span>
                {'Connected to '}
                <Link color="inherit" href={urls.home()}>
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
