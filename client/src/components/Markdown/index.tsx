import React, { HTMLProps } from "react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import "./index.less";
// import ""

import AnchorNav from "@/shared/hooks/useAnchor";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Card, Divider } from "antd";

type MyComponentProps = {} & HTMLProps<HTMLDivElement>;

const markdown = `# first 1
大标题内容
## content 2
副标题内容
## content 2
副标题内容
# Second 1
一号标题
## H-Header 2
二号标题
### S-Header 3
三号标题

# 列表

* 列表1
* 列表2

****

**codeShow**

~~~js
const a = 1;
console.log("hello world");
~~~
`;

export default function MarkdownPage(): JSX.Element {
  let index = 0;
  const codeTheme =
    useSelector((state: RootState) => state.setting.theme) === "dark"
      ? dark
      : docco;
  const collapse = useSelector((state: RootState) => state.setting.collapse);
  return (
    <>
      <div className="flex">
        {collapse && (
          <>
            <div className="anchor">
              <Card>
                <div className="title">目录</div>
                <div className="nav">
                  <AnchorNav></AnchorNav>
                </div>
              </Card>
            </div>
          </>
        )}
        <div className="markdown">
          <Card className="md-container">
            <Markdown
              children={markdown}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props;
                  // 匹配指定语言
                  const match: any = /language-(\w+)/.exec(className || "");
                  return (
                    <>
                      {match ? (
                        <SyntaxHighlighter
                          showLineNumbers={true}
                          language={match && match[1]}
                          style={codeTheme}>
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          {...rest}
                          className={`${className} inlineCodeClass`}>
                          {children}
                        </code>
                      )}
                    </>
                  );
                },
                h1(props) {
                  const { children } = props;
                  return (
                    <h1 className="heading" id={"heading-" + ++index}>
                      {children}
                    </h1>
                  );
                },
                h2(props) {
                  const { children } = props;
                  return (
                    <h2 className="heading" id={"heading-" + ++index}>
                      {children}
                    </h2>
                  );
                },
                h3(props) {
                  const { children } = props;
                  return (
                    <h3 className="heading" id={"heading-" + ++index}>
                      {children}
                    </h3>
                  );
                },
                h4(props) {
                  const { children } = props;
                  return (
                    <h4 className="heading" id={"heading-" + ++index}>
                      {children}
                    </h4>
                  );
                },
                h5(props) {
                  const { children } = props;
                  return (
                    <h5 className="heading" id={"heading-" + ++index}>
                      {children}
                    </h5>
                  );
                },
                h6(props) {
                  const { children } = props;
                  return (
                    <h6 className="heading" id={"heading-" + ++index}>
                      {children}
                    </h6>
                  );
                },
              }}></Markdown>
          </Card>
        </div>
      </div>
    </>
  );
}
