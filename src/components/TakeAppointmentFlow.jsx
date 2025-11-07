import React, { useEffect, useState } from 'react';
import { createAppointment } from '../services/api';

function TakeAppointmentFlow({ onAppointmentCreated }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        console.log('Services data received:', data);
        
        // Manejar la estructura de respuesta {services: [...]}
        const servicesArray = data.services || data || [];
        setServices(servicesArray);
        setAllServices(servicesArray);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Error al cargar servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const horarios = ['9:30hs', '10:00hs', '11:30hs', '12:30hs', '15:00hs', '17:30hs'];

  if (loading) {
    return (
      <div className="loader-container">
        <span className="loader" />
        <p>Cargando servicios...</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <section className="take-appointment-section">
        <div className="take-appointment-box">
          <h2 className="take-appointment-title">Reservar turno</h2>
          <input
            type="text"
            placeholder="¿Qué servicios buscas?"
            className="take-appointment-search"
            onChange={e => {
              const val = e.target.value.toLowerCase();
              if (Array.isArray(allServices)) {
                setServices(
                  allServices.filter(serv => serv.name && serv.name.toLowerCase().includes(val))
                );
              }
            }}
          />
          <div className="service-list">
            {services.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                {error || 'No hay servicios disponibles en este momento'}
              </p>
            ) : (
              services.map(service => (
              <div
                key={service._id}
                className={`service-card-selectable${selectedService && selectedService._id === service._id ? ' selected' : ''}`}
                onClick={() => setSelectedService(service)}
              >
                {/* Imagen del servicio */}
                {service.image && (
                  <div className="take-appointment-service-img">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="take-appointment-service-img-el"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="service-card-title">{service.name}</div>
                <div className="service-card-desc">{service.description}</div>
                <div className="service-card-price">ARS {service.price}</div>
              </div>
            )))}
          </div>
          {selectedService && (
            <div className="take-appointment-actions">
              <button className="btn-primary" onClick={() => setStep(2)}>
                Siguiente
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (step === 2) {
    const today = new Date();
    const selectedDate = date ? new Date(date) : null;
    const isPastDate = selectedDate && selectedDate.setHours(0,0,0,0) < today.setHours(0,0,0,0);

    let horariosValidos = horarios;
    if (selectedDate && selectedDate.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();
      horariosValidos = horarios.filter(h => {
        const [hora, min] = h.replace('hs','').split(':');
        const hMin = parseInt(hora) * 60 + parseInt(min);
        return hMin > nowMinutes;
      });
    }

    return (
      <section className="take-appointment-section">
        <div className="take-appointment-box">
          <h2 className="take-appointment-title">Reservar turno</h2>
          <div className="take-appointment-step2">
            <div>
              <label className="take-appointment-label">Fecha:</label>
              <input
                type="date"
                value={date}
                min={today.toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="take-appointment-date"
                required
              />
              {isPastDate && <div style={{ color: 'red', marginTop: 8 }}>No puedes reservar en fechas pasadas.</div>}
            </div>
            <div>
              <label className="take-appointment-label">Horarios disponibles:</label>
              <div className="take-appointment-times">
                {horariosValidos.length === 0 && date && !isPastDate && (
                  <span style={{ color: 'red' }}>No hay horarios disponibles para el día seleccionado.</span>
                )}
                {horariosValidos.map(h => (
                  <button
                    key={h}
                    type="button"
                    className={`btn-secondary${time === h ? ' selected' : ''}`}
                    onClick={() => setTime(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="take-appointment-actions">
            <button
              className="btn-primary"
              disabled={!date || !time || isPastDate || horariosValidos.length === 0}
              onClick={() => setStep(3)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (step === 3 || step === 4) {
    return (
      <section className="take-appointment-section">
        <div className="take-appointment-box">
          <h2 className="take-appointment-title">
            {step === 3 ? 'Confirmar turno' : 'Turno reservado'}
          </h2>
          <div className="confirm-card">
            {/* Imagen del servicio */}
            {selectedService?.image && (
              <div className="take-appointment-service-img">
                <img
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="take-appointment-service-img-el"
                />
              </div>
            )}
            <div className="service-card-title">{selectedService.name}</div>
            <div className="service-card-desc">{selectedService.description}</div>
            <div className="service-card-price">ARS {selectedService.price}</div>
            <div className="confirm-card-date"><span>Fecha:</span> {date}</div>
            <div className="confirm-card-time"><span>Hora:</span> {time}</div>
          </div>
          {error && <p className="take-appointment-error">{error}</p>}
          {step === 3 && (
            <button
              className="btn-primary take-appointment-confirm"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError('');
                try {
                  await createAppointment({ service: selectedService._id, date, time });
                  setStep(4);
                  if (onAppointmentCreated) onAppointmentCreated();
                } catch (err) {
                  if (err.message.includes('No puedes reservar en fechas pasadas') || err.message.includes('No puedes reservar en horarios pasados')) {
                    setError('Fecha u hora no válidos');
                  } else {
                    setError('Error al reservar turno');
                  }
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? 'Reservando...' : 'Reservar turno'}
            </button>
          )}
          {step === 4 && (
            <div className="take-appointment-extra">
              <div>
                <div className="take-appointment-label">Medios de pago</div>
                <div className="take-appointment-payments">
                  <span className="btn-secondary">mp</span>
                  <span className="btn-secondary">tarjeta</span>
                  <span className="btn-secondary">efectivo</span>
                </div>
              </div>
              <div>
                <div className="take-appointment-label">Información de contacto</div>
                <div>11-1234-5678</div>
                <div>carwash@email.com</div>
              </div>
            </div>
          )}
          <div className="take-appointment-actions">
            {step === 4 && (
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Reservar otro turno
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return null;
}

export default TakeAppointmentFlow;
