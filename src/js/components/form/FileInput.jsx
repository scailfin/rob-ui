import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';


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
    // Get the selected file value. If the value is null we use '' instead
    let selectedValue = value;
    if (selectedValue == null) {
        selectedValue = {file: '', as: ''};
    }
    /**
     * Change handler. The component value is an object with 'file' and 'as'
     * properties.
     */
    const handleChange = (event) => {
        const { name, value } = event.target;
        const modValue = {...selectedValue};
        modValue[name] = value;
        onChange(para.id, modValue);
    }
    // Create list of select items from file list
    const listItems = [];
    files.sort((f1, f2) => (f1.name.localeCompare(f2.name)));
    files.forEach((f) => (
        listItems.push(<MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)
    ));
    let textControl = null;
    if (para.as === '$input') {
        textControl = (
            <TextField
                variant="outlined"
                margin="normal"
                required={para.defaultValue != null}
                fullWidth
                id={para.id + '-as'}
                label={'Upload as ...'}
                name={'as'}
                value={selectedValue.as}
                onChange={handleChange}
            />
        );
    }
    return (
        <div>
            <FormControl className={classes.formControl}>
                <InputLabel id={para.id + '-label'}>
                    {para.name}
                </InputLabel>
                <Select
                    labelId={para.id + '-label'}
                    id={para.id}
                    name={'file'}
                    value={selectedValue.file}
                    onChange={handleChange}
                    autoWidth
                    required={para.required}
                >
                    {listItems}
                </Select>
            </FormControl>
            { textControl }
        </div>
    );
}

FileInput.propTypes = {
    files: PropTypes.array.isRequired,
    para: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object
}

export default FileInput;
