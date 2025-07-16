import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(res.data.todos || []);
      setIsAdmin(res.data.role === 'admin');
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id, completed) => {
    try {
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📋 Todo Dashboard</h2>
        <a href="/create" className="btn btn-success">+ Create Todo</a>
      </div>

      <div className="mb-3 d-flex gap-2">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
        {isAdmin && (
          <a href="/admin" className="btn btn-outline-dark">Admin Dashboard</a>
        )}
      </div>

      {filteredTodos.length === 0 ? (
        <p>No todos available.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {filteredTodos.map((todo) => (
            <div className="col" key={todo._id}>
              <div className={`card border-${todo.completed ? 'success' : 'secondary'}`}>
                <div className="card-body">
                  <h5 className="card-title d-flex justify-content-between">
                    {todo.title}
                    <span className={`badge bg-${todo.category === 'Urgent' ? 'danger' : 'secondary'}`}>
                      {todo.category}
                    </span>
                  </h5>
                  {todo.description && <p className="card-text">{todo.description}</p>}
                  {todo.dueDate && (
                    <p className="card-text">
                      <small className="text-muted">Due: {new Date(todo.dueDate).toLocaleDateString()}</small>
                    </p>
                  )}
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className={`btn btn-sm btn-${todo.completed ? 'warning' : 'success'}`}
                      onClick={() => handleComplete(todo._id, todo.completed)}
                    >
                      {todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <a href={`/edit/${todo._id}`} className="btn btn-sm btn-primary">Edit</a>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(todo._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
