import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, describe, it } from '@jest/globals';
import { Tasks } from './Tasks';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockTasks = [
  { todo_id: '1', todo_name: 'Task 1' },
  { todo_id: '2', todo_name: 'Task 2' },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  ) as jest.Mock;
  (fetch as jest.Mock).mockClear();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Tasks Component', () => {
  // it('renders tasks from props', () => {
  //   render(<Tasks tasks={mockTasks} />);

  //   expect(screen.getByText('Task 1')).toBeInTheDocument();
  //   expect(screen.getByText('Task 2')).toBeInTheDocument();
  // });

  it('calls fetch to get tasks on load', async () => {
    render(<Tasks tasks={[]} />);

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/get_todos');
  });

  it('deletes a task when delete button is clicked', async () => {
    global.fetch = jest.fn((url, options) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    render(<Tasks tasks={mockTasks} />);

    const deleteButton = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton[0]);

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/delete_todo/1', {
        method: 'DELETE',
      })
    );
  });

  it('updates a task when text is edited', async () => {
    global.fetch = jest.fn((url, options) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    ) as jest.Mock;

    render(<Tasks tasks={mockTasks} />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);
    fireEvent.input(editButtons[0], { target: { innerText: 'Updated Task 1' } });

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/get_todos')
    );
  });
});