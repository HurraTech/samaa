import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import CloudIcon from '@material-ui/icons/Cloud';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import classNames from 'classnames';
import $ from 'jquery'
import Utils from '../utils'
import Button from '@material-ui/core/Button';
import MountIcon from '@material-ui/icons/PlayForWork'
import UnmountIcon from '@material-ui/icons/EjectRounded'
import DisconnectIcon from '@material-ui/icons/LinkOff'
import ReconnectIcon from '@material-ui/icons/Link'
import IndexIcon from '@material-ui/icons/DescriptionOutlined'
import Tooltip from '@material-ui/core/Tooltip';
import IndexDialog from './IndexDialog';
import AlertDialog from '../components/AlertDialog'
import PauseIcon from '@material-ui/icons/Pause'
import ResumeIcon from '@material-ui/icons/PlayArrowRounded'
import DeleteIcon from '@material-ui/icons/DeleteRounded'
import FileCopy from '@material-ui/icons/FileCopy'

import BuildIcon from '@material-ui/icons/BuildRounded'
import CancelIcon from '@material-ui/icons/CancelPresentation'
import CircularProgress from '@material-ui/core/CircularProgress';
import NewWindow from 'react-new-window'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { JAWHAR_API } from '../constants';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },

    tableDescriptionWrapper: {
        padding: "15px",
        fontSize: '11pt',
        backgroundColor: 'white',
    },

    descriptionTitle: {
        fontSize: '13pt',
    },

    descriptionContent: {
        paddingRight: '15px',
        lineHeight: '22px',
        fontFamily: 'Tahoma'
    },

    fabWrapper: {
        padding: 'relative',
        float: 'right',
        marginTop: '-25px',
        marginRight: '35px',
        zIndex: 999
    },

    createButton: {
        position: 'absolute',
        zIndex: 999,
        marginRight: '-10px'
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

    tableButton: {
        margin: theme.spacing.unit,
    },

    sourceRow: {
        backgroundColor: 'white',
    },


    driveRow: {
        backgroundColor: '#ededed',
    },

    tableHeader: {
        backgroundColor: theme.palette.grey[900],
        color: 'white',
        height: '32px',
        fontSize: '11pt',
        padding :0,
    },

    bodyCell: {
        padding: 10
    },

    iconCell: {
        maxWidth: '35px',
        padding: '0px',
        paddingLeft: '15px',
        paddingRight: '15px'
    },

    nameCell: {
        padding: '0px',
        width: '250px'
    },

    capacityCell: {
        width: '100px'
    },

    availableCell: {
        width: '100px'
    },

    actionsCell: {
        minWidth:'300px'
    },

    headerCell: {

    },

    indexCell: {
        width: '350px',
        padding: '0px',
    },

    toolsCell: {
        width:'30px'
    },

    indexTools: {
        float: 'right',
        clear: 'both'
    },

    progress: {
        marginTop: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 5,
        padding:'2px'
      },

      dialogContent: {
          padding:0,
          lineHeight: "25px",
          fontFamily: "'Courier New', Courier, monospace",
          marginTop: "-12px",
          fontSize: "14px",
      }

});
class SettingsPage extends React.Component {

    constructor(props, context) {
        super(props)
        this.state = {
            indices: [],
            sources: this.props.sources || [],
            indexDialogOpen: false,
            selectedSource: {},
            unmountAlertOpen: false,
            addDialogOpen: false,
            googleAuthConsentOpen: false,
            consentFlowState: "",
            toolDialogOpen: false,
            toolDialogState: "",
            drives: [],
        }
    }

    static prettyTypeName(name) {
        switch(name) {
            case "usb":
                return "Removable Media (USB)"
            case "internal_storage":
                return "Internal Storage"
            case "system":
                return "System Storage"
        }
    }

    handleMountClick(source) {
        var currentSources = [...this.state.sources]
        let source_id = source.ID
        currentSources.find(s => s.ID === source_id).Status = "mounting"
        this.setState({sources: currentSources}, () => {
            axios.post(`${JAWHAR_API}/sources/${source.Type}/${source_id}/mount`)
        })
    }

    handlePauseClick(source) {
        var currentSources = [...this.state.sources]
        currentSources.find(s => s.ID === source.ID).IndexStatus = "pausing"
        this.setState({sources: currentSources}, () => {
            axios.post(`${JAWHAR_API}/sources/${source.Type}/${source.ID}/pauseIndex`)
        })
    }

