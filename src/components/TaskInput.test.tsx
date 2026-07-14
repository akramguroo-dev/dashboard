import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import TaskInput from "./TaskInput";

describe("TaskInput Component", () => {
  test("should render input field and button", () => {
    render(
      <Provider store={store}>
        <TaskInput />
      </Provider>,
    );

    const input = screen.getByPlaceholderText("Add a new task...");
    const button = screen.getByText("Add Task");

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("should update input value when user types", () => {
    render(
      <Provider store={store}>
        <TaskInput />
      </Provider>,
    );

    const input = screen.getByPlaceholderText(
      "Add a new task...",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Learn Redux" } });

    expect(input.value).toBe("Learn Redux");
  });

  test("should clear input after adding task", () => {
    render(
      <Provider store={store}>
        <TaskInput />
      </Provider>,
    );

    const input = screen.getByPlaceholderText(
      "Add a new task...",
    ) as HTMLInputElement;
    const button = screen.getByText("Add Task");

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(button);

    expect(input.value).toBe("");
  });

  test("should not add empty task", () => {
    render(
      <Provider store={store}>
        <TaskInput />
      </Provider>,
    );

    const button = screen.getByText("Add Task");
    fireEvent.click(button);

    const input = screen.getByPlaceholderText(
      "Add a new task...",
    ) as HTMLInputElement;
    expect(input.value).toBe("");
  });

  test("should add task on Enter key press", () => {
    render(
      <Provider store={store}>
        <TaskInput />
      </Provider>,
    );

    const input = screen.getByPlaceholderText(
      "Add a new task...",
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(input.value).toBe("");
  });
});
