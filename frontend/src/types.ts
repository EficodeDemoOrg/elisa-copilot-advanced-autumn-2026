export type Task = {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  position: number;
};

export type Chart = {
  startDate: string;
  endDate: string;
  tasks: Task[];
};
