import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/material/styles';
import { CardActions, SvgIcon, Typography, CardHeader, Button, ButtonBase } from '@mui/material'
import {Link} from 'react-router-dom';
import classNames from 'classnames';
import { alpha } from '@mui/system/colorManipulator';
import OpenIcon from '@mui/icons-material/OpenInNew'
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import RunningIcon from '@mui/icons-material/CheckCircle';
import Iframe from 'react-iframe';
import { JAWHAR_API } from '../constants';

const styles = theme => ({
    root: {
        flexGrow: 1,
      },
      card: {
        width: 300,
        display: 'flex',
        alignItems: 'center',
        // cursor: 'pointer',
        backgroundColor: alpha(theme.palette.common.white, 1),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.02),
          },

      },
      cardButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
      },

      details: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justify: 'flex-start',
      },

      content: {
        display: 'block',
        textAlign: 'initial',
        width: '200px',
      },

      cover: {
        width: 151,
      },
      title: {
        fontSize: 18,
      },
      playIcon: {
        height: 38,
        width: 38,
      },

      appIcon: {
        fontSize: '68px',
        marginLeft:'10px'
      },
      leftIcon: {
        marginRight: theme.spacing.unit,
      },
      rightIcon: {
        marginLeft: theme.spacing.unit,
      },
      iconSmall: {
        fontSize: 20,
      },

      chip: {
        marginTop: 4,
        marginLeft: 4,
        height: 23,
        fontSize: 12,
        fontWeight: 'bold'
      },

      appDescription: {
          paddingTop: 0,
          paddingBottom: 2
      }


});


class AppLoader extends React.Component {

    constructor(props, context) {
        super(props)
        console.log(props)
        this.state = {
            port: 0,
            auid: props.auid,
        }
    }


    /* ---------- Render --------- */
    render() {
        const { classes } = this.props;
        return (
            <Iframe
            url={`${JAWHAR_API}/apps/${this.state.auid}/webapp/`}
            width="100%"
            height="100vh"
            display="initial"
            align="center"
            position="relative"
            allowFullScreen
          />
        );
    }

}

AppLoader.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppLoader);
