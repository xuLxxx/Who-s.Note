import {
  DateInput,
  EventSourceApi,
  EventApi,
  DurationInput,
  FormatterInput,
} from "@fullcalendar/core";
import { Dictionary } from "@fullcalendar/core/internal.js";

export interface _EventApi {
  source: EventSourceApi | null;
  start: Date | null | DateInput;
  end: Date | null | DateInput;
  startStr: string;
  endStr: string;
  id: string;
  groupId: string;
  allDay: boolean;
  title: string;
  url: string;
  display: string;
  startEditable: boolean;
  durationEditable: boolean;
  constraint: any;
  overlap: boolean;
  allow: any;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  reStyle: boolean;
  classNames: string[];
  extendedProps: Dictionary;
  setProp(name: string, val: any): void;
  setExtendedProp(name: string, val: any): void;
  setStart(
    startInput: DateInput,
    options?: {
      granularity?: string;
      maintainDuration?: boolean;
    }
  ): void;
  setEnd(
    endInput: DateInput | null,
    options?: {
      granularity?: string;
    }
  ): void;
  setDates(
    startInput: DateInput,
    endInput: DateInput | null,
    options?: {
      allDay?: boolean;
      granularity?: string;
    }
  ): void;
  moveStart(deltaInput: DurationInput): void;
  moveEnd(deltaInput: DurationInput): void;
  moveDates(deltaInput: DurationInput): void;
  setAllDay(
    allDay: boolean,
    options?: {
      maintainDuration?: boolean;
    }
  ): void;
  formatRange(formatInput: FormatterInput): any;
  remove(): void;
  toPlainObject(settings?: {
    collapseExtendedProps?: boolean;
    collapseColor?: boolean;
  }): Dictionary;
  toJSON(): Dictionary;
}
