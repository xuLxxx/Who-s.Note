// Npm UI Lib
import React, { useCallback } from "react";
import Markdown from "react-markdown";
import { Dispatch, RootState } from "@/store";
// Plugins
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  duotoneDark as dark,
  duotoneLight as light,
} from "react-syntax-highlighter/dist/esm/styles/prism";
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
import AnchorNav from "@/components/Anchor";
import useQuery from "@/shared/hooks/useQuery";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
// Components
import {  Card, Divider, Image,  Switch } from "antd";
import LoadingComponent from "../Loading";
import { LazyImg } from "../LazyImg";

function MarkdownPage(): JSX.Element {
  const [markdown, setMarkdown] = React.useState<string>("");
  const location = useLocation();
  const query: any = useQuery();
  const getMarkdown = useCallback(() => {
    api.getMarkdownByid(Number(query.get("id"))).then((res) => {
      api
        .getMarkdownHtml("/uploads" + res.data.fileUrl.split("/uploads")[1])
        //.then((resp) => resp.text())
        .then((txt) => setMarkdown(txt));
    });
  }, [location.search]);

  React.useMemo(() => {
    console.log("重新渲染");
    setMarkdown("Loading");
    getMarkdown();
  }, [location.search]);
  let index = 0;
  const codeTheme =
    useSelector((state: RootState) => state.setting.theme) === "dark"
      ? dark
      : light;
  const collapse = useSelector((state: RootState) => state.setting.collapse);
  const lazy = useSelector((state: RootState) => state.setting.lazyImg);
  const dispatch = useDispatch<Dispatch>();
  const changeLazy = (checked: boolean) => {
    dispatch({ type: "setting/changeLazyImg", payload: checked });
  };

  return (
    <>
      <div className="flex">
        {collapse && markdown !== "Loading" && (
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
              <Card>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  checked={lazy}
                  onChange={(checked) => {
                    changeLazy(checked);
                  }}
                />
                <span style={{ verticalAlign: "middle" }}> 图片懒加载模式</span>
              </Card>
            </div>
          </>
        )}
        <div className="markdown">
          <Card className="md-container">
            {markdown === "Loading" ? (
              <LoadingComponent
                style={{ width: "100%", height: "80vh" }}></LoadingComponent>
            ) : (
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
                  img(props) {
                    return !lazy ? (
                      <Image
                        className="image"
                        alt={"渲染错误，请上传相关图片至服务器"}
                        src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                          props.src
                        }`}></Image>
                    ) : (
                      <LazyImg
                        src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                          props.src
                        }`}
                        alt={"渲染错误，请上传相关图片至服务器"}
                      />
                    );
                  },
                }}></Markdown>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default React.memo(MarkdownPage);
