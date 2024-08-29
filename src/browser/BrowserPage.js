import React, { useRef, useEffect, useState, useReducer} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Alert  from '@mui/lab/Alert';
import axios from 'axios';
import FilePreview from '../components/FilePreview';
import BrowserTable from './BroswerTable';
import ProgressIndicator from '../components/ProgressIndicator';
import { JAWHAR_API  } from '../constants';
import Dropzone from 'react-dropzone'
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText} from '@mui/material'
import withRoute from "../withRoute";

const PREFIX = 'BrowserPage';

const classes = {
  paper: `${PREFIX}-paper`,
  searchBar: `${PREFIX}-searchBar`,
  error: `${PREFIX}-error`,
  searchInput: `${PREFIX}-searchInput`,
  block: `${PREFIX}-block`,
  addUser: `${PREFIX}-addUser`,
  contentWrapper: `${PREFIX}-contentWrapper`,
  progressWrapper: `${PREFIX}-progressWrapper`
};

const Root = styled('span')((
  {
    theme
  }
) => ({
  [`& .${classes.paper}`]: {
    maxWidth: '100%',
    margin: 'auto',
    overflow: 'hidden',
    height: "82vh",
  },

  [`& .${classes.searchBar}`]: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },

  [`& .${classes.error}`]: {
    marginBottom: "5px",
  },

  [`& .${classes.searchInput}`]: {
    fontSize: theme.typography.fontSize,
  },

  [`& .${classes.block}`]: {
    display: 'block',
  },

  [`& .${classes.addUser}`]: {
    marginRight: theme.spacing.unit,
  },

  [`& .${classes.contentWrapper}`]: {
    margin: '0px 0px',
    height: "100%",
  },

  [`& .${classes.progressWrapper}`]: {
    bottom: 0,
  }
}));

