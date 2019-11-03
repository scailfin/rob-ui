import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 700,
    },
}));


function Leaderboard(props) {
    const classes = useStyles();
    const { leaderboard } = props;
    const { schema, ranking } = leaderboard;
    const headline = [];
    headline.push(<TableCell key={'col'}>Submission</TableCell>);
    for (let i = 0; i < schema.length; i++) {
        const col = schema[i];
        let align = 'right';
        if (col.type === 'string') {
            align = 'left'
        }
        headline.push(
            <TableCell key={'col-' + col.id} align={align}>
                {col.name}
            </TableCell>
        );
    }
    const rows = [];
    for (let i = 0; i < ranking.length; i++) {
        const run = ranking[i];
        const cells = [];
        cells.push(
            <TableCell key={'col'} align='left'>
                {run.submission.name}
            </TableCell>
        );
        for (let j = 0; j < schema.length; j++) {
            const col = schema[j];
            let align = 'right';
            if (col.type === 'string') {
                align = 'left'
            }
            cells.push(
                <TableCell key={'col-' + col.id} align={align}>
                    {run.results[j].value}
                </TableCell>
            );
        }
        rows.push(<TableRow key={i}>{cells}</TableRow>);
    }
    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        {headline}
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rows }
                </TableBody>
            </Table>
        </Paper>
  );
}


Leaderboard.propTypes = {
  leaderboard: PropTypes.object.isRequired,
};


export default Leaderboard;