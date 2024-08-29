import React, { useRef, useEffect, useState, useReducer} from 'react'
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import QuickPreview from '../components/QuickPreview';
import FilePreview from '../components/FilePreview';
import SearchResultsTable from './SearchResultsTable';
import ProgressIndicator from '../components/ProgressIndicator';
import QueryString from 'query-string';
import { JAWHAR_API  } from '../constants';
import {FormControl, InputLabel, Input, FormHelperText} from '@mui/material';
import { Typography, Select, MenuItem, List, ListItem } from '@mui/material'
import withRoute from "../withRoute";
import { useNavigate, useLocation } from 'react-router-dom'

const SIZE = 30;
const PREFIX = 'SearchPage';
const classes = {
  filterPaper: `${PREFIX}-filterPaper`,
  heading: `${PREFIX}-heading`,
  paper: `${PREFIX}-paper`,
  searchBar: `${PREFIX}-searchBar`,
  searchInput: `${PREFIX}-searchInput`,
  block: `${PREFIX}-block`,
  addUser: `${PREFIX}-addUser`,
  contentWrapper: `${PREFIX}-contentWrapper`,
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.filterPaper}`]: {
    padding: "10px"
  },
  [`&.${classes.heading}`]: {
    fontSize: theme.typography.pxToRem(18),
    color: theme.palette.text.secondary,
    width: "80px"
  },
  [`&.${classes.paper}`]: {
    maxWidth: '100%',
    margin: 'auto',
  },
  [`&.${classes.searchBar}`]: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  [`&.${classes.searchInput}`]: {
    fontSize: theme.typography.fontSize,
  },
  [`&.${classes.block}`]: {
    display: 'block',
  },
  [`&.${classes.addUser}`]: {
    marginRight: theme.spacing.unit,
  },
  [`&.${classes.contentWrapper}`]: {
    margin: '0px 0px',
    height: "80vh",
    flex: 1,
  },

}))


const styles = theme => ({
  filterPaper: {
    padding: "10px"
  },

  heading: {
    fontSize: theme.typography.pxToRem(18),
    color: theme.palette.text.secondary,
    width: "80px"
  },

  paper: {
    maxWidth: '100%',
    margin: 'auto',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing.unit,
  },
  contentWrapper: {
    margin: '0px 0px',
    height: "80vh",
    flex: 1,
  },
});

// class Content extends React.Component {
//   constructor(props) {
//     super(props);

//     state = {
//       error: null,
//       isInstantSearchEnabled: false,
//       isPreviewOpen: false,
//       isLoaded: false,
//       previewedContent: [],
//       openedFile: '',
//       isInlineViewerOpen: false,
//       previewedTitle: '',
//       isAjaxInProgress: false,
//       items: [],
//       totalResults: 1000,
//     };
//   }

const Content = (props) => {

  const navigate = useNavigate()
  const location = useLocation()


  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      error: null,
      isInstantSearchEnabled: false,
      isPreviewOpen: false,
      isLoaded: false,
      previewedContent: [],
      openedFile: '',
      isInlineViewerOpen: false,
      previewedTitle: '',
      isAjaxInProgress: false,
      items: [],
      totalResults: 1000,
    }
  )
  

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
      this.setState({
        isPreviewOpen: true,
        isInlineViewerOpen: false,
        openedFile: state.items[index]._source.path,
        previewedContent: preview_content,
        previewedTitle: state.items[index]._source.file.filename,
      });
    }
  };

  const handleFilenameClick = file => {
    const path = file.Path;
    navigate({ pathname: `/search/${props.selectSourceType}/${props.selectSourceID}/preview${path}`, search: location.search});
  };

  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) {
    } else {
      didMountRef.current = true
      searchWrapper(query(), search);
    }
  })


  // componentDidUpdate(prevProps) {
  //   const prevQuery = this.query(prevProps);
  //   const newQuery = this.query()

  //   if (prevQuery  !== newQuery || this.props.selectSourceType !== prevProps.selectSourceType || this.props.selectSourceID !== prevProps.selectSourceID ) {
  //     this.searchWrapper(newQuery, this.search);
  //   }
  // }


  
  const handlePreviewCloseClick = () => {
    this.setState({
      isPreviewOpen: false,
      isInlineViewerOpen: false,
      openedFile: '',
    });
  }

  const searchWrapper = (query, searchFunction) => {
    console.log("searchwrapper")
    // setState(
    //   {
    //     q: query,
    //     isPreviewOpen: false,
    //     isAjaxInProgress: true,
    //     isInlineViewerOpen: false,
    //     items: [],
    //     totalResults: 0,
    //     openedFile: '',
    //   }
    // );
    searchFunction()
  };

  const onLoadMore = (from, to) => {
    // return new Promise((resolve, reject) => {
    //   this.setState(
    //     {
    //       isPreviewOpen: false,
    //       isInlineViewerOpen: false,
    //       openedFile: '',
    //     },
    //     () => {
    //       resolve(this.search(from, to));
    //     },
    //   );
    // });
  }

  const search = (from = 0, to = SIZE) => {
    const theQuery = query();
    console.log("searching", theQuery, from, to)
    if (theQuery) {
        axios
          .get(`${JAWHAR_API}/sources/${props.selectSourceType}/${props.selectSourceID}/search?q=${theQuery}&from=${from}&to=${to}`)
          .then(res => {
            const response = res.data;
            setState(
              {
                totalResults: Math.min(1000, response.length),
                items: state.items.concat(response),
                isAjaxInProgress: false,
              }
            );
          });
    } else {
      console.log("Empty Query")
      setState(
        {
          totalResults: 0,
          items: [],
          emptyQuery: true,
          isAjaxInProgress: false,
        }
      );
    }
  }

  const query = () => {
    console.log("parsing query", location)
    const parsedQuery = QueryString.parse(location.search)
    return parsedQuery.q
  }

  const source = (fromProps) => {
    const theProps = fromProps || props
    return `${theProps.selectSourceType}-${theProps.selectSourceID}`
  }
  
  const { items } = state;
  return (
    <Root>
      <span>
        <Paper className={classes.filterPaper}>
          <ListItem>
              <Typography className={classes.heading}> Index</Typography>
              <Select value={ source()} onChange={(event) => {
                    console.log("Changed source", event.target.value)
                    let c = event.target.value.split("-")
                    let sourceType = c[0]
                    let sourceID = c[1]
                    navigate({ pathname: `/search/${sourceType}/${sourceID}`, search: location.search});
              }}>
                {props.sources.filter(s => s.Status == "mounted" && s.IndexStatus != "").map((source, index) => {
                  return (
                    <MenuItem value={`${source.Type}-${source.ID}`} >{source.Caption}</MenuItem>)
                  })}
              </Select>
          </ListItem>
        </Paper>
        <br/>
        <Paper className={classes.paper}>
        <div className={classes.contentWrapper} >
          <SearchResultsTable
            rowCount={state.totalResults}
            data={state.items}
            rowGetter={({ index }) => ({ file: state.items[index] })}
            onPreviewClick={handlePreviewClick}
            onFilenameClick={handleFilenameClick}
            classes={classes.table}
            onLoadMore={onLoadMore.bind(this)}
            query={query()}
            columns={[
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
                content: 'openButton',
              },
              {
                width: 40,
                label: '',
                dataKey: 'file',
                content: 'previewButton',
              },
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
            ]}
          />
        </div>
      </Paper>
      <div>{state.isAjaxInProgress && <ProgressIndicator />}</div>
      </span>
    </Root>
  );
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

const deepDiffMapper = (function() {
  return {
    VALUE_CREATED: 'created',
    VALUE_UPDATED: 'updated',
    VALUE_DELETED: 'deleted',
    VALUE_UNCHANGED: 'unchanged',
    map(obj1, obj2) {
      if (this.isFunction(obj1) || this.isFunction(obj2)) {
        throw 'Invalid argument. Function given, object expected.';
      }
      if (this.isValue(obj1) || this.isValue(obj2)) {
        return {
          type: this.compareValues(obj1, obj2),
          data: obj1 === undefined ? obj2 : obj1,
        };
      }

      const diff = {};
      for (var key in obj1) {
        if (this.isFunction(obj1[key])) {
          continue;
        }

        let value2;
        if (typeof obj2[key] !== 'undefined') {
          value2 = obj2[key];
        }

        diff[key] = this.map(obj1[key], value2);
      }
      for (var key in obj2) {
        if (this.isFunction(obj2[key]) || typeof diff[key] !== 'undefined') {
          continue;
        }

        diff[key] = this.map(undefined, obj2[key]);
      }

      return diff;
    },
    compareValues(value1, value2) {
      if (value1 === value2) {
        return this.VALUE_UNCHANGED;
      }
      if (
        this.isDate(value1) &&
        this.isDate(value2) &&
        value1.getTime() === value2.getTime()
      ) {
        return this.VALUE_UNCHANGED;
      }
      if (typeof value1 === 'undefined') {
        return this.VALUE_CREATED;
      }
      if (typeof value2 === 'undefined') {
        return this.VALUE_DELETED;
      }

      return this.VALUE_UPDATED;
    },
    isFunction(obj) {
      return {}.toString.apply(obj) === '[object Function]';
    },
    isArray(obj) {
      return {}.toString.apply(obj) === '[object Array]';
    },
    isDate(obj) {
      return {}.toString.apply(obj) === '[object Date]';
    },
    isObject(obj) {
      return {}.toString.apply(obj) === '[object Object]';
    },
    isValue(obj) {
      return !this.isObject(obj) && !this.isArray(obj);
    },
  };
})();

export default withRoute(Content);
