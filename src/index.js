import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './js/components/app/App.jsx';
import store from './js/store/index';
import theme from './theme';


render(
    <ThemeProvider theme={theme}>
        {/*
            CssBaseline kickstart an elegant, consistent, and simple baseline to
            build upon.
        */}
        <CssBaseline />
        <Provider store={store}>
            <App />
        </Provider>,
  </ThemeProvider>,
  document.querySelector('#root'),
);
