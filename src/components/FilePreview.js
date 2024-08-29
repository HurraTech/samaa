import React, { useRef, useEffect, useState, useReducer} from 'react'
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Dialog from '@mui/material/Dialog';
import Iframe from 'react-iframe';
import { JAWHAR_API  } from '../constants';

function PaperComponent(props) {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef}>
      <Paper nodeRef={nodeRef} {...props} />
    </Draggable>
  );
}

const FilePreview = (props) => {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     open: this.props.open || false,
  //     content: [],
  //     file: this.props.file,
  //   };
  // }

  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      open: props.open || false,
      content: [],
      file: props.file,
    }
  )

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     open: nextProps.open,
  //     file: nextProps.file,
  //   });
  // }

  useEffect(() => {
    setState({
      open: props.open,
      file: props.file,
    });
  }, [props.file]);


  const handleClose = () => {
    this.props.onCloseClick()
  }

  return (
    <Dialog
      open={state.open}
      fullWidth
      maxWidth="md"
      onClose={handleClose.bind(this)}
      PaperComponent={PaperComponent}
    >
      <Iframe
        url={`${JAWHAR_API}/${state.file}`}
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

export default FilePreview;
