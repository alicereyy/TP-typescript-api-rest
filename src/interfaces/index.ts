
type Pending = "PENDING"
type InProgress = "IN-PROGRESS"
type Done = "DONE"
export type Status = Pending | InProgress | Done

interface Task {
    id: string; 
    name: string; 
    completed: Status
}


export interface ITodoList {
    id: string;
    description: string;
    tasks: Task[];
  }