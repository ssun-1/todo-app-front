'use strict'
import { useState, useEffect } from 'react';
import { Tasks } from './Tasks';

const todos_url = 'http://localhost:3000';

export const TodoApp = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    fetch(todos_url + '/get_todos')
      .then((res) => res.json())
      .then((res) => {
        setTasks(res);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <Tasks tasks={tasks} />
    </div>
  );
};