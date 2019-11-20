import React, { useState } from 'react';
import Editor from 'draft-js-plugins-editor';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

const useStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  editorContainer: {
    padding: 20
  },
  editor: {
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    cursor: 'text',
    padding: 16,
    borderRadius: 2,
    background: '#fefefe'
  }
}));

const DraftEditor = (props) => {
  const {
    style,
    className,
    forwardedRef,
    editorState,
    onChange,
    ...other
  } = props;

  const c = useStyles();

  const [{ plugins }] = useState(() => {
    const plugins = [];
    return {
      plugins
    }
  });

  const editor = React.useRef(null);
  const focusEditor = () => {
    editor.current.focus();
  };

  return (
    <div className={clsx(c.root, className)} style={style}>
      <div className={c.editorContainer}>
        <div className={c.editor} onClick={focusEditor}>
          <Editor
            ref={editor}
            plugins={plugins}
            editorState={editorState}
            onChange={onChange}
            {...other}
          />
        </div>
      </div>
    </div>
  );
};

export default DraftEditor;