import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { alpha } from '@mui/system/colorManipulator';
import { withStyles } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home'
import MoreIcon from '@mui/icons-material/MoreVert';
import classNames from 'classnames';
import axios from 'axios';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BrowserIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SearchPage from './search/SearchPage';
import SettingsPage from './settings/SettingsPage'
import AppStorePage from './appStore/AppStorePage'
import { Route, Link, Redirect } from 'react-router-dom';
import BrowserPage from './browser/BrowserPage'
import { create } from 'jss';
import Hidden from '@mui/material/Hidden';
import {
  createGenerateClassName,
  jssPreset
} from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import blackThemeFile from './themes/black';
import HomePage from './home/HomePage';
import AppLoader from './appLoader/AppLoader';
import { JAWHAR_API  } from './constants';
import FilePreview from './components/FilePreview';
import Tooltip from '@mui/material/Tooltip';
import withRoute from "./withRoute";

const jss = create({
  ...jssPreset(),
  insertionPoint: 'jss-insertion-point',
});

const generateClassName = createGenerateClassName();

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    display: 'flex',
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontFamily: 'Ubuntu',
      textTransform: 'lowercase',
      letterSpacing: '2px',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
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

  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },


  hurraLogo: {
    [theme.breakpoints.up('lg')]: {
      backgroundPosition: "50%",
    },
    [theme.breakpoints.down('md')]: {
      backgroundPosition: "65%",
    },

    backgroundImage: "url(/icons/logo.svg)",
    display: "inline-block",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    fontSize: "125px",
    width: "100%",
    height: "50px",
  },

  toolbar: {
    backgroundColor: '#792333'
  },

  hide: {
    display: 'none',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0px 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    paddingTop: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },

  nested: {
    paddingLeft: theme.spacing.unit * 4,
    maxWidth: `${drawerWidth}px`,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  sourceNameText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: `${drawerWidth - 30}px`
  }

});

