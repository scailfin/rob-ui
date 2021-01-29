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
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';


function ScalarInput(props) {
    const { para, onChange, value } = props;
    /**
     * Change handler for text field.
     */
    const handleChange = (event) => {
        onChange(para.name, event.target.value);
    }
    return (
        <TextField
            variant="outlined"
            margin="normal"
            required={para.required}
            fullWidth
            id={para.name}
            label={para.name}
            name={para.name}
            value={value}
            onChange={handleChange}
        />
    );
}

ScalarInput.propTypes = {
    para: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}

export default ScalarInput;
