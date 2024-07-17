import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

class AlertDialog extends React.Component {
  state = {
    open: this.props.open || false,
    message: this.props.message || "",
    cancelButton: this.props.cancelButton || "Cancel",
    okButton: this.props.okButton || "OK",
    title: this.props.title || ""
  };

  handleCancel = () => {
    if (this.props.onCancel)
        this.props.onCancel()
        
  };

  handleOk = () => {
    if (this.props.onOk)
        this.props.onOk()

  };

  componentDidUpdate = (prevProps) => {
    if (this.props.open != prevProps.open) {
        this.setState({
            open: this.props.open            
        })
    }
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              {this.state.cancelButton}
            </Button>
            <Button onClick={this.handleOk} color="primary" autoFocus>
            {this.state.okButton}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialog;
