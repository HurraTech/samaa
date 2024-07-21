import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home'
import MoreIcon from '@mui/icons-material/MoreVert';
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
import { Link, Redirect } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import clsx from 'clsx';
import { paperClasses } from "@mui/material/Paper";

import BrowserPage from './browser/BrowserPage'
import { create } from 'jss';
import Hidden from '@mui/material/Hidden';
import {
  createGenerateClassName,
  jssPreset,
  withStyles
} from '@mui/styles';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import blackThemeFile from './themes/black';
import HomePage from './home/HomePage';
import AppLoader from './appLoader/AppLoader';
import { JAWHAR_API  } from './constants';
import FilePreview from './components/FilePreview';
import Tooltip from '@mui/material/Tooltip';
import withRoute from "./withRoute";

const generateClassName = createGenerateClassName();

const drawerWidth = 240;

const PREFIX = 'App';
const classes = {
  root: `${PREFIX}-root`,
  grow: `${PREFIX}-grow`,
  appBar: `${PREFIX}-appBar`,
  appBarShift: `${PREFIX}-appBarShift`,
  menuButton: `${PREFIX}-menuButton`,
  title: `${PREFIX}-title`,
  search: `${PREFIX}-search`,
  searchIcon: `${PREFIX}-searchIcon`,
  inputRoot: `${PREFIX}-inputRoot`,
  inputInput: `${PREFIX}-inputInput`,
  sectionDesktop: `${PREFIX}-sectionDesktop`,
  sectionMobile: `${PREFIX}-sectionMobile`,
  drawerHeader: `${PREFIX}-drawerHeader`,
  hurraLogo: `${PREFIX}-hurraLogo`,
  hide: `${PREFIX}-hide`,
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${paperClasses.root}`,
  content: `${PREFIX}-content`,
  contentShift: `${PREFIX}-contentShift`,
  nested: `${PREFIX}-nested`,
  sourceNameText: `${PREFIX}-sourceNameText`,
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  }
}))

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    display: 'flex',
  },
  [`& .${classes.grow}`]: {
    flexGrow: 1,
  },
  [`& .${classes.appBar}`]: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('lg')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  [`& .${classes.appBarShift}`]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  [`& .${classes.menuButton}`]: {
    marginLeft: -12,
    marginRight: 20,
  },
  [`& .${classes.title}`]: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontFamily: 'Ubuntu',
      textTransform: 'lowercase',
      letterSpacing: '2px',
    },
  },
  [`& .${classes.search}`]: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  [`& .${classes.searchIcon}`]: {
    width: theme.spacing(9),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.inputRoot}`]: {
    color: 'inherit',
    width: '100%',
  },
  [`& .${classes.inputInput}`]: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing(10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  [`& .${classes.sectionDesktop}`]: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  [`& .${classes.sectionMobile}`]: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  [`& .${classes.drawerHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },


  [`& .${classes.hurraLogo}`]: {
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

  [`& .${classes.toolbar}`]: {
    backgroundColor: '#792333'
  },

  [`& .${classes.hide}`]: {
    display: 'none',
  },
  [`& .${classes.drawer}`]: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  [`& .${classes.content}`]: {
    flexGrow: 1,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  [`& .${classes.contentShift}`]: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },

  [`& .${classes.nested}`]: {
    paddingLeft: theme.spacing(4),
    maxWidth: `${drawerWidth}px`,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },

  [`& .${classes.sourceNameText}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: `${drawerWidth - 30}px`
  }

}))

const blackTheme = createTheme(blackThemeFile);

function AppWrapper(props) {
  return <ThemeProvider theme={blackTheme}><App {...props} /></ThemeProvider>;
}
  

