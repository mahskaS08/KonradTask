import React, { useState, useEffect } from "react";
import PropertyGrid from "../../components/PropertyGrid/PropertyGrid";
import PropertyFilters from "../../components/PropertyFilters/PropertyFilters";
import { filterProperties, DEFAULT_FILTERS } from "../../lib/filterUtil";
import { ApiUtil } from "../../lib/apiUtil";
import "./Home.scss";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    ApiUtil.getProperties().then((data) => {
      setProperties(data);
      setFilteredProperties(data);
    });
  }, []);

  useEffect(() => {
    const updatedProperties = filterProperties(properties, filters);
    setFilteredProperties(updatedProperties);
  }, [filters, properties]);

  const handleFilterChange = (updatedFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  return (
    <div className="home-page">
      <div className="home-filters">
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="home-content">
        <PropertyGrid properties={filteredProperties} />
      </div>
    </div>
  );
};

export default Home;
