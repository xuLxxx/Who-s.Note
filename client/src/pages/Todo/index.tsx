import React, { useEffect } from "react";
import "./index.less";
import useQuery from "@/shared/hooks/useQuery";

function TodoContainer(): JSX.Element {
  const query = useQuery();
  return (
    <>
      <div className="page-home">
        <div>Todo List </div>
      </div>
    </>
  );
}

export default TodoContainer;
