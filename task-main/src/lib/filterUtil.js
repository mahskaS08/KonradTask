export const filterProperties = (properties, filters) => {
  if (!properties || !properties.length) {
    return [];
  }

  const {
    locationFilter,
    rateFilter,
    starsFilter,
    houseTypeFilter,
    placeTypeFilter,
    superHostFilter,
  } = filters;
  const houseTypeSet = new Set(houseTypeFilter);
  const placeTypeSet = new Set(placeTypeFilter);

  const failsRangeCheck = (range, field) =>
    range && (range[0] > field || range[1] < field);
  const failsSetCheck = (set, field) => set.size > 0 && !set.has(field);

  return properties.filter((property) => {
    if (locationFilter && locationFilter !== property.country) {
      return false;
    }

    if (superHostFilter && !isSuperHost(property, properties)) {
      return false;
    }

    if (
      failsRangeCheck(rateFilter, property.rate) ||
      failsRangeCheck(starsFilter, property.stars)
    ) {
      return false;
    }

    if (
      failsSetCheck(houseTypeSet, property.houseType) ||
      failsSetCheck(placeTypeSet, property.placeType)
    ) {
      return false;
    }

    return true;
  });
};

function isSuperHost(property, allProperties) {
  const hostProperties = allProperties.filter(
    (prop) => prop.hostId === property.hostId
  );

  const totalRating = hostProperties.reduce((sum, prop) => sum + prop.stars, 0);
  const averageRating = totalRating / hostProperties.length;

  return averageRating >= 4;
}

export const RATE_FILTER_META = {
  MIN: 0,
  MAX: 2000,
};

export const STAR_FILTER_META = {
  MIN: 0,
  MAX: 5,
};

export const DEFAULT_FILTERS = {
  locationFilter: null,
  placeTypeFilter: [],
  houseTypeFilter: [],
  superHostFilter: false,
  rateFilter: [RATE_FILTER_META.MIN, RATE_FILTER_META.MAX],
  starsFilter: [STAR_FILTER_META.MIN, STAR_FILTER_META.MAX],
};
