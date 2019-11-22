import React, { useState, useCallback } from 'react';
import DraftEditor from './DraftEditor';
import { EditorState, ContentState } from 'draft-js';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
// import sanitizeHtml from 'sanitize-html';
import 'github-markdown-css/github-markdown.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.min';
import 'highlight.js/styles/github.css';
import cheerio from "cheerio";
import { Grid, Tabs, Tab, Paper } from "@material-ui/core";
import showdown from "showdown";

const converter = new showdown.Converter();

// const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
//   'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
//   'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'];

// const allowedAttributes = {
//     '*': [ 'href', 'name', 'target', 'class' ]
// };

const useStyles = createUseStyles(theme => ({
  root: {
    minHeight: '100vh',
    padding: 20
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

\`\`\`js
  const x = 33;
\`\`\`

<md-tabs>
  <md-tab title="Preview">
    ## Shopping
    - apples
    - oranges

    \`\`\`jsx
      import React from 'react';
      
      export default (props) => {
        return <div>Hello World</div>;
      }
    \`\`\`
  </md-tab>
  <md-tab title="HTML">
    ## Furniture
    - table
    - chairs

    \`\`\`html
      <div style="color:green;" aria-lena="Hello!">
        content
      </div>
    \`\`\`
  </md-tab>
  <md-tab title="CSS">
    \`\`\`css
      .my-class {
        color: red;
      }
    \`\`\`
  </md-tab>
</md-tabs>

`;

const getTabs = ($, $tabs) => {
  const tabs = $tabs.toArray().map(e => {
    const $innerTabs = $(e).find("md-tab");
    const innerTabs = $innerTabs.toArray().map((e2, i2) => {
      const $tab = $(e2);
      const title = $tab.attr("title");
      const md1 = $tab.html();
      const txt = document.createElement("textarea");
      txt.innerHTML = md1;
      const md = txt.value;
      const leadingWhiteSpaceRegex = /^(\r|\n)*(\s*)/;
      const whiteSpace = leadingWhiteSpaceRegex.exec(md);
      const lineWhiteSpaceRegex = new RegExp(`^${whiteSpace[2]}`);
      const mdCleaned = md
        .split("\n")
        .map(line => {
          const cleanedLine = line.replace(lineWhiteSpaceRegex, '');
          return cleanedLine;
        })
        .join("\n");
      const content = converter.makeHtml(mdCleaned);
      const div = document.createElement('div');
      div.innerHTML = content;
      div.querySelectorAll('pre code').forEach((element) => {
        Prism.highlightElement(element);
      });
      const highlightedHtml = div.innerHTML;

      return { id: `tab-${i2}`, title, content: highlightedHtml };
    });
    return innerTabs;
  });
  return tabs;
};

const getHtmlArr = value => {
  const $ = cheerio.load(value);
  const $tabs = $("md-tabs");
  const tabs = getTabs($, $tabs);
  $tabs.replaceWith("[MD_TAB]");

  const htmlArr = $("body")
    .text()
    .split("[MD_TAB]");
  const output = htmlArr.map((html1, i) => {
    const md1 = converter.makeHtml(html1);
    const txt = document.createElement("textarea");
    txt.innerHTML = md1;
    const md = txt.value;
    const div = document.createElement('div');
    div.innerHTML = md;
    div.querySelectorAll('pre code').forEach((element) => {
      Prism.highlightElement(element);
    });
    const highlightedHtml = div.innerHTML;
    const item = [{ id: `md-${i}`, type: "md", content: highlightedHtml }];
    if (tabs[i]) {
      item.push({ id: `tabs-${i}`, type: "tabs", content: tabs[i] });
    }
    return item;
  });
  return output.flat();
};

const getComponent = htmlArr => {
  return () => {
    return () => {
      const initialTabIndexes = htmlArr
        .filter(line => line.type === "tabs")
        .reduce((acc, tab) => {
          acc[tab.id] = 0;
          return acc;
        }, {});

      const [tabIndexes, setTabIndexes] = useState(initialTabIndexes);
      const handleChange = (e, id, index) => {
        setTabIndexes(p => ({ ...p, [id]: index }));
      };

      return (
        <div>
          {htmlArr.map(({ id, type, content }) => {
            if (type === "md") {
              return (
                <div key={id} dangerouslySetInnerHTML={{ __html: content }} />
              );
            } else if (type === "tabs") {
              return (
                <div key={id}>
                  <Tabs
                    value={tabIndexes[id]}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, i) => handleChange(e, id, i)}
                  >
                    {content.map(({ id, title }) => {
                      return <Tab key={id} label={title} />;
                    })}
                  </Tabs>
                  <div>
                    {content.map(
                      ({ id: tabId, content: tabContent }, index) => {
                        return (
                          <div
                            key={tabId}
                            hidden={tabIndexes[id] !== index}
                            dangerouslySetInnerHTML={{ __html: tabContent }}
                          />
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    };
  };
};

const App = () => {
  const c = useStyles();
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(defaultText)));
  const [tabIndex, setTabIndex] = useState(0);
  const [MdComponent, setMdComponent] = useState(() => () => null);

  const onChange = useCallback((e) => {
    setEditorState(e);
  }, [setEditorState]);

  const handleChange = (e, index) => {
    setTabIndex(index);
    if (index === 1) {
      const text = editorState.getCurrentContent().getPlainText();
      const htmlArr = getHtmlArr(text);
      const mdComponent = getComponent(htmlArr);
      setMdComponent(mdComponent);
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
            <MdComponent />
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
