import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import "prismjs/themes/prism.css"; // add prism.css to add highlights 
// import 'draft-js/dist/Draft.css';
// import 'draft-js-inline-toolbar-plugin/lib/plugin.css';
// import 'draft-js-emoji-plugin/lib/plugin.css'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
