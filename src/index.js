// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';


import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'

// ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
const rootElement =  document.getElementById('root');
const root =  createRoot(rootElement);
root.render(<BrowserRouter><App /></BrowserRouter>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