const BrowserPage = (props) => {

// class BrowserPage extends React.Component {
  // constructor(props) {
    // super(props);
    // var path = props.path
    // if (window.location.pathname.startsWith("/browse/preview")) {
    //   if (path.charAt(path.length - 1) == "/") 
    //     path = path.substr(0, path.length - 1);
    //   path = path.substring(0, path.lastIndexOf("/"))
    // }
    // console.log("Initial path is ", path)
    // state = {
    //   error: "",
    //   isInstantSearchEnabled: false,
    //   isPreviewOpen: false,
    //   isLoaded: false,
    //   previewedContent: [],
    //   openedFile: '',
    //   isInlineViewerOpen: false,
    //   previewedTitle: '',
    //   isAjaxInProgress: false,
    //   path: path,
    //   requestedItem: null,
    //   deleteConfirmDialog: false,
    //   selectedItem: {},
    //   items: [],
    //   searchTerms: [],
    // };
  // }
  const navigate = useNavigate()
  const location = useLocation()

  const [pendingRequest, setPendingRequest] = useState({ inProgress: false })
  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      error: "",
      isInstantSearchEnabled: false,
      isPreviewOpen: false,
      isLoaded: false,
      previewedContent: [],
      openedFile: '',
      isInlineViewerOpen: false,
      previewedTitle: '',
      isAjaxInProgress: false,
      path: location.pathname,
      requestedItem: null,
      deleteConfirmDialog: false,
      selectedItem: {},
      items: [],
      searchTerms: [],
    }
  )

  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) {
      componentDidUpdate()
    } else {
      didMountRef.current = true
      browse();
    }
  })

  useEffect(() => {
    browse()
  }, [location]);

  
  const handlePreviewCloseClick = () => {
    let backPath = state.path.substring(0, state.path.lastIndexOf("/"))
    console.log("Closing preview, going to this path", backPath)
    setState({
      isPreviewOpen: false,
      isInlineViewerOpen: false,
      openedFile: '',
      path: backPath
    });
    navigate(-1)

  }

  const componentDidUpdate = (prevProps) => {
    // if (props.path !== prevProps.path && !window.location.pathname.startsWith("/browse/preview")) {
    //   setState({
    //     path: props.path
    //   }, () => {
    //     console.log("Going to ", state.path)
    //     this.browse()
    //   })
    // }
  }

  const handlePreviewClick = index => {
    const highlighted_content =
      state.items[index].highlight &&
      state.items[index].highlight.content
        ? state.items[index].highlight.content
        : null;

    const full_content =
      state.items[index]._source.content &&
      state.items[index]._source.content.trim() != ''
        ? [state.items[index]._source.content.trim()]
        : null;
    const preview_content = highlighted_content || full_content;

    if (preview_content) {
      setState({
        isPreviewOpen: true,
        isInlineViewerOpen: false,
        openedFile: `${state.path}/${state.items[index].name}`,
        previewedContent: preview_content,
        previewedTitle: state.items[index]._source.file.filename,
      });
    }
  };

  const handleFilenameClick = item => {

    const is_dir = item.IsDir;
    const path = is_dir ? "/browse" + item.Path : "/browse/preview" + item.Path
    if (path == "..")
    {
      // Going one level up
      console.log("Going level up from ", state.path)
      path = state.path.substring(0, state.path.lastIndexOf("/"))
    }
    console.log(`Clicked on ${path}`)

    navigate({ pathname: path});
  };

  const handleDeleteClick = item => {
    console.log("Dialog to delete ", item)
    setState({
      selectedItem: item,
      deleteConfirmDialog: true
    })
  }

  const cancelDelete = () => {
    setState({
      deleteConfirmDialog: false,
      selectedItem: {},
    })
  }

  const confirmDelete = () => {
    console.log("Deleting", state.selectedItem.Path)
    axios.delete(`${JAWHAR_API}/${state.selectedItem.Path}`).then(res => {
      setState({
        selectedItem: {},
        deleteConfirmDialog: false,
      })
      browse()
    })


  }

  const uploadFiles = (files) => {
   for (var file of files) {
     console.log(`Uploading  :  ${file.path}`)

     const reader = new FileReader()

     reader.onabort = () => console.log('file reading was aborted')
     reader.onerror = () => console.log('file reading has failed')
     reader.onload = () => {
       var formData = new FormData();
       formData.append("file", reader.result);

       axios.post(`${JAWHAR_API}/${props.path}${file.path}`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
    //  reader.readAsDataURL(file)
      var formData = new FormData();
      formData.append("file", file);

      axios.post(`${JAWHAR_API}/${props.path}${file.path}`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        browse()
      })
    }
  }

  const appendSuffix = (string) => string.endsWith("/") ? string : `${string}/`

  const browse = () => {
      console.log("Set pending request to ", JAWHAR_API, location.pathname)
      setPendingRequest({inProgress: true, requestPath: `${JAWHAR_API}/${location.pathname}`})
  }

  useEffect(() => {
    if (pendingRequest.inProgress) {
      console.log("Making request to ", appendSuffix(pendingRequest.requestPath.replace("/browse", "")))
      axios.get(`${appendSuffix(pendingRequest.requestPath.replace("/browse", ""))}`).then(res => {
        const response = res.data;
        console.log("Response", response)
        setState({
          items: response.content || [],
          isInlineViewerOpen: false,
          isPreviewOpen: false});
      }).catch((error) => {
        var msg = ""
        var additionalInfo = ""
        var partitionName = props.source.Caption
        var path = state.path.replace(`sources/${props.sourceType}/${props.sourceID}`, partitionName)
        if (error.response && error.response.status == 401) {
          msg = ": Access Denied"
          additionalInfo = " - make sure files in the partition are readable"
        }
        setPendingRequest({inProgress: false})
        setState(
          {
            items: [],
            error: `<strong>Could not view requested ${path} ${msg}</strong>${additionalInfo}`,
            isInlineViewerOpen: false,
            isPreviewOpen: false,
          })
      });
    }

  }, [pendingRequest]);

  const { items } = state;
  return (
    <Root>
        {state.error != "" &&
          <Alert severity="error" className={classes.error}> <div dangerouslySetInnerHTML={{__html: state.error}} /></Alert>}

      <Dialog
        open={state.deleteConfirmDialog}
        onClose={cancelDelete.bind(this)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {state.deleteConfirmDialog && (<>
        <DialogTitle id="alert-dialog-title">{"Delete File(s)?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete <b>{state.selectedItem.Path.replace(/^.*[\\\/]/, '')}</b>? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete.bind(this)} color="primary" autoFocus>
            Cancel
          </Button>
          <Button onClick={this.confirmDelete.bind(this)} color="primary">
            Yes
          </Button>
        </DialogActions></>)
        }
      </Dialog>


      <Paper className={classes.paper}>
        <div className={classes.contentWrapper}>
        <Dropzone onDrop={acceptedFiles => this.uploadFiles(acceptedFiles)}>
          {({getRootProps, getInputProps, isDragActive}) => (
              <div {...getRootProps()} style={{height: "100%"}}>
                {/* <input {...getInputProps()} /> */}
                <Backdrop open={isDragActive} style={{zIndex: 1000}}>
                  <Typography variant="h4" component="h2" style={{color:"white"}}>
                    Drop Here to Upload Files
                  </Typography>
                  </Backdrop>
                <BrowserTable
                        rowCount={state.items.length}
                        rowGetter={({ index }) => ({ file: items[index] })}
                        onPreviewClick={handlePreviewClick}
                        onFilenameClick={handleFilenameClick}
                        classes={classes.table}
                        data={items}
                        searchTerms={state.searchTerms}
                        onDeleteClick={handleDeleteClick}
                        columns={[
                          {
                            width: 200,
                            flexGrow: 1.0,
                            label: 'File',
                            dataKey: 'file',
                            content: 'filename',
                          },
                          {
                            width: 100,
                            label: 'Size',
                            dataKey: 'file',
                            content: 'size',
                            numeric: true,
                          },
                          {
                            width: 150,
                            label: 'Created',
                            dataKey: 'file',
                            content: 'created',
                            numeric: true,
                          },
                          {
                            width: 40,
                            label: '',
                            dataKey: 'file',
                            content: 'downloadButton',
                          },
                          {
                            width: 40,
                            label: '',
                            dataKey: 'file',
                            content: 'deleteButton',
                          },

                        ]}
                      />
              </div>
          )}
        </Dropzone>
        </div>
      </Paper>
      <div className={classes.progressWrapper}>{state.isAjaxInProgress && <ProgressIndicator />}</div>
      <br/>
      <Alert severity="info">Drag and Drop Files Above to Upload Files</Alert>
      </Root>
  );
}

BrowserPage.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withRoute(BrowserPage);
