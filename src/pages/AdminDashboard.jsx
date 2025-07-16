import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todoRes = await axios.get('http://localhost:5000/api/admin/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users);
      setTodos(todoRes.data.todos);
      setIsAdmin(true);
    } catch (err) {
      console.error(err);
      setIsAdmin(false);
      navigate('/dashboard'); // redirect if not admin
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="container my-5">
      <h2 className="mb-4">🛠 Admin Dashboard</h2>

      {/* Users Table */}
      <div className="mb-5">
        <h4 className="mb-3">👥 Users</h4>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>
                    <span className={`badge bg-${user.role === 'admin' ? 'success' : 'secondary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleRole(user._id, user.role)}
                    >
                      {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Todos Table */}
      <div>
        <h4 className="mb-3">📋 All Todos</h4>
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Username</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo._id}>
                  <td>{todo.title}</td>
                  <td>{todo.user?.username || 'N/A'}</td>
                  <td>
                    <span className={`badge bg-${todo.category === 'Urgent' ? 'danger' : 'secondary'}`}>
                      {todo.category}
                    </span>
                  </td>
                  <td>{todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge bg-${todo.completed ? 'success' : 'warning'}`}>
                      {todo.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
