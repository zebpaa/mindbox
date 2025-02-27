import { useEffect, useRef, useState } from 'react';
import './App.css';

import * as yup from 'yup';
interface ErrorType {
  message: string;
}

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodosString = localStorage.getItem('todos');
    return storedTodosString ? JSON.parse(storedTodosString) : [];
  });
  const [todoInput, setTodoInput] = useState('');
  const [activeButton, setActiveButton] = useState('all'); // 'active', 'completed'

  const [errors, setErrors] = useState<ErrorType | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  let schema = yup.object().shape({
    todoText: yup
      .string()
      .trim()
      .required('Required field!')
      .min(3, 'Min. 3 characters')
      .max(25, 'Max. 25 characters')
      .notOneOf(
        todos.map(({ text }) => text),
        'This todo already exists!',
      ),
  });

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    schema
      .validate({
        todoText: todoInput,
      })
      .then((data) => {
        let maxId;

        if (todos.length === 0) {
          maxId = 0;
        } else {
          maxId = Math.max(...todos.map(({ id }) => id)) + 1;
        }

        if (todoInput.trim()) {
          setTodos([
            ...todos,
            { id: maxId, text: data.todoText, completed: false },
          ]);
          setTodoInput('');
          setErrors(null);
        }
      })
      .catch((err) => {
        setErrors(err);
      });
  };

  const clearCompleted = () => {
    const newTodos = todos.filter(({ completed }) => !completed);

    setTodos(newTodos);
  };

  const toggleTodoCompletion = (id: number) => {
    const index = todos.findIndex((t) => t.id === id);
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  useEffect(() => {
    // Проверяем, что ref.current не равен null, прежде чем вызывать focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = todos.filter((t) => {
    if (activeButton === 'active') {
      return !t.completed;
    } else if (activeButton === 'completed') {
      return t.completed;
    } else {
      return t;
    }
  });

  return (
    <div className="container">
      <h1 className="title">todos</h1>
      <form onSubmit={addTodo}>
        <div className="controller">
          <div className="input-wrapper">
            <div className="svg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {' '}
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="#e4e6e7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{' '}
                </g>
              </svg>
            </div>
            <input
              placeholder="What needs to be done?"
              ref={inputRef}
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              className={errors ? 'input invalid' : 'input'}
            />
          </div>
          {errors && <p className="feedback">{errors.message}</p>}
        </div>
      </form>

      {todos && (
        <>
          <ul>
            {filteredTodos.length > 0 ? (
              filteredTodos.map(({ id, text, completed }) => (
                <li key={id} className={completed ? 'completed' : ''}>
                  <div className="todo">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => toggleTodoCompletion(id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span>{text}</span>
                  </div>
                </li>
              ))
            ) : (
              <div>
                <div className="todo">No todos</div>
              </div>
            )}
          </ul>
          <div className="features-block">
            <span>
              {todos.filter(({ completed }) => !completed).length} items left
            </span>
            <div className="filter-panel">
              <button
                onClick={() => setActiveButton('all')}
                className={activeButton === 'all' ? 'active' : ''}
              >
                All
              </button>
              <button
                onClick={() => setActiveButton('active')}
                className={activeButton === 'active' ? 'active' : ''}
              >
                Active
              </button>
              <button
                onClick={() => setActiveButton('completed')}
                className={activeButton === 'completed' ? 'active' : ''}
              >
                Completed
              </button>
            </div>
            <button onClick={clearCompleted}>Clear completed</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
