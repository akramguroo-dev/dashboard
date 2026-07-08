import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// TypeScript Interface for a Task
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

// TypeScript Interface for Task State
interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  filter: 'all',
};

// Create the task slice
const taskSlice = createSlice({
  name: 'tasks', 
  initialState,
  reducers: {
    // Add a new task
    addTask: (state, action: PayloadAction<string>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        title: action.payload,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },

    // Toggle task completion status
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },

    // Delete a task
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },

    // Set filter
    setFilter: (state, action: PayloadAction<'all' | 'active' | 'completed'>) => {
      state.filter = action.payload;
    },

    // Clear all completed tasks
    clearCompleted: (state) => {
      state.tasks = state.tasts.filter(t => !t.completed);
    },
  },
});

// Export actions
export const { addTask, toggleTask, deleteTask, setFilter, clearCompleted } = taskSlice.actions;

// Export reducer
export default taskSlice.reducer;