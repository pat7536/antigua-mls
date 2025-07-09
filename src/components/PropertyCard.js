export default function PropertyCard({ property }) {
  const { fields } = property;
  const title = fields.Title || 'No Title';
  const price = fields.Price ? `$${fields.Price.toLocaleString()}` : 'Price on Request';
  const location = fields.Location || 'Location not specified';
  const thumbnail = fields.Image;
  const bedrooms = fields.Beds;
  const bathrooms = fields.Baths;
  const sqft = fields.SquareFootage;
  const propertyType = fields.PropertyType;
  const propertyURL = fields['Property URL'];

  const handleCardClick = () => {
    if (propertyURL) {
      window.open(propertyURL, '_blank');
    }
  };

  return (
    <div 
      className="card clickable-card" 
      onClick={handleCardClick}
      style={{ cursor: propertyURL ? 'pointer' : 'default' }}
    >
      <div className="card-image">
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <svg width="64" height="64" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-price">{price}</p>
        <p className="card-location">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {location}
        </p>
        
        <div className="card-details">
          {bedrooms && (
            <span className="card-detail">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2L3 7v11a2 2 0 002 2h4v-6h2v6h4a2 2 0 002-2V7l-7-5z" />
              </svg>
              {bedrooms} bed
            </span>
          )}
          {bathrooms && (
            <span className="card-detail">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              </svg>
              {bathrooms} bath
            </span>
          )}
          {sqft && (
            <span className="card-detail">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              {sqft.toLocaleString()} sq ft
            </span>
          )}
          {propertyType && (
            <span className="badge">
              {propertyType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}