    handleResumeClick(source) {
        var currentSources = [...this.state.sources]
        currentSources.find(s => s.ID === source.ID).IndexStatus = "resuming"
        this.setState({sources: currentSources}, () => {
            axios.post(`${JAWHAR_API}/sources/${source.Type}/${source.ID}/resumeIndex`)
        })
    }

    /* --------- Cancel Index ----------- */
    handleCancelClick(source) {
        this.setState({ cancelIndexAlertOpen: true, selectedSource: source });
    }

    doCancelIndex(source) {
        var currentSources = [...this.state.sources]
        currentSources.find(s => s.ID === source.ID).IndexStatus = "deleting"
        this.setState({sources: currentSources}, () => {
            axios.delete(`${JAWHAR_API}/sources/${source.Type}/${source.ID}/index`)
        })
    }

    confirmCancelAlert = () => {
        this.doCancelIndex(this.state.selectedSource);
        this.setState({ cancelIndexAlertOpen: false });
    }

    cancelCancelAlert = () => {
        this.setState({ cancelIndexAlertOpen: false });
    }

    /* --------- Delete Index ----------- */
    handleDeleteIndexClick(source) {
        this.setState({ deleteIndexAlertOpen: true, selectedSource: source });
    }

    doDeleteIndex(source) {
        var currentSources = [...this.state.sources]
        currentSources.find(s => s.ID === source.ID).IndexStatus = "deleting"
        this.setState({sources: currentSources}, () => {
            axios.delete(`${JAWHAR_API}/sources/${source.Type}/${source.ID}/index`)
        })
    }

    confirmDeleteAlert = () => {
        this.doDeleteIndex(this.state.selectedSource);
        this.setState({ deleteIndexAlertOpen: false });
    }

    cancelDeleteAlert = () => {
        this.setState({ deleteIndexAlertOpen: false });
    }

    /* --------- Unmount Source ----------- */
    handleUnmountClick(source) {
        if (source.IndexStatus == "creating") {
            this.setState({ unmountAlertOpen: true, selectedSource: source });
        }
        else {
            this.doUnmountParition(source.Type, source.ID)
        }
    }

    confirmUnmountAlert = () => {
        this.doUnmountParition(this.state.selectedSource.ID)
        this.setState({ unmountAlertOpen: false });
    }

    cancelUnmountAlert = () => {
        this.setState({ unmountAlertOpen: false });
    }

    doUnmountParition(source_type, source_id)
    {
        var currentSources = [...this.state.sources]
        currentSources.find(s => s.ID === source_id).Status = "unmounting"
        this.setState({sources: currentSources}, () => {
            axios.post(`${JAWHAR_API}/sources/${source_type}/${source_id}/unmount`)
        })

    }


    /* ------- Create Index ------- */

    openIndexDialog(source) {
        console.log("Opening Index Dialog for Source ", source);
        this.setState({
            indexDialogOpen: true,
            selectedSource: source
        })
    }

    cancelIndexDialog() {
        console.log("Closing index dialog")
        this.setState({
            indexDialogOpen: false,
            selectedSource: {},
        })
    }

    onIndexDialogSave = (settings) => {
        const data = {
            excludes: settings.excludes
        }
        console.log("Calling create index with data", data)
        var currentSources = [...this.state.sources]
        currentSources.find(s => s.ID === this.state.selectedSource.ID).IndexStatus = "creating"
        this.setState({sources: currentSources}, () => {
            axios
            .post(`${JAWHAR_API}/sources/${this.state.selectedSource.Type}/${this.state.selectedSource.ID}/index`, data)
            .then(res => {
                this.setState({
                    indexDialogOpen: false,
                    selectedSource: {}
                })
            })
        })

    }


	componentDidMount () {
        $(document).ready(function() {
            $(".meter > span").each(function() {
                $(this).css("max-width", "1000px")
            })
        });
	}

