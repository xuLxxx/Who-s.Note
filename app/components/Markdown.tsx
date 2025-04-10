import React, { ReactNode, useState } from "react";
import { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageStyle,
  TextStyle,
  ScrollView,
  RefreshControl,
} from "react-native";
import Markdown, {
  CustomToken,
  MarkedLexer,
  MarkedTokenizer,
  Renderer,
  RendererInterface,
} from "react-native-marked";
import { Image } from "react-native-elements";

import { useAppDispatch, useAppSelector } from "@/hooks/useStore";

import { getMarkdownByid, getMarkdownHtml } from "@/api/markdown";
import FastImage from "react-native-fast-image";
import { ExternalLink } from "./ExternalLink";

interface List {
  id: number;
  userId: number;
  title: string;
  pic: string;
  fileUrl: string;
}

interface Props {
  list: List[];
}

export default function MarkdownCom({ onRef = () => {} }: any): JSX.Element {
  const [markdown, setMarkdown] = useState(
    "```欢迎来到Who's Note,点击下列列表即可打开笔记```"
  );
  const [Title, setTitle] = useState("");
  const { id } = useAppSelector((state) => state.markdown);
  const markdownRef = React.useRef(null);

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = (timeout: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  class CustomTokenizer extends MarkedTokenizer<CustomToken> {
    // Override
    // codespan(this: MarkedTokenizer<CustomToken>, src: string) {
    //   const match = src.match(/^\$+([^\$\n]+?)\$+/);
    //   if (match?.[1]) {
    //     const text = match[1].trim();
    //     const token: CustomToken = {
    //       type: "custom",
    //       raw: match[0], // should be the exact regex pattern match
    //       identifier: "latex", // Uniq identifier for the token
    //       tokens: MarkedLexer(text), // optional, can be used if the markdown contains children
    //       args: {
    //         // optional, can be used to send more information to the renderer
    //         text: text,
    //       },
    //     };
    //     return token;
    //   }
    //   return super.codespan(src);
    // }
  }

  class CustomRenderer extends Renderer implements RendererInterface {
    index = 0;
    constructor() {
      super();
    }

    // custom(
    //   identifier: string,
    //   _raw: string,
    //   _children?: ReactNode[],
    //   args?: Record<string, unknown>
    // ): ReactNode {
    //   const text = args?.text as string;
    //   if (identifier === "latex") {
    //     const styles: any = {
    //       padding: 16,
    //       minWidth: "100%",
    //       backgroundColor: "#f6f8fa",
    //     };
    //     return this.code(text.trim(), "latex", styles);
    //   }
    //   return null;
    // }

    image(uri: string, _alt?: string, _style?: ImageStyle): ReactNode {
      // console.log(process.env["EXPO_PUBLIC_API_URL"] + "/uploads/" + uri);
      const url = process.env["EXPO_PUBLIC_API_URL"] + "/uploads/" + uri;
      return (
        <Image
          key={this.getKey()}
          // containerStyle={styles.image}
          alt={"渲染错误，请上传相关图片至服务器"}
          style={styles.image}
          source={{
            uri: url,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      );
    }
    link(
      children: string | ReactNode[],
      href: string,
      styles?: TextStyle
    ): ReactNode {
      return (
        <ExternalLink key={this.getKey()} style={styles} href={href}>
          {children}
        </ExternalLink>
      );
    }
    // Override
    // heading(text: string, style: TextStyle): ReactNode {
    //   return (
    //     <Text
    //       key={this.getKey()}
    //       style={styles.heading}
    //       className="heading"
    //       id={"heading&" + ++this.index}>
    //       {text}
    //     </Text>
    //   );
    // }
  }

  const renderer = new CustomRenderer();
  const tokenizer = new CustomTokenizer();

  useEffect(() => {
    console.log(id);
    onRef(markdownRef);
    if (!id) {
      setMarkdown("# 请选择文章");
      setTitle("请选择文章");
    }

    if (id) {
      getMarkdownByid(id).then((res) => {
        setTitle(res.data.title);
        getMarkdownHtml("/uploads" + res.data.fileUrl.split("/uploads")[1])
          //.then((resp) => resp.text())
          .then((txt) => {
            setMarkdown(txt);

            // let hNodeList: any = markdownRef.current;
            // console.log("hNodelist", hNodeList); //暂时无法 获取目录 源代码Rerender.ts将h1,h2,....都混为heading
          });
      });
    }
  }, [id]);

  return (
    <>
      {/* <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }></ScrollView> */}
      {/* 虚拟列表不可被普通滚动容器包裹，所以无法上滑刷新 */}
      <View>
        <Text style={styles.text}>· {Title}</Text>
      </View>
      <View style={styles.list} ref={markdownRef}>
        <View>
          <Markdown
            value={markdown}
            flatListProps={{
              initialNumToRender: 2,
            }}
            renderer={renderer}
            tokenizer={tokenizer}></Markdown>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#fff",
    width: "100%",
    paddingBottom: 45,
  },
  item: {
    width: 80,
    height: 80,
    marginHorizontal: 2,
    borderRadius: 10,
    aspectRatio: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 800,
    color: "#000",
  },
  image: {
    width: `auto`,
    height: 200,
    resizeMode: "contain",
  },
});
