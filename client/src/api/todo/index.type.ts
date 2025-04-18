export type Event = {
  id: number;
  title: string;
  start: string;
  end: string;
  allDays: boolean;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    reStyle: boolean;
  };
};
