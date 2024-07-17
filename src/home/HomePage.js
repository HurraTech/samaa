import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { CardActions, SvgIcon, Typography, CardHeader, Button, ButtonBase, Select, MenuItem, List, ListItem } from '@mui/material'
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import { alpha } from '@mui/system/colorManipulator';
import OpenIcon from '@mui/icons-material/OpenInNew'
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FaceIcon from '@mui/icons-material/Face';
import RunningIcon from '@mui/icons-material/CheckCircle';
import Utils from '../utils';
import axios from '../axios';
import {Pie, Bar} from 'react-chartjs-2';
import { JAWHAR_API  } from '../constants';


const PREFIX = 'HomePage';

const classes = {
    root: `${PREFIX}-root`,
    card: `${PREFIX}-card`,
    chartCard: `${PREFIX}-chartCard`,
    details: `${PREFIX}-details`,
    content: `${PREFIX}-content`,
    cover: `${PREFIX}-cover`,
    title: `${PREFIX}-title`,
    dashboardHeading: `${PREFIX}-dashboardHeading`,
    playIcon: `${PREFIX}-playIcon`,
    appIcon: `${PREFIX}-appIcon`,
    leftIcon: `${PREFIX}-leftIcon`,
    rightIcon: `${PREFIX}-rightIcon`,
    iconSmall: `${PREFIX}-iconSmall`,
    chip: `${PREFIX}-chip`,
    appDescription: `${PREFIX}-appDescription`,
    appLoading: `${PREFIX}-appLoading`,
    indexChartTitle: `${PREFIX}-indexChartTitle`,
    progress: `${PREFIX}-progress`,
    selectDeviceGridItem: `${PREFIX}-selectDeviceGridItem`,
    heading: `${PREFIX}-heading`,
    secondaryHeading: `${PREFIX}-secondaryHeading`,
    noAppsMessage: `${PREFIX}-noAppsMessage`
};

const StyledGrid = styled(Grid)((
    {
        theme
    }
) => ({
    [`&.${classes.root}`]: {
        flexGrow: 1,
      },

    [`& .${classes.card}`]: {
      width: "100%",
      height: "100%",
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      // cursor: 'pointer',
      backgroundColor: alpha(theme.palette.common.white, 1),
      '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.02),
        },

    },

    [`& .${classes.chartCard}`]: {
        height: "100%",
    },

    [`& .${classes.details}`]: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justify: 'flex-start',
    },

    [`& .${classes.content}`]: {
      display: 'block',
      textAlign: 'initial',
      width: '200px',
    },

    [`& .${classes.cover}`]: {
      width: 151,
    },

    [`& .${classes.title}`]: {
      fontSize: 18,
    },

    [`& .${classes.dashboardHeading}`]: {
      fontSize: 20,
      fontWeight: 'bold'
    },

    [`& .${classes.playIcon}`]: {
      height: 38,
      width: 38,
    },

    [`& .${classes.appIcon}`]: {
      fontSize: '68px',
      marginLeft:'10px'
    },

    [`& .${classes.leftIcon}`]: {
      marginRight: theme.spacing.unit,
    },

    [`& .${classes.rightIcon}`]: {
      marginLeft: theme.spacing.unit,
    },

    [`& .${classes.iconSmall}`]: {
      fontSize: 20,
    },

    [`& .${classes.chip}`]: {
      marginTop: 4,
      marginLeft: 4,
      height: 23,
      fontSize: 12,
      fontWeight: 'bold'
    },

    [`& .${classes.appDescription}`]: {
        paddingTop: 0,
        paddingBottom: 2
    },

    [`& .${classes.appLoading}`]: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'white',
        opacity: '0.5',
        top: 0,
        left: 0,
        paddingLeft: '130px',
        paddingTop: '70px',
        zIndex: 10,
    },

    [`& .${classes.indexChartTitle}`]: {
        fontSize: 17,
        height: '100%',
        color: '#5c5c5c',
        paddingTop: "15px",
        textAlign: "center"
    },

    [`& .${classes.progress}`]: {
        color: 'black'
    },

    [`& .${classes.selectDeviceGridItem}`]: {
		margin: 'auto'
    },

    [`& .${classes.heading}`]: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        width: "150px"
    },

    [`& .${classes.secondaryHeading}`]: {
    	fontSize: theme.typography.pxToRem(15),
    },

    [`& .${classes.noAppsMessage}`]: {
        textAlign: 'center'
    }
}));


class HomePage extends React.Component {

    constructor(props, context) {
        super(props)
        this.state = {
            selectedTab: 0,
            expandedApp: '',
            apps: this.props.apps || [],
            sources: this.props.sources || [],
            capacityChartData: this.buildChartDataset(this.props.sources),
            indexChartData: this.buildIndexChartDataset(this.props.sources),
            selectedChartSource: null,
			stats : {
                loading: true,
				cpu_load: 0,
				memory_total: 0,
				memory_free: 0,
                memory_cached: 0,
                disk_reads: 0,
                disk_writes: 0,
			}
        }
    }

