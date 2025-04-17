import { EventInput } from "@fullcalendar/core/index.js";

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: "1",
    title: "All-day event",
    start: "2025-04-01",
    end: "2025-04-02",
    allDay: true,
  },
  {
    id: "2",
    title: "Timed2 event",
    start: "2025-04-02",
    end: "2025-04-02",
    extendedProps: {
      status: "done",
    },
  },
  {
    id: "3",
    title: "Timed3 event",
    start: "2025-04-02T12:00:00",
    end: "2025-04-02T14:00:00",
    backgroundColor: "green",
    borderColor: "green",
    textColor: "white",
    reStyle: false,
  },
  {
    id: "4",
    title: "Timed4 event",
    start: "2025-04-03",
    backgroundColor: "green",
    borderColor: "green",
    textColor: "white",
    allDay: true,
  },
];

interface ModalProps {
  title: string;
}

export const MODAL_EVENTS: ModalProps[] = [
  {
    title: "编辑事件",
  },
  {
    title: "新增事件",
  },
];
