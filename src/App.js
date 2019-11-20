import React, { useState, useCallback } from 'react';
import DraftEditor from './DraftEditor';
// import { EditorState, ContentState } from 'draft-js';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
// import { draftToMarkdown } from 'markdown-draft-js';
// import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import { Grid } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

const useStyles = createUseStyles(theme => ({
  root: {
    minHeight: '100vh',
    padding: 100
  },
  panel: {
    display: 'flex'
  },
  panel_left: {
    borderRadius: [4, 0, 0, 4],
    background: '#DCDBDC'
  },
  panel_right: {
    borderRadius: [0, 4, 4, 0],
    background: '#373737'
  }
}));

// const noop = () => () => { };

const App = () => {
  const c = useStyles();
  const [richEditorState, setRichEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')));
  // const [markdownEditorState, setMarkdownEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')));
  // const [onRichEditorChangeFn, setOnRichEditorChangeFn] = useState(noop);
  // const [onMarkdownEditorChangeFn, setOnMarkdownEditorChangeFn] = useState(noop);

  const onChange = useCallback((e) => {
    // console.log(1);
    setRichEditorState(e);
    // const raw = convertToRaw(e.getCurrentContent());
    // console.log(raw);
    // const md = draftjsToMd(raw);
    // const newMarkdownEditorState = EditorState.createWithContent(ContentState.createFromText(md));
    // setMarkdownEditorState(newMarkdownEditorState);
    // setOnRichEditorChangeFn(noop);
    // setOnMarkdownEditorChangeFn(onMarkdownEditorChange);
  }, [setRichEditorState]);

  // const onMarkdownEditorChange = useCallback((e) => {
  //   // console.log(2);
  //   setMarkdownEditorState(e);
  //   const md = e.getCurrentContent().getPlainText();
  //   const rawData = mdToDraftjs(md);
  //   const contentState = convertFromRaw(rawData);
  //   const newRichEditorState = EditorState.createWithContent(contentState);
  //   setRichEditorState(newRichEditorState);
  //   setOnMarkdownEditorChangeFn(noop);
  //   setOnRichEditorChangeFn(onRichEditorChange);
  // }, []);

  // useEffect(() => {
  //   setOnRichEditorChangeFn(onRichEditorChange);
  // }, []);

  return (
    <Grid container className={c.root}>
      <Grid item xs={6} className={clsx(c.panel, c.panel_left)}>
        <DraftEditor
          draftId="rich"
          editorState={richEditorState}
          onChange={onChange}
          showToolbar
        />
      </Grid>
    </Grid>
  );
}

export default App;
