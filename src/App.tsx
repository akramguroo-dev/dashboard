import { Provider } from 'react-redux';
import { store } from './store/store';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import './App.css';

export default function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <header className="app-header">
          <h1>📋 Task Dashboard</h1>
          <p>Manage your tasks with Redux</p>
        </header>

        <main className="app-main">
          <TaskInput />
          <TaskList />
        </main>

        <footer className="app-footer">
          <p>Built with React, Redux Toolkit, and TypeScript</p>
        </footer>
      </div>
    </Provider>
  );
}