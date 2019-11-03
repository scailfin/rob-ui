import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    }
}));


function FileInput(props) {
    const classes = useStyles();
    const { files, para, onChange, value} = props;
    const handleChange = (event) => {
        onChange(para.id, event.target.value);
    }
    // Get the selected file value. If the value is null we use '' instead
    let selectedValue = value;
    if (selectedValue == null) {
        selectedValue = '';
    }
    // Create list of select items from file list
    const listItems = [];
    files.sort((f1, f2) => (f1.name.localeCompare(f2.name)));
    files.forEach((f) => (
        listItems.push(<MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)
    ));
    return (
        <FormControl className={classes.formControl}>
            <InputLabel id={para.id + '-label'}>
                {para.name}
            </InputLabel>
            <Select
                labelId={para.id + '-label'}
                id={para.id}
                value={selectedValue}
                onChange={handleChange}
                autoWidth
                required={para.required}
            >
                {listItems}
            </Select>
        </FormControl>
    );
}

FileInput.propTypes = {
    files: PropTypes.array.isRequired,
    para: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string
}

export default FileInput;