    /* ---------- Update Sources --------- */
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (JSON.stringify(this.props.drives) != JSON.stringify(prevProps.drives)) {
            this.setState({
                sources: this.props.sources,
                drives: this.props.drives,
            }, () => {
                this.forceUpdate()
                $(document).ready(function() {
                    $(".meter > span").each(function() {
                        $(this).css("max-width", "1000px")
                    })
                });
            })
        }
    }

    /* --------- Add Account Dialog -------*/
    handleAddDialogClose = () => {
        this.setState({
            addDialogOpen: false
        })
    }

    openAddDialog = () => {
        this.setState({
            addDialogOpen: true,
            consentFlowState: "selectProvider"
        })
    }

    responseGoogle = (response) => {
        console.log(response);
    }

    openGoogleAuthConsent = (source={}) => {
        this.createGoogleAuthWindow()
        this.setState({
            googleAuthConsentOpen: true,
            googleAuthCode: "",
            selectedSource: source,
            consentFlowState: "enterGoogleAuthCode",
            addDialogOpen: true
        })
    }

    createGoogleAuthWindow = () => {
        this.currentAuthWindow = <NewWindow
                key={Math.random().toString(36).replace(/[^a-z]+/g, '') }
                url="https://accounts.google.com/o/oauth2/v2/auth?scope=email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.metadata&response_type=code&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_id=647498924470-rvr9l3drsfmnc3k7cnghrvn8jd2k42l8.apps.googleusercontent.com"
                center="screen" />
    }

    addUpdateGoogleAccount = () => {
        // if (this.state.selectedSource !== null)
        // {
        //     console.log("Updating selectedSource", this.state.selectedSource)
        //     var currentSources = [...this.state.sources]
        //     currentSources.find(s => s.id === this.state.selectedSource.id).status = "mounting"
        // }
        const data = {
            authCode: this.state.googleAuthCode
        }
        axios
        .post(`${JAWHAR_API}/google_drive_accounts/`, data)
        .then(res => {
            this.setState({
                addDialogOpen: false,
                selectedSource: {},
            })
        })
    }


    /* ---------- Render --------- */
    render() {
        const { classes } = this.props;
        const {  indexDialogOpen, selectedSource } = this.state
        return (
            <div>
                {this.state.googleAuthConsentOpen && this.currentAuthWindow}

                <IndexDialog
                    open={indexDialogOpen}
                    partitionObject={selectedSource}
                    onClose={this.cancelIndexDialog.bind(this)}
                    onSave={this.onIndexDialogSave}
                    onCancel
                />
                <AlertDialog open={this.state.unmountAlertOpen}
                    cancelButton="Cancel"
                    okButton="Yes"
                    title="This will interrupt indexing progress. Continue?"
                    message="Indexing is currently in progress. Unmounting the storage partition will interrupt the indexing process and may cause some loss of progress. Are you sure you want to continue?"
                    onCancel={this.cancelUnmountAlert}
                    onOk={this.confirmUnmountAlert}
                />
                <AlertDialog open={this.state.deleteIndexAlertOpen}
                    cancelButton="Cancel"
                    okButton="Yes"
                    title="This will make your files non-searchable. Continue?"
                    message="Deleting the index will makes your files on this partition non-searchable, you can re-create the index later but it might take time depending on data size. Are you sure you want to continue?"
                    onCancel={this.cancelDeleteAlert}
                    onOk={this.confirmDeleteAlert}
                />
                <AlertDialog open={this.state.cancelIndexAlertOpen}
                    cancelButton="Cancel"
                    okButton="Yes"
                    title="Are you sure you want to cancel index creation?"
                    message="This will delete any index data that have been created so far. You can choose to pause indexing instead to keep index data."
                    onCancel={this.cancelCancelAlert}
                    onOk={this.confirmCancelAlert}
                />


                <Dialog onClose={this.handleAddDialogClose}
                        open={this.state.addDialogOpen}
                        maxWidth="sm"
                        fullWidth>
                    {this.state.consentFlowState == "selectProvider" && (<><DialogTitle id="simple-dialog-title">Add External Storage Accounts</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Select an account type to connect your HurraCloud Device with.
                        </DialogContentText>
                        <List>
                            <ListItem button onClick={this.openGoogleAuthConsent}>
                                <ListItemAvatar>
                                    <Avatar><span class="google-drive-icon" /></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Google Drive" />
                            </ListItem>
                        </List></DialogContent></>)
                    }
                    {this.state.consentFlowState == "enterGoogleAuthCode" && (
                    <><DialogTitle id="simple-dialog-title">Enter Google Authorization Code</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please complete the authentication process with Google in the popup window and provide the authorization code below:
                            </DialogContentText>
                            <List>
                                <ListItem>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Authorization Code"
                                        value={this.state.googleAuthCode}
                                        onChange={(e) => { this.setState({googleAuthCode: e.target.value}) }}
                                        />
                                </ListItem>
                            </List>
                            <DialogActions>
                                <Button onClick={this.handleAddDialogClose} color="secondary">
                                Cancel
                                </Button>
                                <Button onClick={this.addUpdateGoogleAccount} color="secondary">
                                Add Account
                                </Button>
                            </DialogActions>
                            <DialogContentText variant="body2" align="justify">
                                <b>Why do I need authorization code?</b> The authorization code is needed to allow your HurraCloud Device to access your Google Drive files, therefore enable features such as files sync and backups. <br/><br/>
                                <b>But why enter it manually?</b> You may have seen other applications that automatically completes the consent process without requiring you to copy/paste the code. This is because they use server-side application to retrieve the code from Google. But since HurraCloud is all about privacy, we do not use any servers on the internet. In fact, the entire process completely happens at your HurraCloud Device (and of course, Google's login server)
                            </DialogContentText>
                        </DialogContent>
                    </>)
                    }

                </Dialog>

                <Dialog onClose={() => { this.setState({ toolDialogOpen: false })}}
                        open={this.state.toolDialogOpen}
                        maxWidth="sm"
                        fullWidth>
                    {this.state.toolDialogState == "drives_tool_menu" && (<><DialogTitle>Advanced Tools</DialogTitle>
                        <DialogContent>
                        <DialogContentText className={classes.dialogContent}>
                            Serial Number: {this.state.selectedSource.SerialNumber}<br/>
                        </DialogContentText>
                        <List>
                            <ListItem button onClick={() => this.setState({toolDialogState: "format_disk"}) }>
                                <ListItemAvatar>
                                    <Avatar><span class="fas fa-eraser" /></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Format Disk" secondary="Erise drive completely and re-format it" />
                            </ListItem>
                        </List></DialogContent></>)}
                    {this.state.toolDialogState == "partitions_tool_menu" && (<><DialogTitle>Advanced Tools</DialogTitle>
                        <DialogContent>
                        <DialogContentText className={classes.dialogContent}>
                            Serial Number: {this.state.selectedSource.Drive.SerialNumber}<br/>
                            Partition:  {this.state.selectedSource.Type != "internal" ? this.state.selectedSource.Type.DeviceFile : "Internal Storage"}<br />
                            Label:  {this.state.selectedSource.Caption}<br/>
                        </DialogContentText>
                        <List>
                            {this.state.selectedSource.Type != "internal" && <ListItem button onClick={() => this.setState({toolDialogState: "format"}) }>
                                <ListItemAvatar>
                                    <Avatar><span class="fas fa-eraser" /></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Format" secondary="Erase and re-format the partition" />
                            </ListItem>}
                            <ListItem button onClick={this.openGoogleAuthConsent}>
                                <ListItemAvatar>
                                    <Avatar><FileCopy /></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Copy Contents" secondary="Copy all contents to another disk" />
                            </ListItem>
                            {this.state.selectedSource.Type != "internal" && <ListItem button onClick={this.openGoogleAuthConsent}>
                                <ListItemAvatar>
                                    <Avatar><span class="fas fa-archive" /></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Backup" secondary="Backup all contents to another disk in compressed archive format" />
                            </ListItem>}
                        </List></DialogContent></>)}
                    {this.state.toolDialogState == "format_disk" && (
                    <><DialogTitle id="simple-dialog-title">Format {this.state.selectedSource.DeviceFile}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                WARNING: This will erase all the contents of the partition
                            </DialogContentText>
                            <List>
                                <ListItem>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Authorization Code"
                                        value={this.state.googleAuthCode}
                                        onChange={(e) => { this.setState({googleAuthCode: e.target.value}) }}
                                        />
                                </ListItem>
                            </List>
                            <DialogActions>
                                <Button onClick={this.handleAddDialogClose} color="secondary">
                                Cancel
                                </Button>
                                <Button onClick={this.addUpdateGoogleAccount} color="secondary">
                                Add Account
                                </Button>
                            </DialogActions>
                            <DialogContentText variant="body2" align="justify">
                                <b>Why do I need authorization code?</b> The authorization code is needed to allow your HurraCloud Device to access your Google Drive files, therefore enable features such as files sync and backups. <br/><br/>
                                <b>But why enter it manually?</b> You may have seen other applications that automatically completes the consent process without requiring you to copy/paste the code. This is because they use server-side application to retrieve the code from Google. But since HurraCloud is all about privacy, we do not use any servers on the internet. In fact, the entire process completely happens at your HurraCloud Device (and of course, Google's login server)
                            </DialogContentText>
                        </DialogContent>
                    </>)
                    }

                </Dialog>


                <Grid container direction="column">
                    <Grid container direction="row" spacing={10} xs={12} justify="space-between">
                    <Grid item xs={12}>
                            <Paper className={classes.root}>
                                <div className={classes.tableDescriptionWrapper}>
                                    <Typography variant="h6">
                                    Drives & Indexes
                                    </Typography>
                                    <Typography variant="subtitle" align="justify">
                                        Your HurraCloud device comes with internal storage. You can also connect external USB devices or connect with online cloud storage such as Google Drive, Dropbox and iCloud
                                    </Typography>
                                </div>
                                <Table className={classes.table}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell variant="head" component='div' className={classNames(classes.tableHeader, classes.iconCell)} scope="row"></TableCell>
                                            <TableCell variant="head" component='div' className={classNames(classes.tableHeader, classes.nameCell)} scope="row">Name</TableCell>
                                            <TableCell variant="head" component='div'  className={classNames(classes.tableHeader, classes.capacityCell)} align="left">Capacity</TableCell>
                                            <TableCell variant="head" component='div'  className={classNames(classes.tableHeader, classes.availableCell)} align="left">Free</TableCell>
                                            <TableCell variant="head" component='div'  className={classNames(classes.tableHeader, classes.actionsCell)} align="left" >Actions</TableCell>
                                            <TableCell variant="head" component='div'  className={classNames(classes.tableHeader, classes.indexCell)} align="left">Index Status</TableCell>
                                            <TableCell variant="head" component='div'  className={classNames(classes.tableHeader, classes.toolsCell)} align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.props.drives.map(drive => {
                                            let icon_class = "fas fa-hdd"
                                            if (drive.IsRemovable)
                                                icon_class = "fas fa-usb"
                                            // else if (source.source_type == "internal")
                                            //     icon_class = "fab fa-hdd"
                                            return (<><TableRow key={drive.ID} className={classes.driveRow}>
                                                        <TableCell scope="row" className={classes.iconCell}>
                                                            <div style={{float:'left'}}>
                                                                <span className={`${icon_class}`} style={{ marginRight: '0.5em' }} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell scope="row" className={classNames(classes.bodyCell, classes.nameCell)}>
                                                        {drive.Vendor}
                                                        </TableCell>
                                                        <TableCell scope="row" className={classNames(classes.bodyCell, classes.capacityCell)}>
                                                        {Utils.humanFileSize(drive.SizeBytes)}
                                                        </TableCell>
                                                        <TableCell scope="row" className={classNames(classes.bodyCell, classes.availableCell)}>
                                                        </TableCell>
                                                        <TableCell align="left"  className={classNames(classes.bodyCell, classes.actionsCell)}>
                                                        </TableCell>
                                                        <TableCell className={classNames(classes.bodyCell,classes.indexCell)}></TableCell>

                                                        <TableCell>
                                                        <div>
                                                            {drive.DriveType != "internal" && (<Button variant="outline"
                                                                color="primary" size="small"
                                                                onClick={() => this.setState({selectedSource: drive, toolDialogOpen: true, toolDialogState: "drives_tool_menu"}) }>
                                                                <BuildIcon className={classes.leftIcon}></BuildIcon></Button>)}
                                                        </div>
                                                        </TableCell>
                                                    </TableRow>
                                                        {drive.Partitions.map(source => {
                                                            let indexingProgress = source.IndexStatus == "creating" && source.IndexProgress < 100 ? ` - ${source.IndexProgress}%` : ''
                                                            return (
                                                            <TableRow key={source.ID} className={classes.sourceRow}>
                                                                <TableCell scope="row" className={classes.iconCell}>
                                                                </TableCell>
                                                                <TableCell scope="row" className={classNames(classes.bodyCell, classes.nameCell)}>
                                                                    {source.Caption}
                                                                </TableCell>
                                                                <TableCell scope="row" className={classNames(classes.bodyCell, classes.capacityCell)}>
                                                                {source.Status == "mounted" && Utils.humanFileSize(source.SizeBytes)}
                                                                </TableCell>
                                                                <TableCell scope="row" className={classNames(classes.bodyCell, classes.availableCell)}>
                                                                {source.Status == "mounted" && Utils.humanFileSize(source.AvailableBytes)}
                                                                </TableCell>
                                                                <TableCell align="left"  className={classNames(classes.bodyCell, classes.actionsCell)}>
                                                                <div style={{width: "150px", float: 'left', minHeight: '1px'}}>
                                                                    { (() => {
                                                                        if (source.Status == "mounted" && source.Type != "internal")
                                                                            return <Tooltip title="Unmounting the drive will make it inaccessible.">
                                                                                        <Button variant="outline" color="primary" size="small" onClick={() => {this.handleUnmountClick(source)} }>
                                                                                            {source.Drive.DriveType != "CloudDrive" && <UnmountIcon className={classes.leftIcon}></UnmountIcon>}
                                                                                            {source.Drive.DriveType == "GoogleDriveAccount" && <DisconnectIcon className={classes.leftIcon}></DisconnectIcon>}
                                                                                            {source.Drive.DriveType != "CloudDrive" ? "Eject" : "Disconnect"}
                                                                                        </Button>
                                                                                    </Tooltip>
                                                                        else if (source.Status == "unmounted")
                                                                            return <Tooltip title="Mounting a drive partition allows you to browse its contents via the browser and the mobile and desktop apps">
                                                                                        <Button variant="outline" color="primary" size="small" onClick={() => {this.handleMountClick(source)} }>
                                                                                            {source.Drive.DriveType != "CloudDrive" && <MountIcon className={classes.leftIcon}></MountIcon>}
                                                                                            {source.Drive.DriveType == "GoogleDriveAccount" && <ReconnectIcon className={classes.leftIcon}></ReconnectIcon>}
                                                                                            {source.Drive.DriveType != "CloudDrive" ? "Mount" : "Reconnect"}

                                                                                        </Button>
                                                                                    </Tooltip>
                                                                        else if (source.Status == "unmountable")
                                                                            return <Tooltip title={source.Filesystem != "" ? `This partition's filesystem ${source.Filesystem} is not supported` :
                                                                                                        "Partition is not formatted or could not determine filesystem" }><span>
                                                                                        <Button variant="outline" disabled="true" color="primary" size="small" onClick={() => {this.handleMountClick(source)} }>
                                                                                            {source.Drive.DriveType != "CloudDrive" && <MountIcon className={classes.leftIcon}></MountIcon>}
                                                                                            {source.Drive.DriveType == "GoogleDriveAccount" && <ReconnectIcon className={classes.leftIcon}></ReconnectIcon>}
                                                                                            {source.Drive.DriveType != "CloudDrive" ? "Mount" : "Reconnect"}
                                                                                        </Button></span>
                                                                                    </Tooltip>
                                                                        else if (source.Type != "internal")
                                                                            return <CircularProgress className={classes.progress} size={20} />
                                                                        })()
                                                                    }
                                                                    </div>
                                                                    <div style={{width: "180px", float: 'left', minHeight: '1px'}}>
                                                                    {source.IndexStatus == "" && source.Status == "mounted" && (
                                                                        <Tooltip title="Indexing a drive partitions allows your to search your files and their contents in blazing speed">
                                                                            <Button variant="outline"
                                                                                    color="primary" size="small"
                                                                                    onClick={() => { this.openIndexDialog(source) }}>
                                                                                <IndexIcon className={classes.leftIcon}></IndexIcon>
                                                                                Create Index
                                                                            </Button>
                                                                        </Tooltip>)
                                                                    }
                                                                    {source.index && source.IndexStatus === "deleting"  && (
                                                                        <CircularProgress className={classes.progress} size={20} />
                                                                    )}

                                                                    {source.IndexStatus === "creating" && (
                                                                    <Button variant="outline"
                                                                        color="primary" size="small"
                                                                        onClick={() => { this.handlePauseClick(source)}}>
                                                                        <PauseIcon className={classes.leftIcon}></PauseIcon>Pause
                                                                    </Button>)}

                                                                    {source.IndexStatus === "paused" && (
                                                                    <Button variant="outline"
                                                                        color="primary" size="small"
                                                                        onClick={() => { this.handleResumeClick(source)}}>
                                                                        <ResumeIcon className={classes.leftIcon}></ResumeIcon>Resume
                                                                    </Button>)}

                                                                    {(source.IndexStatus === "resuming" || source.IndexStatus === "pausing")  && (
                                                                        <CircularProgress className={classes.progress} size={20} />
                                                                    )}
                                                                    </div>
                                                                    <div style={{width: "180px", float: 'left', clear: 'right', minHeight: '1px'}}>
                                                                    {(source.IndexStatus === "paused" || source.IndexStatus === "created") && (
                                                                        <Button variant="outline"
                                                                            color="primary" size="small"
                                                                            onClick={() => { this.handleDeleteIndexClick(source)}}>
                                                                            <DeleteIcon className={classes.leftIcon}></DeleteIcon>Delete Index
                                                                        </Button>
                                                                    )}
                                                                    {source.IndexStatus == "creating" && (
                                                                        <Tooltip title="Cancelling indexing will stop indexing and delete any index data (this will NOT delete your files)">
                                                                            <Button variant="outline"
                                                                                    color="primary" size="small"
                                                                                    onClick={() => { this.handleCancelClick(source) }}>
                                                                                <CancelIcon className={classes.leftIcon}></CancelIcon>
                                                                                Cancel
                                                                            </Button>
                                                                        </Tooltip>)
                                                                    }
                                                                    {source.IndexStatus === "deleting"  && (
                                                                        <CircularProgress className={classes.progress} size={20} />
                                                                    )}
                                                                    </div>
                                                                </TableCell>
                                                                {source.IndexStatus != "" && <><TableCell align="left" className={classNames(classes.bodyCell,classes.indexCell)}>
                                                                    <div className="indexingDone" style={{display: source.IndexStatus == "created" ? "block" : "none" }}>
                                                                        <i style={{fontSize: 16, color: 'green'}} class="fas fa-check-circle"></i>
                                                                    </div>
                                                                    <div className="indexingDone" style={{display: ["paused", "pausing", "resuming"].includes(source.IndexStatus) ? "block" : "none" }}>
                                                                        <i style={{fontSize: 17, color: '#F86395'}} class="fas fa-pause-circle"></i>
                                                                    </div>
                                                                    <div className="indexingDone" style={{display: ["deleting"].includes(source.IndexStatus) ? "block" : "none" }}>
                                                                        <i style={{fontSize: 16, color: 'orange'}} class="fas fa-clock"></i>
                                                                    </div>

                                                                    { (source.IndexStatus == "init" || source.IndexStatus == "creating") && source.IndexProgress < 100 && (<div className="meter orange">
                                                                                                                <span style={{width: `${source.IndexProgress}%` }} />
                                                                                                            </div>)}
                                                                    {source.IndexStatus == "scheduled" && "Scheduled" }
                                                                    {source.IndexStatus == "init" && "Initializing index (scanning files)" }
                                                                    {![ "scheduled", "cancelling", "deleting"].includes(source.IndexStatus) && `${source.IndexIndexedDocuments} document(s) ${indexingProgress}`}

                                                                </TableCell>
                                                                </>}
                                                                {source.IndexStatus == "" && <TableCell className={classNames(classes.bodyCell,classes.indexCell)}>Not indexed</TableCell>}
                                                                <TableCell>

                                                                <div>
                                                                <Button variant="outline"
                                                                        color="primary" size="small"
                                                                        onClick={() => this.setState({selectedSource: source, toolDialogOpen: true, toolDialogState: "partitions_tool_menu"}) }>
                                                                        <BuildIcon className={classes.leftIcon}></BuildIcon>
                                                                    </Button>
                                                                    </div>


                                                                </TableCell>
                                                            </TableRow>)
                                                        })}
                                                </>) })}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <div style={{marginTop:"10px"}}>
                   <Button variant="contained" size="large" color="secondary"  style={{textDeocration: 'none'}} onClick={this.openAddDialog} >
                      <CloudIcon className={classNames(classes.leftIcon, classes.iconSmall)} disabled={true} />
                      Connect External Cloud Drive
                   </Button>
                </div>
            </div>
            );
    }

}

SettingsPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingsPage);
