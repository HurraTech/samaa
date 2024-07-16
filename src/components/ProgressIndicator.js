import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function ProgressIndicator(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <LinearProgress color="secondary" />
    </div>
  );
}

ProgressIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressIndicator);
