// Component to display a selectable list of services

const ServicesList = ({ services, onSelectService }) => {
  if (!services || services.length === 0) {
    return (
      <section className="services-section">
        <h2>Servicios Disponibles</h2>
        <div className="empty-state">
          <p>No hay servicios disponibles en este momento</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services-list-section">
      <h2>Elige tu Servicio</h2>
      <div className="services-list-grid">
        {services.map(service => (
          <div key={service._id || service.id} className="service-list-card">
            {service.image && (
              <div className="service-list-img">
                <img
                  src={service.image}
                  alt={service.name}
                  className="take-appointment-service-img-el"
                  loading="lazy"
                />
              </div>
            )}
            <div className="service-list-header">
              <h3>{service.name}</h3>
              <span className="service-list-duration">{service.duration} min</span>
            </div>
            <div className="service-list-content">
              <p className="service-list-description">{service.description}</p>
              <div className="service-list-features">
                {service.features?.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>
            <div className="service-list-footer">
              <div className="service-list-price">
                <span className="price-label">Precio:</span>
                <span className="price-value">${service.price}</span>
              </div>
              <button
                className="btn-primary"
                onClick={() => onSelectService(service)}
                disabled={!service.isActive}
              >
                {service.isActive ? 'Reservar' : 'No disponible'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesList;