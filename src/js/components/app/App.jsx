/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ErrorMessage from './ErrorMessage.jsx';
import Footer from './Footer.jsx';
import Logo from './Logo.jsx';
import MainPanel from '../content/MainPanel';
import SignIn from './SignIn.jsx';
import Topbar from '../layout/Topbar';
import { fetchApi } from "../../actions/Api";
import theme from '../../../theme';


const styles = {
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
    },
};


const mapStateToProps = state => {
  return { app: state.app };
};

function mapDispatchToProps(dispatch) {
  return {
    fetchApi: () => dispatch(fetchApi())
  };
}


class App extends Component {
    componentDidMount() {
        this.props.fetchApi();
    }
    render() {
        const { app, classes } = this.props;
        const { fetching, username } = app;
        let content = null;
        if (fetching) {
            content = (<Logo />);
        } else if (username == null) {
            content = (<SignIn />);
        } else {
            content = (<MainPanel />);
        }
        return (
            <div>
                <Topbar />
                <Container className={classes.paper} maxWidth="xl">
                {content}
                </Container>
                <ErrorMessage />
                <Footer />
            </div>
        );
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