    buildIndexChartDataset(sources) {
      var indexedSources = sources.filter(s => s.Index !== null);
      var sourceNames = indexedSources.map(s => s.Name)
      var indexSizes = indexedSources.map(s => Utils.humanFileSizeMBRaw(s.IndexSizeBytes))

      const data = {
          labels: sourceNames,
          datasets: [
              {
                        label: 'Index Size (MB)',
                        backgroundColor: '#36A2EB',
                        backgrounColor: '#91d3ff',
                        borderWidth: 0,
                        hoverBackgroundColor: '#91d3ff',
                        data: indexSizes
              }

          ]

      };
      return data

    }

    buildChartDataset(sources, select=null) {
	    var dataset =  {
          labels: [
         		'Data (GB)',
         		'Free Space (GB)',
          ],
          datasets: [{
	      	data: [0,0],
          	backgroundColor: [
          	'#FF6384',
          	'#36A2EB',
            '#792333'
          	],
          	hoverBackgroundColor: [
          	'#FF6384',
          	'#36A2EB',
            '#792333'
          	]
          }]
         }
         console.log("Sources", sources)
        let source = sources[0]
        if (select != null) {
            source = sources.filter(s => s.ID == select)
            if (source.length > 0) source = source[0]
        }
        if (source !== null && source != undefined) {
	       dataset.datasets[0].data = [Utils.humanFileSizeGBRaw(source.SizeBytes-source.AvailableBytes), Utils.humanFileSizeGBRaw(source.AvailableBytes)]
           if (source.Type == "internal")
           {
              var indexedSources = sources.filter(s => s.IndexStatus !== "");
              var indexSizes = indexedSources.map(s => Utils.humanFileSizeGBRaw(s.IndexSizeBytes))
              var totalIndexSize = indexSizes.reduce((a,b) => parseInt(a)+ parseInt(b), 0)
              dataset.labels.push("Indices Data (GB)")
              dataset.datasets[0].data.push(totalIndexSize)
            }
        }

        return dataset
    }

	changeChartStorage = (selectedSource) => {
		this.setState({
            capacityChartData: this.buildChartDataset(this.props.sources, selectedSource),
            selectedChartSource: selectedSource,
		});
	}

    componentDidUpdate = (prevProps, prevState, snapshot) => {
      if (JSON.stringify(this.props.apps) != JSON.stringify(prevProps.apps)) {
            this.setState({
                apps: this.props.apps
            }, () => {
                this.forceUpdate()
            })
        }

       if (JSON.stringify(this.props.sources) != JSON.stringify(prevProps.sources)) {
           // figure out default selected source id
           let selectedChartSource = this.state.selectedChartSource
           if (this.state.selectedChartSource == null) {
               selectedChartSource = this.props.sources[0].ID
		   }
            this.setState({
                sources: this.props.sources,
                capacityChartData: this.buildChartDataset(this.props.sources, selectedChartSource),
                indexChartData: this.buildIndexChartDataset(this.props.sources),
                selectedChartSource: selectedChartSource,
            }, () => {
                this.forceUpdate()
            })
        }

		if (JSON.stringify(this.props.stats) != JSON.stringify(prevProps.stats)) {
            this.setState({
                stats: this.props.stats,
            }, () => {
                this.forceUpdate()
            })
        }
    }
    handleChange = prop => event => {
      this.setState({ [prop]: event.target.value });
    };

    expandApp = appName => (event, expanded) => {
        this.setState({
            expandedApp: expanded ? appName : false,
        });
      };

    changeTab = (event, selectedTab) => {
        this.setState({ selectedTab });
    };

    componentDidMount = () => {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!! osurces", this.props.sources)
         if (this.state.selectedChartSource == null && this.props.sources.length > 0) {
             this.setState({selectedChartSource: this.props.sources[0].ID})
		 }
    }

    getApplications = () => {
        axios
        .get(`${JAWHAR_API}/apps`)
        .then(res => {
            const response = res.data;
            this.setState({ apps: response })
        })
    };

    deleteApp = (app_id) => {
        var currentApps = [...this.state.apps]
        currentApps.find(a => a.UniqueID === app_id).status = "deleting"
        this.setState({apps: currentApps}, () => {
          axios
           .delete(`${JAWHAR_API}/apps/${app_id}`)
           .then(res => {
               this.getApplications()
           })
        })
    }

