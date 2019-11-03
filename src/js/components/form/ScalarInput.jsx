import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';


function ScalarInput(props) {
    const { para, onChange, value } = props;
    /**
     * Change handler for text field.
     */
    const handleChange = (event) => {
        onChange(para.id, event.target.value);
    }
    return (
        <TextField
            variant="outlined"
            margin="normal"
            required={para.required}
            fullWidth
            id={para.id}
            label={para.name}
            name={para.id}
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
