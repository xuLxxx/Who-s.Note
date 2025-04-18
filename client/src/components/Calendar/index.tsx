import React, { memo, useEffect } from "react";
//components
import FullCalendar from "@fullcalendar/react";
//plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
// import resourseTimelinePlugin from "@fullcalendar/resource-timeline";
//styles
import "./index.less";
import {
  DateSelectArg,
  EventAddArg,
  EventChangeArg,
  EventClickArg,
  EventContentArg,
  EventInput,
  EventRemoveArg,
  formatDate,
} from "@fullcalendar/core/index.js";

import { MODAL_EVENTS } from "./constant";
import {
  Button,
  Card,
  ColorPicker,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Switch,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";

import dayjs, { Dayjs } from "dayjs";
import store, { RootState } from "@/store";
import { useSelector } from "react-redux";
//types
import type { _EventApi } from "./index.d";
// import { RangeValueType } from "antd/es/date-picker/generatePicker";
const { RangePicker } = DatePicker;

type FieldType = {
  title: string;
  duration?: Array<Dayjs>;
  reStyle: boolean;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
};

function CalendarComponent(): JSX.Element {
  // CALENDAR
  const { collapse } = useSelector((state: RootState) => state.setting);
  const [events, setEvents] = React.useState<EventInput>();
  const calendarRef = React.useRef<FullCalendar>(null);
  const [currentEvents, setCurrentEvents] = React.useState<_EventApi[]>();

  // MODAL
  const [editModal, setEditModal] = React.useState<[boolean, number]>([
    false,
    0,
  ]);
  const [editEvent, setEditEvent] = React.useState<_EventApi>();
  const [addEvent, setAddEvent] = React.useState<DateSelectArg>();
  const [confirmEditLoading, setConfirmEditLoading] = React.useState(false);

  //   const currentEvents = React.useMemo(() => {
  //     return events.filter((event) => {
  //       return getEventDifferenceInDays(event) >= 0;
  //     });
  //   });

  // const handleDateClick = (arg: DateClickArg) => {
  //   console.log(arg);
  // };

  const handleDateSelected = (selectInfo: DateSelectArg) => {
    console.log(selectInfo);
    setAddEvent(selectInfo);
    setEditModal([true, 1]);
    // let title = prompt("Please enter a new title for your event");
    // let calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: "database",
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay,
    //   });
    // }
  };

  function handleEventClick(clickInfo: EventClickArg) {
    // 点击直接删除事件
    // if (confirm(`你确定要删除'${clickInfo.event.title}'的事件吗？`)) {
    //   clickInfo.event.remove();
    //   //   console.log(events);
    // }
    setEditEvent(clickInfo.event);
    setEditModal([true, 0]);
  }

  function handleEvents(events: _EventApi[]) {
    setCurrentEvents(events);
  }
  const handleAddEvent = (event: EventAddArg) => {
    // setEvents((prevEvents) => [...prevEvents, event]);
    console.log(event);
  };
  const handleChangeEvent = (event: EventChangeArg) => {
    console.log(event);
    // setEvents((prevEvents) => {
    //   const updatedEvents = [...prevEvents];
    //   const index = updatedEvents.findIndex((e) => e.id === event.id);
    //   if (index !== -1) {
    //     updatedEvents[index] = event;
    //   }
    //   return updatedEvents;
    // });
  };
  const handleRemoveEvent = (event: EventRemoveArg) => {
    // setEvents((prevEvents) => {
    //   const updatedEvents = [...prevEvents];
    //   const index = updatedEvents.findIndex((e) => e.id === event.id);
    //   if (index !== -1) {
    //     updatedEvents.splice(index, 1);
    //   }
    //   return updatedEvents;
    // });
    console.log(event);
  };
  const onModalOK = () => {
    setAddEvent(undefined);
    setEditEvent(undefined);
    setEditModal([false, 0]);
  };
  const onModalCancel = () => {
    setAddEvent(undefined);
    setEditEvent(undefined);
    setEditModal([false, 0]);
  };
  useEffect(() => {
    console.log(currentEvents);
  }, []);
  return (
    <>
      <div
        className="calendar-container"
        style={{
          width: collapse ? "calc(100vw - 100px)" : "calc(100vw - 240px)",
        }}>
        <Card
          className="calendar"
          style={{
            width: collapse ? "calc(100vw - 100px)" : "calc(100vw - 240px)",
          }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            editable={true}
            selectable={true}
            select={handleDateSelected}
            selectMirror={false}
            dayMaxEvents={false}
            locale={"zh-cn"}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialEvents={events}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            // Controll database updates with the following lifecycle callbacks:
            eventAdd={handleAddEvent} // called when an event is created
            eventChange={handleChangeEvent} // called when an event is changed
            eventRemove={handleRemoveEvent} // called when an event is deleted
            eventDidMount={function (info) {
              if (info.event.extendedProps.status === "done") {
                // Change background color of row
                info.el.style.backgroundColor = "red";

                // Change color of dot marker
                var dotEl = info.el.getElementsByClassName(
                  "fc-event-dot"
                )[0] as HTMLElement;
                if (dotEl) {
                  dotEl.style.backgroundColor = "white";
                }
              }
            }}
          />
        </Card>
      </div>
      {/* <Sidebar
        weekendsVisible={weekendsVisible}
        handleWeekendsToggle={handleWeekendsToggle}
        currentEvents={currentEvents}
      /> */}
      <Modal
        title={MODAL_EVENTS[editModal[1] as number].title}
        open={editModal[0]}
        onOk={onModalOK}
        footer={null}
        confirmLoading={confirmEditLoading}
        onCancel={onModalCancel}>
        {editModal[1] === 0 && <EditEvents event={editEvent} />}
        {editModal[1] === 1 && (
          <AddEvents
            event={addEvent as DateSelectArg}
            ok={onModalOK}
            cancel={onModalCancel}
          />
        )}
      </Modal>
    </>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  // console.log(eventContent);
  return (
    <>
      <div
        style={
          eventContent.event.allDay
            ? {
                backgroundColor: eventContent.backgroundColor,
                color: eventContent.textColor,
                padding: "4px",
              }
            : {
                backgroundColor: eventContent.backgroundColor,
                color: eventContent.textColor,
                padding: "0px 2px 0 2px",
                borderRadius: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }
        }>
        <div>{eventContent.timeText}</div>
        <span>{eventContent.event.title}</span>
      </div>
    </>
  );
}

function Sidebar({
  weekendsVisible,
  handleWeekendsToggle,
  currentEvents,
}: any) {
  return (
    <div className="demo-app-sidebar">
      <div className="demo-app-sidebar-section">
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className="demo-app-sidebar-section">
        <label>
          <input
            type="checkbox"
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}></input>
          toggle weekends
        </label>
      </div>
      <div className="demo-app-sidebar-section">
        <h2>All Events ({currentEvents?.length})</h2>
        <ul>
          {currentEvents?.map((event: _EventApi) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SidebarEvent({ event }: { event: _EventApi }): JSX.Element {
  // console.log("currentEvent", event);
  return (
    <li key={event.id}>
      <b>
        start:{" "}
        {formatDate(event.start as string, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}{" "}
        \/allDay: {event.allDay ? "true, " : "false, "}
        \/end :{" "}
        {formatDate(event.end as string, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      \/title:<i>{event.title}</i>
    </li>
  );
}

function EditEvents({ event }: { event: _EventApi | undefined }): JSX.Element {
  console.log("EDIT", event);
  return (
    <>
      <EventsForm event={event}></EventsForm>
    </>
  );
}

function EventsForm({ event }: { event: _EventApi | undefined }): JSX.Element {
  const onChangeAllDay = (checked: boolean) => {
    event?.setAllDay(checked);
  };
  const [title, setTitle] = React.useState(event?.title);
  return (
    <>
      <Form>
        <Form.Item<FieldType>
          label="标题"
          rules={[{ required: true, message: "请输入标题！" }]}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => event?.setProp("title", title)}></Input>
        </Form.Item>
        <Form.Item label="起止时间">
          <RangePicker
            showTime={!event?.allDay}
            value={[
              dayjs(event?.start?.toString()),
              event?.end
                ? dayjs(event?.end?.toString())
                : dayjs(event?.start?.toString()).add(1, "day"),
            ]}
            onChange={(_, dateString) => {
              event?.setStart(dateString?.[0]);
              event?.setEnd(dateString?.[1]);
            }}
          />
        </Form.Item>
        <Form.Item label="自定义颜色">
          <Switch
            value={event?.extendedProps.reStyle}
            onChange={() => {
              event?.setExtendedProp("reStyle", !event.extendedProps.reStyle);
              event?.setProp("textColor", "");
              event?.setProp("backgroundColor", "");
              event?.setProp("borderColor", "");
            }}
          />
        </Form.Item>
        <Form.Item label="全天事件">
          <Switch value={event?.allDay} onChange={onChangeAllDay} />
        </Form.Item>
        {event?.extendedProps?.reStyle && (
          <ChooseColor event={event}></ChooseColor>
        )}
      </Form>
    </>
  );
}

function changeEventColor(
  name: string,
  value: string,
  event: _EventApi | undefined
): void {
  console.log("changeEventColor", name, value);
  event?.setProp(name, value);
}

function AddEvents({
  event,
  ok,
  cancel,
}: {
  event: DateSelectArg;
  ok: () => void;
  cancel: () => void;
}): JSX.Element {
  console.log([dayjs(event?.startStr), dayjs(event?.endStr)]);
  const [reStyle, setReStyle] = React.useState(false);
  const [start, setStart] = React.useState<string>(event?.startStr);
  const [end, setEnd] = React.useState<string>(event?.endStr);
  const [form] = Form.useForm();
  const [style, setStyle] = React.useState<Record<string, string>>({
    borderColor: "",
    backgroundColor: "",
    textColor: "",
  });
  const [loading, setLoading] = React.useState(false);
  const onOk = (
    value: DatePickerProps["value"] | RangePickerProps["value"]
  ) => {
    console.log("onOk: ", value);
  };
  const setColor = (name: string, value: string) => {
    setStyle({ ...style, [name]: value });
    console.log(name, value);
  };
  const addEvent = (values: any) => {
    if (!values.title) return;
    event?.view.calendar.addEvent({
      id: (~~(Math.random() * 100)).toString(),
      title: values.title,
      start: start,
      end: end,
      allDay: event?.allDay,
      ...style,
      extendedProps: {
        reStyle: reStyle,
      },
    });
    form.resetFields();
    ok();
  };
  const addEventFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    setStart(event?.startStr);
    setEnd(event?.endStr);
    return () => {};
  }, [event]);
  return (
    <>
      <Form
        name="basic"
        form={form}
        onFinish={addEvent}
        onFinishFailed={addEventFailed}
        autoComplete="off">
        <Form.Item<FieldType>
          label="标题"
          name="title"
          rules={[{ required: true, message: "请输入标题！" }]}>
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="起止时间">
          <RangePicker
            showTime={!event?.allDay}
            // defaultValue={[dayjs(event?.startStr), dayjs(event?.endStr)]}
            // format={"YYYY-MM-DD HH:mm:ss"}
            value={[dayjs(event?.startStr), dayjs(event?.endStr)]}
            onChange={(value, dateString) => {
              // console.log("Selected Time: ", value);
              // console.log("Formatted Selected Time: ", dateString);
              setStart(dateString?.[0]?.toString()!);
              setEnd(dateString?.[1]?.toString()!);
            }}
            onOk={onOk}
          />
        </Form.Item>
        <Form.Item label="自定义颜色" name="reStyle">
          <Switch value={reStyle} onChange={() => setReStyle(!reStyle)} />
        </Form.Item>
        {reStyle && (
          <>
            <ChooseColor event={undefined} set={setColor}></ChooseColor>
          </>
        )}
        <Form.Item className="event-modal-add">
          <Button type="default" onClick={cancel}>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginLeft: 10 }}>
            添加
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

function ChooseColor({
  event,
  set,
}: {
  event: _EventApi | undefined;
  set?: (name: string, value: string) => void;
}): JSX.Element {
  return (
    <>
      <Form.Item label="边框颜色">
        <ColorPicker
          value={event?.borderColor}
          onChangeComplete={(value) => {
            event &&
              changeEventColor("borderColor", value.toHexString(), event);
            set && set("borderColor", value.toHexString());
          }}
        />
      </Form.Item>
      <Form.Item label="背景颜色">
        <ColorPicker
          value={event?.backgroundColor}
          onChangeComplete={(value) => {
            event &&
              changeEventColor("backgroundColor", value.toHexString(), event);
            set && set("backgroundColor", value.toHexString());
          }}
        />
      </Form.Item>
      <Form.Item label="文本颜色">
        <ColorPicker
          value={event?.textColor}
          onChangeComplete={(value) => {
            event && changeEventColor("textColor", value.toHexString(), event);
            set && set("textColor", value.toHexString());
          }}
        />
      </Form.Item>
    </>
  );
}

const CalendarCom = memo(CalendarComponent);
export default CalendarCom;
