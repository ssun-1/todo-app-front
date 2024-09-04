'use strict'
import { useEffect, useState } from 'react';
import { Button, List, Typography, message } from 'antd';
import { AddTask } from './AddTask';

export interface TaskType {
  todo_id: string;
  todo_name: string; // Updated to match your backend response
};

const todos_url = 'http://localhost:3000';

export const Tasks = ({ tasks }) => {
    const [curTasks, setCurTasks] = useState(tasks);

    const fetchTasks = () => {
        fetch(todos_url + '/get_todos')
            .then((res) => res.json())
            .then((res) => {
                setCurTasks(res);
                console.log("Fetched tasks:", res); // Log the fetched data
            });
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const deleteTask = (id: string) => {
        fetch(`${todos_url}/delete_todo/${id}`, {
            method: 'DELETE',
        })
        .then((res) => {
            if (res.ok) {
                message.success('Task deleted successfully!');
                fetchTasks(); // Call fetchTasks without setting it to curTasks
            } else {
                message.error('Failed to delete task');
            }
        })
        .catch(error => {
            console.error('Error deleting task:', error);
            message.error('An error occurred while deleting the task');
        });
    };

    const updateTask = (id: string, newName: string) => {
      fetch(`${todos_url}/update_todo/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ todo_name: newName }),
      })
      .then((res) => {
          if (res.ok) {
              message.success('Task updated successfully!');
              fetchTasks();
          } else {
              message.error('Failed to update task');
          }
      })
      .catch(error => {
          console.error('Error updating task:', error);
          message.error('An error occurred while updating the task');
      });
  };

    return (
      <>
        <AddTask onTaskAdded={fetchTasks} />
        <List
            className="tasklist"
            itemLayout="horizontal"
            pagination={{
                position: 'bottom',
                align: 'center'
            }}
            dataSource={curTasks}
            renderItem={(item: TaskType) => (
                <List.Item
                    key={item.todo_id}
                    actions={[
                        <Button key="delete" onClick={() => deleteTask(item.todo_id)}>
                            Delete
                        </Button>
                    ]}
                >
                    <Typography.Text editable={{
                        onChange: (newName) => updateTask(item.todo_id, newName)
                    }}
                    >
                        {item.todo_name}
                    </Typography.Text>
                </List.Item>
            )}
        />
        </>
    );
};