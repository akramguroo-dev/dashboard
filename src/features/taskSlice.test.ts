import taskReducer, {
  addTask,
  toggleTask,
  deleteTask,
  setFilter,
  clearCompleted,
  Task,
} from './taskSlice';

// Define the initial state for testing
interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
}

describe('taskSlice reducer', () => {
  // Setup: Create initial state before each test
  let initialState: TaskState;

  beforeEach(() => {
    initialState = {
      tasks: [],
      filter: 'all',
    };
  });

  // TEST 1: addTask action
  describe('addTask', () => {
    test('should add a new task to empty tasks array', () => {
      // ARRANGE
      const action = addTask('Learn Redux');

      // ACT
      const newState = taskReducer(initialState, action);

      // ASSERT
      expect(newState.tasks).toHaveLength(1);
      expect(newState.tasks[0].title).toBe('Learn Redux');
      expect(newState.tasks[0].completed).toBe(false);
    });

    test('should add multiple tasks', () => {
      // ARRANGE
      const action1 = addTask('Learn Redux');
      const action2 = addTask('Learn TypeScript');

      // ACT
      let newState = taskReducer(initialState, action1);
      newState = taskReducer(newState, action2);

      // ASSERT
      expect(newState.tasks).toHaveLength(2);
      expect(newState.tasks[0].title).toBe('Learn Redux');
      expect(newState.tasks[1].title).toBe('Learn TypeScript');
    });

    test('should create task with unique ID', () => {
      // ARRANGE
      const action1 = addTask('Task 1');
      const action2 = addTask('Task 2');

      // ACT
      let newState = taskReducer(initialState, action1);
      newState = taskReducer(newState, action2);

      // ASSERT
      expect(newState.tasks[0].id).not.toBe(newState.tasks[1].id);
    });

    test('should create task with timestamp', () => {
      // ARRANGE
      const beforeTime = new Date().toISOString();
      const action = addTask('Test Task');
      const afterTime = new Date().toISOString();

      // ACT
      const newState = taskReducer(initialState, action);

      // ASSERT
      expect(newState.tasks[0].createdAt).toBeTruthy();
      expect(newState.tasks[0].createdAt).toBeGreaterThanOrEqual(beforeTime);
      expect(newState.tasks[0].createdAt).toBeLessThanOrEqual(afterTime);
    });
  });

  // TEST 2: toggleTask action
  describe('toggleTask', () => {
    test('should toggle task from incomplete to complete', () => {
      // ARRANGE
      const addAction = addTask('Learn Redux');
      let state = taskReducer(initialState, addAction);
      const taskId = state.tasks[0].id;

      // ACT
      const toggleAction = toggleTask(taskId);
      state = taskReducer(state, toggleAction);

      // ASSERT
      expect(state.tasks[0].completed).toBe(true);
    });

    test('should toggle task from complete to incomplete', () => {
      // ARRANGE
      const addAction = addTask('Learn Redux');
      let state = taskReducer(initialState, addAction);
      const taskId = state.tasks[0].id;

      // ACT - Toggle to complete
      let toggleAction = toggleTask(taskId);
      state = taskReducer(state, toggleAction);

      // ACT - Toggle back to incomplete
      toggleAction = toggleTask(taskId);
      state = taskReducer(state, toggleAction);

      // ASSERT
      expect(state.tasks[0].completed).toBe(false);
    });

    test('should not affect other tasks when toggling one', () => {
      // ARRANGE
      let state = taskReducer(initialState, addTask('Task 1'));
      state = taskReducer(state, addTask('Task 2'));
      const firstTaskId = state.tasks[0].id;

      // ACT
      const toggleAction = toggleTask(firstTaskId);
      state = taskReducer(state, toggleAction);

      // ASSERT
      expect(state.tasks[0].completed).toBe(true);
      expect(state.tasks[1].completed).toBe(false); // Should remain unchanged
    });
  });

  // TEST 3: deleteTask action
  describe('deleteTask', () => {
    test('should delete a task by ID', () => {
      // ARRANGE
      let state = taskReducer(initialState, addTask('Task to delete'));
      const taskId = state.tasks[0].id;

      // ACT
      const deleteAction = deleteTask(taskId);
      state = taskReducer(state, deleteAction);

      // ASSERT
      expect(state.tasks).toHaveLength(0);
    });

    test('should delete correct task when multiple exist', () => {
      // ARRANGE
      let state = taskReducer(initialState, addTask('Task 1'));
      state = taskReducer(state, addTask('Task 2'));
      state = taskReducer(state, addTask('Task 3'));
      const secondTaskId = state.tasks[1].id;

      // ACT
      const deleteAction = deleteTask(secondTaskId);
      state = taskReducer(state, deleteAction);

      // ASSERT
      expect(state.tasks).toHaveLength(2);
      expect(state.tasks[0].title).toBe('Task 1');
      expect(state.tasks[1].title).toBe('Task 3');
    });
  });

  // TEST 4: setFilter action
  describe('setFilter', () => {
    test('should set filter to active', () => {
      // ARRANGE
      const action = setFilter('active');

      // ACT
      const newState = taskReducer(initialState, action);

      // ASSERT
      expect(newState.filter).toBe('active');
    });

    test('should set filter to completed', () => {
      // ARRANGE
      const action = setFilter('completed');

      // ACT
      const newState = taskReducer(initialState, action);

      // ASSERT
      expect(newState.filter).toBe('completed');
    });

    test('should set filter to all', () => {
      // ARRANGE
      const action = setFilter('all');

      // ACT
      const newState = taskReducer(initialState, action);

      // ASSERT
      expect(newState.filter).toBe('all');
    });
  });

  // TEST 5: clearCompleted action
  describe('clearCompleted', () => {
    test('should remove all completed tasks', () => {
      // ARRANGE
      let state = taskReducer(initialState, addTask('Task 1'));
      state = taskReducer(state, addTask('Task 2'));
      state = taskReducer(state, addTask('Task 3'));

      // Toggle first and third tasks to complete
      state = taskReducer(state, toggleTask(state.tasks[0].id));
      state = taskReducer(state, toggleTask(state.tasks[2].id));

      // ACT
      const clearAction = clearCompleted();
      state = taskReducer(state, clearAction);

      // ASSERT
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Task 2');
      expect(state.tasks[0].completed).toBe(false);
    });

    test('should not affect incomplete tasks', () => {
      // ARRANGE
      let state = taskReducer(initialState, addTask('Complete me'));
      state = taskReducer(state, addTask('Keep me'));
      state = taskReducer(state, toggleTask(state.tasks[0].id));

      // ACT
      const clearAction = clearCompleted();
      state = taskReducer(state, clearAction);

      // ASSERT
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Keep me');
    });

    test('should handle empty completed tasks', () => {
      // ARRANGE
      let state = taskReducer(initialState, addTask('Incomplete task'));

      // ACT
      const clearAction = clearCompleted();
      state = taskReducer(state, clearAction);

      // ASSERT
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Incomplete task');
    });
  });

  // TEST 6: State immutability
  describe('State immutability', () => {
    test('should not mutate original state', () => {
      // ARRANGE
      const originalState = JSON.parse(JSON.stringify(initialState)); // Deep copy

      // ACT
      const action = addTask('New task');
      const newState = taskReducer(initialState, action);

      // ASSERT
      expect(initialState).toEqual(originalState); // Original unchanged
      expect(newState).not.toEqual(initialState); // New state different
    });
  });
});