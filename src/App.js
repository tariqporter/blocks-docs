import React, { useState, useCallback } from 'react';
import DraftEditor from './DraftEditor';
import { EditorState, ContentState } from 'draft-js';
import { Grid } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
import { Paper, Tabs, Tab } from '@material-ui/core';
import showdown from 'showdown';
import sanitizeHtml from 'sanitize-html';
import 'github-markdown-css/github-markdown.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'];

const allowedAttributes = {
    '*': [ 'href', 'name', 'target', 'class' ]
};

const useStyles = createUseStyles(theme => ({
  root: {
    minHeight: '100vh',
    padding: 100
  },
  panel: {
    display: 'flex',
    borderRadius: [4, 0, 0, 4]
  },
  preview: {
    padding: 36
  }
}));

const defaultText = `
# header

\`some code\` and a list:
- apples
- oranges
- pears

\`\`\`js
const a = 33;
\`\`\`

\`\`\`html
<div class="test-class"></div>
\`\`\`
`;

const App = () => {
  const c = useStyles();
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(defaultText)));
  const [tabIndex, setTabIndex] = useState(0);
  const [html, setHtml] = useState('');

  const onChange = useCallback((e) => {
    setEditorState(e);
  }, [setEditorState]);

  const handleChange = (e, index) => {
    setTabIndex(index);
    if (index === 1) {
      const converter = new showdown.Converter();
      const text = editorState.getCurrentContent().getPlainText();
      const newHtml = converter.makeHtml(text);
      const sanitizedHtml = sanitizeHtml(newHtml, { allowedTags, allowedAttributes });
      const div = document.createElement('div');
      div.innerHTML = sanitizedHtml;
      div.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
      const innerHTML = div.innerHTML;
      setHtml(innerHTML);
    }
  };

  return (
    <Grid container className={c.root}>
      <Grid item xs={6} className={c.panel}>
        <Paper style={{ width: '100%' }}>
          <Tabs
            value={tabIndex}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            onChange={handleChange}
          >
            <Tab label="Edit Markdown" />
            <Tab label="Preview" />
          </Tabs>
          <div hidden={tabIndex !== 0}>
            <DraftEditor
              editorState={editorState}
              onChange={onChange}
            />
          </div>
          <div className={clsx(c.preview, 'markdown-body')} hidden={tabIndex !== 1}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
