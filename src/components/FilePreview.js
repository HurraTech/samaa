import React from 'react';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Dialog from '@mui/material/Dialog';
import Iframe from 'react-iframe';
import { JAWHAR_API  } from '../constants';

function PaperComponent(props) {
  return (
    <Draggable>
      <Paper {...props} />
    </Draggable>
  );
}

class FilePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open || false,
      content: [],
      file: this.props.file,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      file: nextProps.file,
    });
  }

  handleClose() {
    this.props.onCloseClick()
  }

  render() {
    return (
      <Dialog
        open={this.state.open}
        fullWidth
        maxWidth="md"
        onClose={this.handleClose.bind(this)}
        PaperComponent={PaperComponent}
      >
        <Iframe
          url={`${JAWHAR_API}/${this.state.file}`}
          width="100%"
          height="100vh"
          display="initial"
          align="center"
          position="relative"
          allowFullScreen
        />
      </Dialog>
    );
  }
}

export default FilePreview;
