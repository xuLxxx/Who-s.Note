import React, { memo, useEffect, useState } from "react";
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
  message,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Switch,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";

import dayjs, { Dayjs } from "dayjs";
import store, { Dispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
//types
import type { _EventApi } from "./index.d";
import { Event } from "@/store/model/index.type";
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
  const dispatch = useDispatch<Dispatch>();
  const { collapse } = useSelector((state: RootState) => state.setting);
  const [events, setEvents] = React.useState<EventInput[]>([]);
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
  const updateEvent = (event: EventInput) => {
    //  dispatch.todo.updateEvents(event).then((res) => {
    //  })
  };
  const handleChangeEvent = (event: EventChangeArg) => {
    console.log("change", event);
    const data = event.event;
    const form = {
      id: data.extendedProps.key,
      title: data.title,
      start: data.startStr,
      end: data.endStr,
      allDay: data.allDay,
      extendedProps: {
        reStyle: data.extendedProps.reStyle,
        status: data.extendedProps.status || undefined,
      },
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      borderColor: data.borderColor,
    };
    dispatch.todo.updateEvents(form).then((res) => {
      console.log(res);
    });
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
    dispatch.todo.getEvents().then((res: any) => {
      const data = res.data.map((item: Event) => {
        return {
          key: item.id,
          title: item.title,
          start: item.start,
          end: item.end,
          allDay: item.allDay,
          extendedProps: {
            reStyle: item.extendedProps.reStyle,
            status: item.extendedProps.status,
          },
          backgroundColor: item.backgroundColor,
          textColor: item.textColor,
          borderColor: item.borderColor,
        };
      });
      setEvents(data);
    });
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
            events={events}
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
        {editModal[1] === 0 && (
          <EditEvents event={editEvent} cancel={onModalCancel} />
        )}
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

function ColorEvent({
  eventContent,
}: {
  eventContent: EventContentArg;
}): JSX.Element {
  return (
    <>
      <div
        style={
          eventContent.event.allDay
            ? {
                backgroundColor: eventContent.backgroundColor,
                color: eventContent.textColor,
                padding: "4px",
                borderRadius: 2,
                borderBlockWidth: 1,
              }
            : {
                backgroundColor: eventContent.backgroundColor,
                color: eventContent.textColor,
                padding: "0px 2px 0 2px",
                borderRadius: 2,
                borderBlockWidth: 1,
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

function TextEvent({ eventContent }: { eventContent: EventContentArg }) {
  return (
    <>
      <div className="text-event">
        <div className="text-event-time">{eventContent.timeText}</div>
        <span className="text-event-title">{eventContent.event.title}</span>
      </div>
    </>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  // console.log(eventContent);
  return (
    <>
      {eventContent.event.extendedProps.reStyle ? (
        <ColorEvent eventContent={eventContent} />
      ) : (
        <TextEvent eventContent={eventContent} />
      )}
    </>
  );
}

function EditEvents({
  event,
  cancel,
}: {
  event: _EventApi | undefined;
  cancel: () => void;
}): JSX.Element {
  console.log("EDIT", event);
  return (
    <>
      <EventsForm event={event} cancel={cancel}></EventsForm>
    </>
  );
}

function EventsForm({
  event,
  cancel,
}: {
  event: _EventApi | undefined;
  cancel: () => void;
}): JSX.Element {
  const onChangeAllDay = (checked: boolean) => {
    event?.setAllDay(checked);
  };
  const [title, setTitle] = React.useState<string | undefined>(event?.title);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const dispatch = useDispatch<Dispatch>();
  const ConfirmDelete = ({
    setModalCancel,
  }: {
    setModalCancel: () => void;
  }) => {
    const [open, setOpen] = useState<boolean>(false);
    const confirm: PopconfirmProps["onConfirm"] = (e) => {
      console.log(e);
      setConfirmLoading(true);
      if (event?.extendedProps.key) {
        dispatch.todo.deleteEvents(event.extendedProps.key).then((res: any) => {
          console.log(res);
          if (res.code === 200) {
            setOpen(false);
            setModalCancel();
            setConfirmLoading(false);
            event?.remove();
          } else {
            setConfirmLoading(false);
          }
        });
      }
    };

    const cancel: PopconfirmProps["onCancel"] = (e) => {
      setOpen(false);
    };
    return (
      <Popconfirm
        open={open}
        title="提示"
        description="你确定要删除这个事件吗"
        placement="bottom"
        onConfirm={confirm}
        onCancel={cancel}
        okButtonProps={{ loading: confirmLoading }}
        okText="确定"
        cancelText="取消">
        <Button danger onClick={() => setOpen(true)}>
          删除
        </Button>
      </Popconfirm>
    );
  };

  useEffect(() => {
    setTitle(event?.title);
  }, [event?.title]);

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
              // event?.setProp("textColor", "");
              // event?.setProp("backgroundColor", "");
              // event?.setProp("borderColor", "");
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
      <ConfirmDelete setModalCancel={cancel}></ConfirmDelete>
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
  const dispath = useDispatch<Dispatch>();
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
  const addEvent = async (values: any) => {
    if (!values.title) return;
    setLoading(true);
    const _form: any = {
      title: values.title,
      start: start,
      end: end,
      allDay: event.allDay,
      ...style,
      extendedProps: {
        reStyle: reStyle,
      },
    };
    try {
      const result = (await dispath.todo.addEvents(_form)) as {
        code: number;
        data: any;
      };
      console.log(result);
      const _result = {
        ...result.data,
        key: result.data.id,
        id: undefined,
      };
      if (result.code !== 200) return;
      event?.view.calendar.addEvent(_result);
      form.resetFields();
      setLoading(false);
      ok();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
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
