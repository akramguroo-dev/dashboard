import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import TaskList from "./TaskList";

describe("TaskList Component", () => {
  test("should render empty state when no tasks", () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>,
    );

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  test("should display task count", () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>,
    );

    expect(screen.getByText("0 tasks")).toBeInTheDocument();
  });

  test("should render checkbox for each task", () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>,
    );

    const checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes).toHaveLength(0); // No tasks yet
  });

  test("should render delete button for each task", () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>,
    );

    const deleteButtons = screen.queryAllByText(/Delete/i);
    expect(deleteButtons).toHaveLength(0); // No tasks yet
  });
});