const App = (props) => {
 
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sources, setSources] = useState([]);
  const [drives, setDrives] = useState([]);
  const [browserListOpen, setBrowserListOpen] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [pendingSourcesRequest, setPendingSourcesRequest] = useState(false);
  const [pendingAppsRequest, setPendingAppsRequest] = useState(false);
  const [apps, setApps] = useState(false);
  const [pendingStatsRequest, setPendingStatsRequest] = useState(false);
  const [stats, setStats] = useState(null);
  const theme = useTheme();
  let refreshDataTimer = null;

  const handleDrawerOpen = () => {
    setOpen(true)
  };

  const handleDrawerClose = () => {

    setOpen(false)
  };

  const handleBrowserClick = (event) => {
    event.preventDefault();
    setBrowserListOpen(!browserListOpen);
  };

  useEffect(() => {
    refreshData()
    refreshDataTimer = setInterval(()=> refreshData(), 2500);
    return () => {
      clearInterval(refreshDataTimer)
    }
  })

  const refreshData = (msg, data) => {

    if (! pendingSourcesRequest && (window.location.pathname.startsWith("/manage") || !appReady ))
    {
       setPendingSourcesRequest(true)
       axios
       .get(`${JAWHAR_API}/sources`)
       .then(res => {
           const response = res.data;
           var partitions = [].concat.apply([], response.map( d => d.Partitions))
           console.log("Sources", partitions)
           setAppReady(true)
           setSources(partitions) 
           setDrives(response)
           setPendingSourcesRequest(false)
       });
    }

   if (! pendingAppsRequest && window.location.pathname == "/")
   {
      setPendingAppsRequest(true)
      axios
       .get(`${JAWHAR_API}/apps`)
       .then(res => {
           const response = res.data;
           setApps(response)
           setPendingAppsRequest(false)
       });
   }

   if (! pendingStatsRequest && window.location.pathname == "/" )
   {
      setPendingStatsRequest(true)
      axios
       .get(`${JAWHAR_API}/system/stats`)
       .then(res => {
           const response = res.data;
           setStats(response)
           setPendingStatsRequest(false)
       });
    }
  }

  const transition = event => {
    if (event.currentTarget.pathname )
    {
      event.preventDefault();
      // history.push({
      //   pathname: event.currentTarget.pathname,
      //   search: event.currentTarget.search,
      // });
    }
  }

  const handlePartitionClick = event => {
    transition(event)
    if (props.onPartitionClick) {
      props.onPartitionClick(event.currentTarget.pathname)
    }
  }

  const onSearchBarKeyPress = event => {
    if (event.key === 'Enter') {
      let searchable = sources.filter(s => s.Status == "mounted" && s.IndexStatus != "")

      if (searchable.length > 0) {
        props.history.push({
          pathname: `/search/${searchable[0].Type}/${searchable[0].ID}`,
          search: `q=${event.target.value}`,
        });
      } else {
        alert("No mounted indices")
      }
    }
  };

  const firstSearchLink = () => {
    let searchable = sources.filter(s => s.Status == "mounted" && s.IndexStatus != "")
    if (searchable.length > 0)
      return `/search/${searchable[0].Type}/${searchable[0].ID}`
    else
      return false
  }

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  };

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget)
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  if (!appReady) {
    return <div />
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>
        <Link to={`/manage/`} style={{ textDecoration: 'none', color: 'black' }} onClick={handleMenuClose}>Manage Storage</Link>
      </MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
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
      <MenuItem onClick={handleProfileMenuOpen}>
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
        <div className={classes.hurraLogo} />
        <Hidden lgUp>
          <IconButton onClick={handleDrawerClose}>
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
          <ListItem onClick={handleDrawerClose} button key="Home" selected={props.history.location.pathname == "/"}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" style={{color:'black'}} />
          </ListItem>
      </Link>
        <Link to={`/appStore/`} style={{ textDecoration: 'none' }}>
          <ListItem onClick={handleDrawerClose} button key="AppStore" selected={props.history.location.pathname.startsWith(`/appStore/`)}>
            <ListItemIcon><AppsIcon /></ListItemIcon>
            <ListItemText primary="App Store" style={{color:'black'}} />
          </ListItem>
        </Link>
      <Divider />
      { firstSearchLink() ? (<Link to={`${firstSearchLink()}`} style={{ textDecoration: 'none' }}>
          <ListItem onClick={handleDrawerClose} button key="Search" selected={props.history.location.pathname.startsWith(`/search/`)}>
            <ListItemIcon><SearchIcon /></ListItemIcon>
            <ListItemText primary="Search" style={{color:'black'}} />
          </ListItem>
        </Link>) : (<Link to={`${firstSearchLink()}`}  className="disabledCursor" onClick={ (event) => event.preventDefault()} style={{ textDecoration: 'none' }}>
          <ListItem  button key="Search" selected={props.history.location.pathname.startsWith(`/search/`)}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <Tooltip title="You don't have any mounted storage with indices. Please either create indices to search or mount storages that you have already indexed.">
              <ListItemText primary="Search" style={{color:'black'}} />
            </Tooltip>
          </ListItem>
        </Link>)
      }
      <ListItem button key="Browse" selected={props.history.location.pathname.startsWith(`/browse/`)} onClick={handleBrowserClick}>
          <ListItemIcon><BrowserIcon /></ListItemIcon>
          <ListItemText primary="Cloud Drive" style={{color:'black'}} />
          {browserListOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={browserListOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            {sources.filter(s => s.Status == "mounted").map(source => {
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
                      <ListItem onClick={handleDrawerClose} button className={classes.nested}>
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
          <ListItem onClick={handleDrawerClose} button key="Manage" selected={props.history.location.pathname.startsWith(`/manage/`)}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Manage" style={{color:'black'}} />
          </ListItem>
        </Link>
    </List>
  </div>);

  return (
    <Root className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <Hidden lgUp>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerOpen}
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
              onKeyPress={onSearchBarKeyPress}
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
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton> */}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
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
        <StyledDrawer
          variant="temporary"
          anchor="left"
          open={open}
        >
          {drawerContent}
        </StyledDrawer>
      </Hidden>
      <Hidden mdDown>
        <StyledDrawer
          className={classes.drawer}
          variant="permanent"
          anchor="left"
          open
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          {drawerContent}
        </StyledDrawer>
      </Hidden>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Routes>
          <Route exact={true} path="/" element={<HomePage apps={apps} sources={sources} stats={stats} />}/> 
          <Route path="/browse/preview?/sources/:sourceType/:sourceID/*" element={<BrowserPageWrapper sources={sources} />} />
          {/* <Route path="/(browse|browse/preview)/sources/:sourceType/:sourceID/:path?/" element={<BrowserPageWrapper sources={sources} />} /> */}

          <Route path="/search/:sourceType/:sourceID/:action?" render={ ({match}) =>
                    (<SearchPage sources={sources}
                                selectSourceType={match.params.sourceType}
                                selectSourceID={match.params.sourceID} />) } />

          <Route path="/search/:sourceType/:sourceID/preview/:path+" render={({match}) => (
            <FilePreview
              open={true}
              onCloseClick={() => props.history.goBack()}
              file={match.params.path}
            />
          )}/>

          <Route path="/browse/preview/:path+" render={({match}) => (
            <FilePreview
              open={true}
              onCloseClick={() => props.history.goBack()}
              file={match.params.path}
            />
          )}/>

          <Route path="/manage" element={<SettingsPage sources={sources} drives={drives} />} />
          <Route path="/appStore" render={() => (<AppStorePage sources={sources} />)}/>
          <Route path="/apps/:auid+" render={({match}) => (<AppLoader auid={match.params.auid} />)}/>
        </Routes>
      </main>
    </Root>
  );
}

const BrowserPageWrapper = (props) => {
  let params = useParams();
  return (
    <BrowserPage sourceType={params.sourceType}
      sourceID={params.sourceID}
      source={props.sources.filter(s => s.Type == params.sourceType && s.ID == params.sourceID)[0]}
      path={`sources/${params.sourceType}/${params.sourceID}/${params["*"] || ""}/`} />)
}

// App.propTypes = {
//   classes: PropTypes.object.isRequired,
//   onNewSearch: PropTypes.func,
//   onPartitionClick: PropTypes.func
// };


export default withRoute(AppWrapper);
