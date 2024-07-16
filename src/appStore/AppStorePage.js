import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { Typography, DialogContent, DialogActions, DialogContentText, InputBase, List, ListItem, Avatar, SvgIcon, ListItemText, Divider, Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CardMedia from '@mui/material/CardMedia';
import { alpha } from '@mui/system/colorManipulator';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/material/styles';
import classNames from 'classnames';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AppBar from '@mui/material/AppBar';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { JAWHAR_API  } from '../constants';
import Utils from '../utils';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },

    inputRoot: {
        color: 'inherit',
        width: '100%',
      },

    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 8,
        transition: theme.transitions.create('width'),
        width: '100%',
        color: 'black',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },

    search: {
        position: 'absolute',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.5),
        },
        borderColor: alpha(theme.palette.common.black, 0.15),
        borderWidth: '1px',
        borderStyle: 'solid',
        marginLeft: 0,
        right: 10,
        marginRight: 0,
        paddingRight: 0,
        top: theme.spacing.unit * 0.5,
        [theme.breakpoints.up('sm')]: {
          width: 'auto',
        },
    },

    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    appMetadataContainer: {
        // padding: 15
    },
    appRow: {
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.5),
          }
    },


    appIcon: {
    },

    appMetadataLabelCell: {
        width: '180px'
    },

    appMetadataTable: {
        color: 'black',
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

    heading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        width: "150px"
    },

    secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    },

});



const ExpansionPanel = withStyles({
    root: {
      border: '1px solid rgba(0,0,0,.125)',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
    },
    expanded: {
      margin: 'auto',
    },
  })(Accordion);

const MyAccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0,0,0,.00)',
        borderBottom: '1px solid rgba(0,0,0,.125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            backgroundColor: 'rgba(0,0,0,.039)',
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
        margin: '12px 0',
        },
    },
    expanded: {},
})(props => <AccordionSummary {...props} />);

MyAccordionSummary.muiName = 'AccordionSummary';

const MyAccordionDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing.unit * 2,
      backgroundColor: 'rgba(0,0,0,.009)'
    },
}))(AccordionDetails);

class AppStorePage extends React.Component {

    constructor(props, context) {
        super(props)
        this.state = {
            selectedTab: 0,
            expandedApp: '',
            apps: []
        }
    }

    componentDidMount = () => {
        this.getStoreApplications()
    }

    getStoreApplications = () => {
        axios
        .get(`${JAWHAR_API}/apps/store`)
        .then(res => {
            const response = res.data;
            this.setState({ apps: response })
        })
    };


    expandApp = appName => (event, expanded) => {
        this.setState({
            expandedApp: expanded ? appName : false,
        });
      };

    installApp = app_id => () => {
        axios
        .post(`${JAWHAR_API}/apps/${app_id}`)
        .then(res => {
            this.getStoreApplications()
        })
    };

    changeTab = (event, selectedTab) => {
        this.setState({ selectedTab });
      };

    /* ---------- Render --------- */
    render() {
        const { classes } = this.props;
        const { selectedTab, expandedApp } = this.state
        return (
            <div>
            <AppBar position="static" color="default">
                <Tabs
                    value={selectedTab}
                    onChange={this.changeTab}
                    scrollButtons="on"
                    indicatorColor="primary"
                    textColor="primary"
                    className={classes.tabsPanel}
                >
                    <Tab label="Store" />
                    <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                </div>

                </Tabs>
            </AppBar>
            {selectedTab === 0 && <Paper square={true}>
               {this.state.apps.map(app => {
                 // let icon = Utils.jsonToElement("svg", app.icon)
                 return (
                    <ExpansionPanel expanded={expandedApp === app.ID} onChange={this.expandApp(app.ID)}>
                        <MyAccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <List>
                                <ListItem>
                                  <CardMedia dangerouslySetInnerHTML={{__html: app.Icon}}>
                                  </CardMedia>
                                    <ListItemText primary={app.Name}
                                            secondary={app.Description}
                                    />
                                </ListItem>
                            </List>
                        </MyAccordionSummary>
                        <MyAccordionDetails>
                            <List dense={true}>
                                <ListItem>
                                {app.LongDescription}
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Publisher</Typography>
                                    <Typography className={classes.secondaryHeading}>{app.Publisher}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Version</Typography>
                                    <Typography className={classes.secondaryHeading}>{app.Version}</Typography>
                                </ListItem>
                                <ListItem>
                                   <Button variant="contained" size="small" color="primary" onClick={this.installApp(app.UniqueID)} >
                                       <GetAppIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                       Install
                                   </Button>
                                </ListItem>
                            </List>
                        </MyAccordionDetails>
                    </ExpansionPanel>)
                 })}

                </Paper>
            }
            </div>
            );
    }

}

AppStorePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppStorePage);
