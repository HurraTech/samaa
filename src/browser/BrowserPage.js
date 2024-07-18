import React from 'react';
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

class BrowserPage extends React.Component {
  constructor(props) {
    super(props);
    var path = props.path
    if (window.location.pathname.startsWith("/browse/preview")) {
      if (path.charAt(path.length - 1) == "/") 
        path = path.substr(0, path.length - 1);
      path = path.substring(0, path.lastIndexOf("/"))
    }
    console.log("Initial path is ", path)

    this.state = {
      error: "",
      isInstantSearchEnabled: false,
      isPreviewOpen: false,
      isLoaded: false,
      previewedContent: [],
      openedFile: '',
      isInlineViewerOpen: false,
      previewedTitle: '',
      isAjaxInProgress: false,
      path: path,
      requestedItem: null,
      deleteConfirmDialog: false,
      selectedItem: {},
      items: [],

      searchTerms: [],
    };
  }

  handlePreviewCloseClick() {
    let backPath = this.state.path.substring(0, this.state.path.lastIndexOf("/"))
    console.log("Closing preview, going to this path", backPath)
    this.setState({
      isPreviewOpen: false,
      isInlineViewerOpen: false,
      openedFile: '',
      path: backPath
    });
    this.props.history.goBack()

  }

  componentDidUpdate(prevProps) {
    if (this.props.path !== prevProps.path && !window.location.pathname.startsWith("/browse/preview")) {
      this.setState({
        path: this.props.path
      }, () => {
        console.log("Going to ", this.state.path)
        this.browse()
      })
    }
  }

  handlePreviewClick = index => {
    const highlighted_content =
      this.state.items[index].highlight &&
      this.state.items[index].highlight.content
        ? this.state.items[index].highlight.content
        : null;

    const full_content =
      this.state.items[index]._source.content &&
      this.state.items[index]._source.content.trim() != ''
        ? [this.state.items[index]._source.content.trim()]
        : null;
    const preview_content = highlighted_content || full_content;

    if (preview_content) {
      this.setState({
        isPreviewOpen: true,
        isInlineViewerOpen: false,
        openedFile: `${this.state.path}/${this.state.items[index].name}`,
        previewedContent: preview_content,
        previewedTitle: this.state.items[index]._source.file.filename,
      });
    }
  };

  handleFilenameClick = index => {
    const is_dir = this.state.items[index].IsDir;
    const path = is_dir ? "/browse" + this.state.items[index].Path : "/browse/preview" + this.state.items[index].Path
    if (path == "..")
    {
      // Going one level up
      console.log("Going level up from ", this.state.path)
      path = this.state.path.substring(0, this.state.path.lastIndexOf("/"))
    }
    console.log(`Clicked on ${path}`)

    this.props.history.push({ pathname: path});
  };

  handleDeleteClick = index => {
    console.log("Dialog to delete ", this.state.items[index])
    this.setState({
      selectedItem: this.state.items[index],
      deleteConfirmDialog: true
    }, () => {
      console.log("SELECTED ITEM SET TO ", this.state.selectedItem)
    })
  }

  cancelDelete() {
    this.setState({
      deleteConfirmDialog: false,
      selectedItem: {},
    })
  }

  confirmDelete() {
    console.log("Deleting", this.state.selectedItem.Path)
    axios.delete(`${JAWHAR_API}/${this.state.selectedItem.Path}`).then(res => {
      this.setState({
        selectedItem: {},
        deleteConfirmDialog: false,
      })
      this.browse()
    })


  }

  componentDidMount() {
    this.browse();
  }

  uploadFiles(files) {
   for (var file of files) {
     console.log(`Uploading  :  ${file.path}`)

     const reader = new FileReader()

     reader.onabort = () => console.log('file reading was aborted')
     reader.onerror = () => console.log('file reading has failed')
     reader.onload = () => {
       var formData = new FormData();
       formData.append("file", reader.result);

       axios.post(`${JAWHAR_API}/${this.props.path}${file.path}`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
    //  reader.readAsDataURL(file)
      var formData = new FormData();
      formData.append("file", file);

      axios.post(`${JAWHAR_API}/${this.props.path}${file.path}`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.browse()
      })
    }
  }

  browse() {
    return new Promise((resolve, reject) => {
      this.setState({isAjaxInProgress: true}, () => {
        console.log("Making request to ", JAWHAR_API, this.state.path)
        axios.get(`${JAWHAR_API}/${this.state.path}`).then(res => {
          const response = res.data;
          console.log("Response", response)
          this.setState(
            {
              items: response.content || [],
              isInlineViewerOpen: false,
              isPreviewOpen: false,
              isAjaxInProgress: false
            },
            () => {
              resolve(response.content);
            },
          );
        }).catch((error) => {
          var msg = ""
          var additionalInfo = ""
          var partitionName = this.props.source.Caption
          var path = this.state.path.replace(`sources/${this.props.sourceType}/${this.props.sourceID}`, partitionName)
          if (error.response && error.response.status == 401) {
            msg = ": Access Denied"
            additionalInfo = " - make sure files in the partition are readable"
          }
          this.setState(
            {
              items: [],
              error: `<strong>Could not view requested ${path} ${msg}</strong>${additionalInfo}`,
              isInlineViewerOpen: false,
              isPreviewOpen: false,
              isAjaxInProgress: false
            },
            () => {
              resolve([]);
            })
        });
      })
    });
  }

  render() {
    const { } = this.props;
    const { items } = this.state;
    return (
      <Root>
          {this.state.error != "" &&
            <Alert severity="error" className={classes.error}> <div dangerouslySetInnerHTML={{__html: this.state.error}} /></Alert>}

        <Dialog
          open={this.state.deleteConfirmDialog}
          onClose={this.cancelDelete.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {this.state.deleteConfirmDialog && (<>
          <DialogTitle id="alert-dialog-title">{"Delete File(s)?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete <b>{this.state.selectedItem.Path.replace(/^.*[\\\/]/, '')}</b>? This cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete.bind(this)} color="primary" autoFocus>
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
                          rowCount={this.state.items.length}
                          rowGetter={({ index }) => ({ file: items[index] })}
                          onPreviewClick={this.handlePreviewClick}
                          onFilenameClick={this.handleFilenameClick}
                          classes={classes.table}
                          data={items}
                          searchTerms={this.state.searchTerms}
                          onDeleteClick={this.handleDeleteClick}
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
        <div class={classes.progressWrapper}>{this.state.isAjaxInProgress && <ProgressIndicator />}</div>
        <br/>
        <Alert severity="info">Drag and Drop Files Above to Upload Files</Alert>
        </Root>
    );
  }
}

BrowserPage.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withRoute((BrowserPage));
