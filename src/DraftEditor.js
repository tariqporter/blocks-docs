import React, { useState, useEffect } from 'react';
import Editor from 'draft-js-plugins-editor';
// import { EditorState, SelectionState } from 'draft-js';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import { draftjsToMd } from 'draftjs-md-converter';
import { mdToDraftjs2 } from './mdToDraftjs2';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  // HeadlineOneButton,
  // HeadlineTwoButton,
  // HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  // CodeBlockButton,
} from 'draft-js-buttons';
// import Prism from 'prismjs';
// import createPrismPlugin from 'draft-js-prism-plugin'; 
// import PrismDecorator from 'draft-js-prism';
import Prism from 'prismjs';
import createPrismPlugin from 'draft-js-prism-plugin';
// import createMarkdownPlugin from 'draft-js-markdown-plugin';

import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

const useStyles = createUseStyles(theme => ({
  root: {
    width: '100%'
  },
  toolbar: {
    height: 20,
    marginBottom: 20
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

const MarkdownButton = (props) => {
  const {
    getEditorState,
    setEditorState,
    theme
  } = props;
  const [mdActive, setMdActive] = useState(true);

  // const toggleMarkdown = () => {
  //   const currentEditorState = getEditorState();
  //   if (!mdActive) {
  //     const raw = convertToRaw(currentEditorState.getCurrentContent());
  //     const md = draftjsToMd(raw);
  //     const newMarkdownEditorState = EditorState.createWithContent(ContentState.createFromText(md));
  //     setEditorState(newMarkdownEditorState);
  //   } else {

  //     const md = currentEditorState.getCurrentContent().getPlainText();
  //     const rawData = mdToDraftjs2(md);
  //     // console.log(md, rawData);
  //     const contentState = convertFromRaw(rawData);
  //     const newRichEditorState = EditorState.createWithContent(contentState);
  //     setEditorState(newRichEditorState);
  //   }
  //   setMdActive(p => !p);
  // };

  const toggleCodeBlock = () => {
    const editorState = getEditorState();
    const raw = convertToRaw(editorState.getCurrentContent());
    // console.log(raw);
    const blockMap = raw.blocks;
    const block = blockMap[0];
    const data = block.getData().merge({ language: 'javascript' });
    const newBlock = block.merge({ data });
    console.log(blockMap);
    // const newContentState = editorState.getCurrentContent().merge({
    //   blockMap: blockMap.set(key, newBlock),
    //   selectionAfter: currentSelection
    // });

    // setEditorState(EditorState.push(editorState, newContentState, "change-block-data"));

    // Now that code block will be highlighted as JavaScript!
    // this.setState({
    //   editorState: EditorState.push(editorState, newContentState, "change-block-data")
    // })
  };

  return (
    <div className={theme.buttonWrapper} onMouseDown={(e) => e.preventDefault()}>
      <button className={clsx(theme.button, mdActive && theme.active)} onClick={toggleCodeBlock}>
        <svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M950.154 192H73.846C33.127 192 0 225.12699999999995 0 265.846v492.308C0 798.875 33.127 832 73.846 832h876.308c40.721 0 73.846-33.125 73.846-73.846V265.846C1024 225.12699999999995 990.875 192 950.154 192zM576 703.875L448 704V512l-96 123.077L256 512v192H128V320h128l96 128 96-128 128-0.125V703.875zM767.091 735.875L608 512h96V320h128v192h96L767.091 735.875z" /></svg>
      </button>
    </div>
  )
};

const DraftEditor = (props) => {
  const {
    draftId,
    style,
    className,
    forwardedRef,
    editorState,
    onChange,
    showToolbar = false,
    ...other
  } = props;

  const c = useStyles();

  // console.log(onChange);

  // const [prevEditorState, setPrevEditorSate] = useState(editorState);
  // useEffect(() => {
  //   console.log(draftId, prevEditorState === editorState);
  //   setPrevEditorSate(editorState);
  // }, [editorState]);

  const [{ plugins, Toolbar }] = useState(() => {
    const staticToolbarPlugin = createToolbarPlugin();
    const { Toolbar } = staticToolbarPlugin;
    const prismPlugin = createPrismPlugin({
      prism: Prism
    });
    // const languages = {
    //   js: 'JavaScript'
    // };
    // const markdownPlugin = createMarkdownPlugin({ languages })
    const plugins = [staticToolbarPlugin, prismPlugin];
    return {
      plugins, Toolbar
    }
  });

  const editor = React.useRef(null);
  const focusEditor = () => {
    editor.current.focus();
  };

  return (
    <div className={clsx(c.root, className)} style={style}>
      <div className={c.toolbar}>
        {showToolbar && <Toolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                {/* <CodeBlockButton {...externalProps} /> */}
                {/* <MarkdownButton {...externalProps} /> */}
              </div>
            )
          }
        </Toolbar>}
      </div>
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