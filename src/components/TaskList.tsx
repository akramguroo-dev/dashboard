import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { toggleTask, deleteTask } from '../features/taskSlice';
import { Task } from '../features/taskSlice';

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get tasks and filter from Redux store
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const filter = useSelector((state: RootState) => state.tasks.filter);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  // Handle task completion toggle
  const handleToggle = (taskId: string) => {
    dispatch(toggleTask(taskId));
  };

  // Handle task deletion
  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  return (
    <div className="task-list-container">
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>📝 No tasks yet. Add one to get started!</p>
        </div>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task: Task) => (
            <li key={task.id} className="task-item">
              <div className="task-content">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                  className="task-checkbox"
                />
                <span
                  className={`task-title ${
                    task.completed ? 'completed' : ''
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="delete-button"
              >
                🗑️ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="task-count">
        {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
      </div>
    </div>
  );
}