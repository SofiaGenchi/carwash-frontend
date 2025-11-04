import React from 'react';

const AppointmentsList = ({ appointments, onCancelAppointment }) => {
  const activeAppointments = appointments ? appointments.filter(a => a.status !== 'cancelled') : [];
  if (activeAppointments.length === 0) {
    return (
      <section className="appointments-section">
        <h2>Mis Turnos</h2>
        <div className="empty-state">
          <p>No tienes turnos programados</p>
        </div>
      </section>
    );
  }

  return (
    <section className="appointments-section">
      <h2>Mis Turnos</h2>
      <div className="appointments-grid">
        {activeAppointments.map(appointment => (
          <div key={appointment._id || appointment.id} className="appointment-card">
            <div className="appointment-header">
              <h3>{appointment.service?.name || appointment.serviceName}</h3>
              <span className={`status status-${appointment.status}`}>
                {appointment.status === 'pending' && 'Pendiente'}
                {appointment.status === 'confirmed' && 'Confirmado'}
                {appointment.status === 'cancelled' && 'Cancelado'}
                {appointment.status === 'completed' && 'Completado'}
              </span>
            </div>

            <div className="appointment-details">
              <div className="detail-item">
                <span className="label">Fecha:</span>
                <span className="value">{new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Hora:</span>
                <span className="value">{appointment.time}</span>
              </div>
              <div className="detail-item">
                <span className="label">Precio:</span>
                <span className="value">${appointment.service?.price || appointment.price}</span>
              </div>
              {appointment.service?.name && (
                <div className="detail-item">
                  <span className="label">Servicio:</span>
                  <span className="value">{appointment.service.name}</span>
                </div>
              )}
              {appointment.notes && (
                <div className="detail-item">
                  <span className="label">Notas:</span>
                  <span className="value">{appointment.notes}</span>
                </div>
              )}
            </div>

            <div className="appointment-actions">
              {appointment.status === 'pending' && (
                <>
                  <button className="btn-danger" onClick={() => onCancelAppointment && onCancelAppointment(appointment._id)}>
                    Cancelar
                  </button>
                </>
              )}
              {appointment.status === 'confirmed' && (
                <button className="btn-danger" onClick={() => onCancelAppointment && onCancelAppointment(appointment._id)}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};



export default AppointmentsList;