    /* ---------- Render --------- */
    render() {
        const { } = this.props;

        return (
            <StyledGrid container className={classes.root} spacing={2} alignItems="stretch">
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.dashboardHeading}>Dashboard</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.chartCard}>
                      <CardContent>
                        <Grid container spacing={2}>
				         	<Grid item xs={12}>
                               <Typography variant="h4" className={classes.dashboardHeading}>System Stats</Typography>
				         	</Grid>
				         	<Grid item xs={12} >
                            <List>
                            <ListItem>
                                    <Typography className={classes.heading}>Uptime</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}
                                        {!this.state.stats.loading && Utils.humanTimeDuration(this.state.stats["uptime"] || 0)}</Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>CPU Load</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                    {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}
                                    {!this.state.stats.loading && Math.round(this.state.stats["load_average"] || 0) + "%"}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Total Memory</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}
                                        {!this.state.stats.loading && Utils.humanFileSize(this.state.stats["memory_total"] || 0)}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Cached Memory</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}                                        
                                        {!this.state.stats.loading && Utils.humanFileSize(this.state.stats["memory_cached"] || 0)}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Free Memory</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}                                        
                                        {!this.state.stats.loading && Utils.humanFileSize(this.state.stats["memory_free"] || 0)}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Disk Reads</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}
                                        {!this.state.stats.loading && Utils.humanFileSize(this.state.stats["disk_reads"] || 0) + "/s"}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Disk Writes</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}                                        
                                        {!this.state.stats.loading && Utils.humanFileSize(this.state.stats["disk_writes"] || 0) + "/s"}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Network Sent</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}                                        
                                        {!this.state.stats.loading && Utils.humanFileSize(this.state.stats["network_sent"] || 0)}
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    <Typography className={classes.heading}>Network Received</Typography>
                                    <Typography className={classes.secondaryHeading}>
                                        {this.state.stats.loading && <CircularProgress color="secondary" size={20} />}                                        
                                        {!this.state.stats.loading && Utils.humanFileSize(this.state.stats["network_received"] || 0)}
                                    </Typography>
                                </ListItem>
                            </List>
				         	</Grid>
				     	</Grid>
				    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.chartCard}>
                      <CardContent>
                        <Grid container spacing={2}>
				         	<Grid item xs={12}>
                               <Typography variant="h4" className={classes.dashboardHeading}>Storage Usage</Typography><br/>
				               {/* <Pie data={this.state.capacityChartData} width="180" height="180"   options={{ maintainAspectRatio: false }} /> */}
				         	</Grid>
				         	<Grid item xs={12} className={classes.selectDeviceGridItem}>
							  <Select value={this.state.selectedChartSource}  onChange={(event) => this.changeChartStorage(event.target.value) }>
                      			{this.state.sources.map((source, index) => {
									return (
	                               	 <MenuItem value={source.ID} >{source.Caption}</MenuItem>)
									})
							    }
        					  </Select>
				         	</Grid>
				     	</Grid>
				    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Card className={classes.chartCard}>
                      <CardContent>
                        <Grid container spacing={2}>
				         	<Grid item xs={12}>
                               <Typography variant="h4" className={classes.dashboardHeading}>Index Storage Usage</Typography><br/>
				               {/* <Bar data={this.state.indexChartData} width="120" height="180"   options={{ maintainAspectRatio: false, indexAxis: 'y' }} /> */}
				         	</Grid>
				     	</Grid>
				        <Grid item xs={12} className={classes.selectDeviceGridItem}>
                            <Typography variant="subtitle" component="div" className={classes.indexChartTitle} >Storage Usage of Indices</Typography>
                        </Grid>
				    </CardContent>
                  </Card>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" className={classes.dashboardHeading}>Applications</Typography>
                    </Grid>
                    { this.state.apps.length == 0 &&
                        <Grid item xs={12}>
                            <Typography variant="h6" component="div" className={classes.noAppsMessage}>You do not have any installed applications. Visit the App Store to install applications.</Typography>
                        </Grid> }
                      {this.state.apps.map(app => { return (
                          <Grid key={app.UniqueID} item xs={12} sm={5} md={4}>
                              <Card className={classes.card}>
                                      {app.Status != "installed" &&
                                          <div className ={classes.appLoading} >
                                              <CircularProgress className={classes.progress} />
                                          </div>}
                                      <div className={classes.cardButton}>
                                          <div className={classes.details}>
                                              <CardMedia dangerouslySetInnerHTML={{__html: app.Icon}} />
                                              <CardContent className={classes.content}>
                                                  <Typography variant="h6" className={classes.title}>{app.Name}</Typography>

                                              </CardContent>
                                          </div>
                                          <CardContent className={classes.appDescription} >
                                              <Typography variant="subtitle2" color="textSecondary">
                                                  {app.Description}
                                              </Typography>
                                          </CardContent>
                                          <CardActions>
                                              <Button variant="contained" size="small" color="primary" component={Link} to={`/apps/${app.UniqueID}`} style={{textDeocration: 'none'}}>
                                              <OpenIcon className={clsx(classes.leftIcon, classes.iconSmall)} disabled={true} />
                                                  Open
                                              </Button>
                                              <Button variant="contained"  size="small" color="secondary" onClick={() => this.deleteApp(app.UniqueID)} >Delete</Button>
                                          </CardActions>
                                      </div>
                              </Card>
                          </Grid>)
                        })
                      }
            </Grid>
        </StyledGrid>
        );
    }

}

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (HomePage);
