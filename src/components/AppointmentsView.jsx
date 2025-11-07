import React from 'react';

const AppointmentsView = ({ appointments, openEditModal }) => (
  <div className="admin-table-container">
    <h3>Turnos Registrados</h3>
    {appointments.length === 0 ? (
      <p>No hay turnos registrados</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt._id}>
              <td>
                {(appt.user?.nombre || appt.user?.name || '-')}{' '}
                {(appt.user?.apellido || appt.user?.surname || '')}
              </td>
              <td>{appt.service?.nombre || appt.service?.name || '-'}</td>
              <td>
                {appt.date
                  ? new Date(appt.date).toLocaleDateString('es-ES')
                  : '-'}
              </td>
              <td>{appt.time || '-'}</td>
              <td>
                <span className={`status-badge ${appt.status}`}>
                  {appt.status || '-'}
                </span>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => openEditModal('appointment', appt)}
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

export default AppointmentsView;