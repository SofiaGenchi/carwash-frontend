import React from 'react'

import { useEffect, useState } from 'react';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        // El Gateway API devuelve { services: [...] }
        setServices(data.services || data);
      } catch (err) {
        setError('Error al cargar servicios');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const formatPrice = (value) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value);

  if (loading) return <p>Cargando servicios...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <section className="services-section">
      <h2 className="services-title">Nuestros servicios</h2>
      <div className="services-flex">
        {services.map((s) => (
          <article key={s._id} className="service-card">
            <div className="service-img">
              {/* Si tienes la URL de la imagen en la base de datos, úsala aquí */}
              {s.image ? <img src={s.image} alt={s.name} /> : null}
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="service-footer">
              <span className="price">{formatPrice(s.price)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Services;