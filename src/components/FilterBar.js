export default function FilterBar({ filters, onFilterChange, onClearFilters }) {
  const { bedrooms, priceRange, location } = filters;

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <h3>Filter Properties</h3>
        <div className="filter-controls">
          
          {/* Bedrooms Filter */}
          <div className="filter-group">
            <label htmlFor="bedrooms">Bedrooms</label>
            <select 
              id="bedrooms"
              value={bedrooms} 
              onChange={(e) => onFilterChange('bedrooms', e.target.value)}
              className="filter-select"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <label htmlFor="priceRange">Price Range</label>
            <select 
              id="priceRange"
              value={priceRange} 
              onChange={(e) => onFilterChange('priceRange', e.target.value)}
              className="filter-select"
            >
              <option value="">Any Price</option>
              <option value="0-500000">Under $500K</option>
              <option value="500000-1000000">$500K - $1M</option>
              <option value="1000000-2000000">$1M - $2M</option>
              <option value="2000000-5000000">$2M - $5M</option>
              <option value="5000000-999999999">$5M+</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <input 
              type="text"
              id="location"
              value={location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              placeholder="Search location..."
              className="filter-input"
            />
          </div>

          {/* Clear Filters Button */}
          <div className="filter-group">
            <button 
              onClick={onClearFilters}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}