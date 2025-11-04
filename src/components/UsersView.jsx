import React from 'react';

const UsersView = ({ users, openEditModal }) => (
  <div className="admin-table-container">
    <h3>Usuarios Registrados</h3>
    {users.length === 0 ? (
      <p>No hay usuarios registrados</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.nombre} {user.apellido}</td>
              <td>{user.email}</td>
              <td>{user.telefono}</td>
              <td>
                <span className={`role-badge ${user.role}`}>
                  {user.role === 'admin' ? 'Admin' : 'Usuario'}
                </span>
              </td>
              <td>{new Date(user.timestamp).toLocaleDateString()}</td>
              <td>
                <button 
                  className="edit-btn"
                  onClick={() => openEditModal('user', user)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default UsersView;