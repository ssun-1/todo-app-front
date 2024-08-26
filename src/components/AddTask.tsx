'use strict'
import { Button, Form, Input, message, Space } from 'antd';

const todos_url = 'http://localhost:3000';

export const AddTask = ({ onTaskAdded }) => {
  const [form] = Form.useForm();

  const onFinish = (values: { todoName: string; }) => {
    const { todoName } = values;
    add_todo(todoName);
  };

  const add_todo = async (todo_text: string) => {
    try {
      const response = await fetch(todos_url + '/create_todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo_name: todo_text }),
      });

      if (response.ok) {
        message.success('Task added successfully!');
        form.resetFields();
        onTaskAdded();
      } else {
        message.error('Failed to add task');
      }
    } catch (error) {
      message.error('An error occurred while adding the task');
      console.error('Error adding task:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={onFinish}
      autoComplete="off"
      className='form'
    >
      <Form.Item
        name="todoName"
        label="To Do"
        rules={[
          { required: true },
          { type: 'string', min: 6 },
        ]}
      >
        <Input placeholder="Enter your to do here!" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};