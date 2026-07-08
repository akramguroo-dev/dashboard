import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../features/taskSlice';
import { AppDispatch } from '../store/store';

export default function TaskInput() {
  const [input , setInput] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTask = () => {
    if (input.trim()) {
      dispatch(addTask(input));
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="task-input-container">
      <input
        type="text"
        placeholder="Add a new task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        className="task-input"
      />
      <button onClick={handleAddTask} className="add-button">
        Add Task
      </button>
    </div>
  );
}