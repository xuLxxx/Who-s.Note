import React, { useEffect } from "react";
import useQuery from "@/shared/hooks/useQuery";
import CalendarCom from "@/components/Calendar";

import "./index.less";
import { Card } from "antd";
import TodoCom from "@/components/Todo";

function TodoContainer(): JSX.Element {
  const query = useQuery();
  return (
    <>
      <div className="page-home">
        <CalendarCom></CalendarCom>
        <div className="todo-container">
          <TodoCom></TodoCom>
        </div>
      </div>
    </>
  );
}

export default TodoContainer;
