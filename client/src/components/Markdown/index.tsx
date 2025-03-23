import React from "react";
import Markdown from "react-markdown";
import { RootState } from "@/store";
// Plugins
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGemoji from "remark-gemoji";
import rehypeRaw from "rehype-raw";
// Api
import * as api from "@/api/file";
// Less
import "./index.less";
// Hooks
import AnchorNav from "@/shared/hooks/useAnchor";
import useQuery from "@/shared/hooks/useQuery";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
// Components
import { Card, Divider } from "antd";
import LoadingComponent from "../Loading";

export default function MarkdownPage(): JSX.Element {
  const [markdown, setMarkdown] = React.useState<string>("");
  const location = useLocation();
  const query: any = useQuery();
  React.useMemo(() => {
    setMarkdown("Loading...");
    api.getMarkdownByid(Number(query.get("id")) as number).then((res) => {
      api
        .getMarkdownHtml("/uploads" + res.data.fileUrl.split("/uploads")[1])
        // .then((resp) => resp.text())
        .then((txt) => setMarkdown(txt));
    });
  }, [location.search]);
  let index = 0;
  const codeTheme =
    useSelector((state: RootState) => state.setting.theme) === "dark"
      ? dark
      : docco;
  const collapse = useSelector((state: RootState) => state.setting.collapse);

  return (
    <>
      <div className="flex">
        {collapse && markdown !== "Loading..." && (
          <>
            <div className="anchor">
              <Card>
                <div className="title">目录</div>
                <div className="nav">
                  <AnchorNav markdown={markdown}></AnchorNav>
                </div>
              </Card>
              <Divider></Divider>
              <Card>设置-&gt;删除-&gt;修改标题、封面</Card>
              <Card>修改内容</Card>
              <Card>评论</Card>
            </div>
          </>
        )}
        <div className="markdown">
          <Card className="md-container">
            <Markdown
              children={markdown}
              remarkPlugins={[remarkGfm, remarkMath, remarkGemoji]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
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
