import React from 'react';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Typography from '@mui/material/Typography';
import { withStyles } from '@mui/styles';
import MuiDialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import MuiDialogContent from '@mui/material/DialogContent';
import injectSheet from 'react-jss';

const styles = {
  '@global': {
    em: {
      backgroundColor: 'yellow',
      fontStyle: 'normal',
      color: 'black',
    },
  },
};

function PaperComponent(props) {
  return (
    <Draggable>
      <Paper {...props} />
    </Draggable>
  );
}

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 2,
    padding: theme.spacing.unit * 2,
    lineHeight: '1.5em',
    border: '1px solid #bfbfbf',
    fontFamily: 'Tahoma',
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogContent className={classes.root}>{children}</MuiDialogContent>
  );
});

class QuickPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      content: [],
      title: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.open,
      content: nextProps.content,
      title: nextProps.title,
    });
  }

  handleClose() {
    this.props.onCloseClick()
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          fullWidth
          maxWidth="md"
          modal={false}
          onClose={this.handleClose.bind(this)}
          PaperComponent={PaperComponent}
        >
          <DialogContent>
            {this.state.content.map(excerpt => {
              excerpt = excerpt.replace(/(?:\r\n|\r|\n)/g, '<br>');
              return (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `${excerpt}<br/><br/><div class="gradient"></div><br/><br/>`,
                  }}
                />
              );
            })}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default injectSheet(styles)(QuickPreview);