class App extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    open: false,
    searchQuery: '',
    currentPage: 0,
    sources: [],
    drives: [],
    browserListOpen: true,
    appReady: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    console.log("Drawer close")
    this.setState({ open: false });
  };

  handleBrowserClick = (event) => {
    event.preventDefault();
    this.setState(state => ({ browserListOpen: !state.browserListOpen }));
  };

  componentDidMount() {
    this.refreshData()
    this.refreshDataTimer = setInterval(()=> this.refreshData(), 2500);
  }

  componentWillUnmount() {
    clearInterval(this.refreshDataTimer)
  }

  refreshData = (msg, data) => {

    if (! this.state.pendingSourcesRequest && (window.location.pathname.startsWith("/manage") || !this.state.appReady ))
    {
       this.setState({pendingSourcesRequest: true})
       axios
       .get(`${JAWHAR_API}/sources`)
       .then(res => {
           const response = res.data;
           var partitions = [].concat.apply([], response.map( d => d.Partitions))
           console.log("Sources", partitions)
           this.setState({ appReady: true, sources: partitions, drives: response, pendingSourcesRequest: false  })
       });
    }

   if (! this.state.pendingAppsRequest && window.location.pathname == "/")
   {
      this.setState({pendingAppsRequest: true})
      axios
       .get(`${JAWHAR_API}/apps`)
       .then(res => {
           const response = res.data;
           this.setState({ apps: response, pendingAppsRequest: false })
       });
   }

   if (! this.state.pendingStatsRequest && window.location.pathname == "/" )
   {
      this.setState({pendingStatsRequest: true})
      axios
       .get(`${JAWHAR_API}/system/stats`)
       .then(res => {
           const response = res.data;
           console.log("STATS!!!", response)
           this.setState({ stats: response, pendingStatsRequest: false })
       });
    }
  }

  transition = event => {
    if (event.currentTarget.pathname )
    {
      event.preventDefault();
      // history.push({
      //   pathname: event.currentTarget.pathname,
      //   search: event.currentTarget.search,
      // });
    }
  }

  handlePartitionClick = event => {
    this.transition(event)
    if (this.props.onPartitionClick) {
      this.props.onPartitionClick(event.currentTarget.pathname)
    }
  }

  onSearchBarKeyPress = event => {
    if (event.key === 'Enter') {
      let searchable = this.state.sources.filter(s => s.Status == "mounted" && s.IndexStatus != "")

      if (searchable.length > 0) {
        this.props.history.push({
          pathname: `/search/${searchable[0].Type}/${searchable[0].ID}`,
          search: `q=${event.target.value}`,
        });
      } else {
        alert("No mounted indices")
      }
    }
  };

  firstSearchLink = () => {
    let searchable = this.state.sources.filter(s => s.Status == "mounted" && s.IndexStatus != "")
    if (searchable.length > 0)
      return `/search/${searchable[0].Type}/${searchable[0].ID}`
    else
      return false
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl, open } = this.state;
    const { classes, theme } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const blackTheme = createTheme(blackThemeFile);

    if (!this.state.appReady) {
      return <div />
    }

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem>
          <Link to={`/manage/`} style={{ textDecoration: 'none', color: 'black' }} onClick={this.handleMenuClose}>Manage Storage</Link>
        </MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
              <SettingsIcon />
          </IconButton>
          <p>Manage</p>
        </MenuItem>
        {/* <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem> */}
      </Menu>
    );

    const drawerContent = (          
      <div>
        <div className={classes.drawerHeader}>
        <div class="hurralogo" className={classes.hurraLogo} />
        <Hidden lgUp>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </Hidden>
      </div>

      <Divider />
      <List>
        <Link to={`/`} style={{ textDecoration: 'none' }}>
            <ListItem onClick={this.handleDrawerClose} button key="Home" selected={this.props.history.location.pathname == "/"}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" style={{color:'black'}} />
            </ListItem>
        </Link>
          <Link to={`/appStore/`} style={{ textDecoration: 'none' }}>
            <ListItem onClick={this.handleDrawerClose} button key="AppStore" selected={this.props.history.location.pathname.startsWith(`/appStore/`)}>
              <ListItemIcon><AppsIcon /></ListItemIcon>
              <ListItemText primary="App Store" style={{color:'black'}} />
            </ListItem>
          </Link>
        <Divider />
        { this.firstSearchLink() ? (<Link to={`${this.firstSearchLink()}`} style={{ textDecoration: 'none' }}>
            <ListItem onClick={this.handleDrawerClose} button key="Search" selected={this.props.history.location.pathname.startsWith(`/search/`)}>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Search" style={{color:'black'}} />
            </ListItem>
          </Link>) : (<Link to={`${this.firstSearchLink()}`}  className="disabledCursor" onClick={ (event) => event.preventDefault()} style={{ textDecoration: 'none' }}>
            <ListItem  button key="Search" selected={this.props.history.location.pathname.startsWith(`/search/`)}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <Tooltip title="You don't have any mounted storage with indices. Please either create indices to search or mount storages that you have already indexed.">
                <ListItemText primary="Search" style={{color:'black'}} />
              </Tooltip>
            </ListItem>
          </Link>)
        }
        <ListItem button key="Browse" selected={this.props.history.location.pathname.startsWith(`/browse/`)} onClick={this.handleBrowserClick}>
            <ListItemIcon><BrowserIcon /></ListItemIcon>
            <ListItemText primary="Cloud Drive" style={{color:'black'}} />
            {this.state.browserListOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.browserListOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
              {this.state.sources.filter(s => s.Status == "mounted").map(source => {
                let icon_class = "fas fa-database"
                if (source.IsRemovable)
                  icon_class = "fab fa-usb"
                // else if (source.source_type == "internal")
                //   icon_class = "fab fa-hdd"
                // return source.drive_partitions.filter(p => p.status == "mounted").map(partition => {
                    return <Link
                    to={`/browse/sources/${source.Type}/${source.ID}/`}
                    style={{ textDecoration: 'none', color:'black' }}
                    >
                        <ListItem onClick={this.handleDrawerClose} button className={classes.nested}>
                          <div style={{float:'left'}}><span
                              className={`${icon_class}`}
                              style={{ marginRight: '0.5em', width:'10px', }}
                              />
                            </div>
                          <ListItemText inset primary={source.Caption} className={classes.sourceNameText} />
                      </ListItem>
                      </Link>
                // })
              })}
            </List>
          </Collapse>
          <Divider />
          <Link to={`/manage/`} style={{ textDecoration: 'none' }}>
            <ListItem onClick={this.handleDrawerClose} button key="Manage" selected={this.props.history.location.pathname.startsWith(`/manage/`)}>
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary="Manage" style={{color:'black'}} />
            </ListItem>
          </Link>
      </List>
    </div>);

    return (
    <ThemeProvider theme={blackTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar className={classes.toolbar}>
            <Hidden lgUp>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography
              className={classes.title}
              variant="h6"
              color="inherit"
              noWrap
            >
              Hurra Cloud
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search your files"
                onKeyPress={this.onSearchBarKeyPress}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>

              {/* <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton> */}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        <Hidden lgUp>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="temporary"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}  
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <Hidden mdDown>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawerContent}
          </Drawer>
        </Hidden>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Route exact={true} path="/" render={() => (<HomePage apps={this.state.apps} sources={this.state.sources} stats={this.state.stats} />)}/>
          <Route path="/(browse|browse/preview)/sources/:sourceType/:sourceID/:path*" render={({match}) =>
                    (<BrowserPage sourceType={match.params.sourceType}
                                  sourceID={match.params.sourceID}
                                  source={this.state.sources.filter(s => s.Type == match.params.sourceType && s.ID == match.params.sourceID)[0]}
                                  path={`sources/${match.params.sourceType}/${match.params.sourceID}/${match.params.path || ""}/`} />)}/>

          <Route path="/search/:sourceType/:sourceID/:action?" render={ ({match}) =>
                    (<SearchPage sources={this.state.sources}
                                 selectSourceType={match.params.sourceType}
                                 selectSourceID={match.params.sourceID} />) } />

          <Route path="/search/:sourceType/:sourceID/preview/:path+" render={({match}) => (
            <FilePreview
              open={true}
              onCloseClick={() => this.props.history.goBack()}
              file={match.params.path}
            />
          )}/>

          <Route path="/browse/preview/:path+" render={({match}) => (
            <FilePreview
              open={true}
              onCloseClick={() => this.props.history.goBack()}
              file={match.params.path}
            />
          )}/>

          <Route path="/manage" render={() => (<SettingsPage sources={this.state.sources} drives={this.state.drives} />)}/>
          <Route path="/appStore" render={() => (<AppStorePage sources={this.state.sources} />)}/>
          <Route path="/apps/:auid+" render={({match}) => (<AppLoader auid={match.params.auid} />)}/>
        </main>
      </div>
  </ThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  onNewSearch: PropTypes.func,
  onPartitionClick: PropTypes.func
};

export default withRoute(withStyles(styles, { withTheme: true })(App));
