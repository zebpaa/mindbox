import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { act } from 'react';
import App from './App';

describe('Todo App', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('adds and removes todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Добавление задачи
    await act(async () => {
      await user.type(
        screen.getByPlaceholderText('What needs to be done?'),
        'Test task',
      );
      await user.keyboard('{Enter}');
    });

    // Проверка добавления
    expect(screen.getByText('Test task')).toBeInTheDocument();

    // Отметка как выполненной
    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });

    // Очистка выполненных
    await act(async () => {
      await user.click(screen.getByText('Clear completed'));
    });

    expect(screen.queryByText('Test task')).not.toBeInTheDocument();
  });

  test('shows validation errors', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Слишком короткий ввод
    await act(async () => {
      await user.type(
        screen.getByPlaceholderText('What needs to be done?'),
        'A',
      );
      await user.keyboard('{Enter}');
    });

    expect(screen.getByText(/Min. 3 characters/i)).toBeInTheDocument();
  });
});
