import React from "react";
import PropTypes from "prop-types";
import CheckboxGroup from "../Form/Checkbox/CheckboxGroup";
import Dropdown from "../Form/Dropdown/Dropdown";
import RadioToggle from "../Form/RadioToggle/RadioToggle";
import RangeSelect from "../Form/RangeSelect/RangeSelect";
import cx from "classnames";
import { RATE_FILTER_META, STAR_FILTER_META } from "../../lib/filterUtil";
import "./PropertyFilters.scss";

const LOCATION_OPTIONS = [
  { label: "Canada", value: "CA" },
  { label: "Costa Rica", value: "CR" },
  { label: "United States", value: "US" },
];

const PLACE_TYPE_OPTIONS = [
  "Entire place",
  "Private room",
  "Hotel room",
  "Shared room",
];
const HOUSE_TYPE_OPTIONS = [
  "House",
  "Apartment",
  "Bed and breakfast",
  "Boutique hotel",
];

const PropertyFilters = ({ filters, onFilterChange }) => {
  const [mobileCollapsed, setMobileCollapsed] = React.useState(true);

  const handleChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div
      className={cx("property-filters", { "mobile-open": !mobileCollapsed })}
    >
      <div className="filter-wrapper">
        <button
          className="mobile-filter-button"
          onClick={() => setMobileCollapsed(!mobileCollapsed)}
        >
          Filters
          <i className={`fas ${mobileCollapsed ? "fa-plus" : "fa-minus"}`} />
        </button>
        <div
          className={cx("filter-content", { "mobile-hidden": mobileCollapsed })}
        >
          <Dropdown
            name="locationFilter"
            title="Location"
            options={LOCATION_OPTIONS}
            value={filters.locationFilter}
            onChange={(value) => handleChange("locationFilter", value)}
          />
          <RangeSelect
            title="Rate"
            min={RATE_FILTER_META.MIN}
            max={RATE_FILTER_META.MAX}
            step={10}
            isCurrency
            value={filters.rateFilter}
            onChange={(value) => handleChange("rateFilter", value)}
          />
          <RangeSelect
            title="Stars"
            min={STAR_FILTER_META.MIN}
            max={STAR_FILTER_META.MAX}
            step={0.5}
            value={filters.starsFilter}
            onChange={(value) => handleChange("starsFilter", value)}
          />
          <CheckboxGroup
            id="form-property-type"
            title="Property Type"
            options={HOUSE_TYPE_OPTIONS}
            value={filters.houseTypeFilter}
            onChange={(value) => handleChange("houseTypeFilter", value)}
          />
          <CheckboxGroup
            id="form-place-type"
            title="Type of Place"
            options={PLACE_TYPE_OPTIONS}
            value={filters.placeTypeFilter}
            onChange={(value) => handleChange("placeTypeFilter", value)}
          />
          <RadioToggle
            name="superHostFilter"
            title="Super Host"
            value={filters.superHostFilter}
            onChange={(value) => handleChange("superHostFilter", value)}
          />
        </div>
      </div>
    </div>
  );
};

PropertyFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default PropertyFilters;
