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
import Benchmark from './content/benchmark/Benchmark.jsx'
import BenchmarkListing from './content/benchmark/BenchmarkListing.jsx'
import Container from '@material-ui/core/Container';
import ErrorMessage from './util/ErrorMessage';
import Footer from './util/Footer.jsx';
import Spinner from './util/Spinner.jsx';
import SignIn from './content/SignIn.jsx';
import Topbar from './layout/Topbar';
import { fetchApi } from "../actions/App";
import theme from '../../theme';


const styles = {
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left'
    },
};


const mapStateToProps = state => {
  return {
      app: state.app,
      benchmark: state.benchmark
  };
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
        const { app, benchmark, classes } = this.props;
        const { apiError, isFetching, username } = app;
        const { selectedBenchmark } = benchmark;
        let content = null;
        let minorError = null;
        if (isFetching) {
            content = (<Spinner showLogo={true} />);
        } else if (apiError != null) {
            content = (
                <ErrorMessage error={apiError} isCritical={true} />
            );
        } else if (username == null) {
            content = (<SignIn />);
        } else if (selectedBenchmark != null){
            content = (<Benchmark />);
        } else {
            content = (<BenchmarkListing />);
        }
        return (
            <div>
                <Topbar />
                <Container className={classes.paper} maxWidth="xl">
                    { content }
                    { minorError }
                </Container>
                <Footer />
            </div>
        );
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
