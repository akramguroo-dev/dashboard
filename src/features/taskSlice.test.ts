import taskReducer, {
  addTask,
  toggleTask,
  deleteTask,
  setFilter,
  clearCompleted,
  Task,
} from './taskSlice';

interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
}

describe('taskSlice reducer', () => {
  let initialState: TaskState;

  beforeEach(() => {
    initialState = {
      tasks: [],
      filter: 'all',
    };
  });

  describe('addTask', () => {
    test('should add a new task to empty tasks array', () => {
      const action = addTask('Learn Redux');
      const newState = taskReducer(initialState, action);

      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0].title).toBe('Learn Redux');
      expect(newState.tasks[0].completed).toBe(false);
    });

    test('should add multiple tasks', () => {
      const action1 = addTask('Learn Redux');
      const action2 = addTask('Learn TypeScript');

      let newState = taskReducer(initialState, action1);
      newState = taskReducer(newState, action2);

      expect(newState.tasks).toHaveLength(2);
      expect(newState.tasks[0].title).toBe('Learn Redux');
      expect(newState.tasks[1].title).toBe('Learn TypeScript');
    });

    test('should create task with unique ID', () => {
      const action1 = addTask('Task 1');
      const action2 = addTask('Task 2');

      let newState = taskReducer(initialState, action1);
      const firstId = newState.tasks[0].id;
      
      newState = taskReducer(newState, action2);
      const secondId = newState.tasks[1].id;

      expect(firstId).not.toBe(secondId);
    });

    test('should create task with timestamp', () => {
      const action = addTask('Test Task');
      const newState = taskReducer(initialState, action);

      expect(newState.tasks[0].createdAt).toBeTruthy();
      expect(typeof newState.tasks[0].createdAt).toBe('string');
      expect(newState.tasks[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });
  });

  describe('toggleTask', () => {
    test('should toggle task from incomplete to complete', () => {
      const addAction = addTask('Learn Redux');
      let state = taskReducer(initialState, addAction);
      const taskId = state.tasks[0].id;

      const toggleAction = toggleTask(taskId);
      state = taskReducer(state, toggleAction);

      expect(state.tasks[0].completed).toBe(true);
    });

    test('should toggle task from complete to incomplete', () => {
      const addAction = addTask('Learn Redux');
      let state = taskReducer(initialState, addAction);
      const taskId = state.tasks[0].id;

      let toggleAction = toggleTask(taskId);
      state = taskReducer(state, toggleAction);

      toggleAction = toggleTask(taskId);
      state = taskReducer(state, toggleAction);

      expect(state.tasks[0].completed).toBe(false);
    });

    test('should not affect other tasks when toggling one', () => {
      let state = taskReducer(initialState, addTask('Task 1'));
      state = taskReducer(state, addTask('Task 2'));
      const firstTaskId = state.tasks[0].id;

      const toggleAction = toggleTask(firstTaskId);
      state = taskReducer(state, toggleAction);

      expect(state.tasks[0].completed).toBe(true);
      expect(state.tasks[1].completed).toBe(false);
    });
  });

  describe('deleteTask', () => {
    test('should delete a task by ID', () => {
      let state = taskReducer(initialState, addTask('Task to delete'));
      const taskId = state.tasks[0].id;

      const deleteAction = deleteTask(taskId);
      state = taskReducer(state, deleteAction);

      expect(state.tasks).toHaveLength(0);
    });

    test('should delete correct task when multiple exist', () => {
      let state = taskReducer(initialState, addTask('Task 1'));
      state = taskReducer(state, addTask('Task 2'));
      state = taskReducer(state, addTask('Task 3'));
      
      const secondTaskId = state.tasks[1].id;

      const deleteAction = deleteTask(secondTaskId);
      state = taskReducer(state, deleteAction);

      expect(state.tasks).toHaveLength(2);
      expect(state.tasks[0].title).toBe('Task 1');
      expect(state.tasks[1].title).toBe('Task 3');
    });
  });

  describe('setFilter', () => {
    test('should set filter to active', () => {
      const action = setFilter('active');
      const newState = taskReducer(initialState, action);

      expect(newState.filter).toBe('active');
    });

    test('should set filter to completed', () => {
      const action = setFilter('completed');
      const newState = taskReducer(initialState, action);

      expect(newState.filter).toBe('completed');
    });

    test('should set filter to all', () => {
      const action = setFilter('all');
      const newState = taskReducer(initialState, action);

      expect(newState.filter).toBe('all');
    });
  });

  describe('clearCompleted', () => {
    test('should remove all completed tasks', () => {
      let state = taskReducer(initialState, addTask('Task 1'));
      state = taskReducer(state, addTask('Task 2'));
      state = taskReducer(state, addTask('Task 3'));

      state = taskReducer(state, toggleTask(state.tasks[0].id));
      state = taskReducer(state, toggleTask(state.tasks[2].id));

      const clearAction = clearCompleted();
      state = taskReducer(state, clearAction);

      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Task 2');
      expect(state.tasks[0].completed).toBe(false);
    });

    test('should not affect incomplete tasks', () => {
      let state = taskReducer(initialState, addTask('Complete me'));
      state = taskReducer(state, addTask('Keep me'));
      state = taskReducer(state, toggleTask(state.tasks[0].id));

      const clearAction = clearCompleted();
      state = taskReducer(state, clearAction);

      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Keep me');
    });

    test('should handle empty completed tasks', () => {
      let state = taskReducer(initialState, addTask('Incomplete task'));

      const clearAction = clearCompleted();
      state = taskReducer(state, clearAction);

      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Incomplete task');
    });
  });

  describe('State immutability', () => {
    test('should not mutate original state', () => {
      const originalState = JSON.parse(JSON.stringify(initialState));

      const action = addTask('New task');
      const newState = taskReducer(initialState, action);

      expect(initialState).toEqual(originalState);
      expect(newState).not.toEqual(initialState);
    });
  });
});