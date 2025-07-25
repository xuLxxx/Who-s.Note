import "./index.less";
import MarkdownPage from "@/components/Markdown";
import useQuery from "@/shared/hooks/useQuery";

function HomeContainer(): JSX.Element {
  const query = useQuery();
  return (
    <>
      <div className="page-home">
        {/* {query.size ? <MarkdownPage /> : ""} */}
        {/* <MarkdownPage /> */}
        {query.size ? (
          <MarkdownPage />
        ) : (
          <div className="home-welcome">
            <div className="welcome-word">欢迎来到</div>
            <div className="welcome-word">Who's Note 笔记系统</div>
          </div>
        )}
      </div>
    </>
  );
}

export default HomeContainer;
