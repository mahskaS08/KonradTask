// Maximum number of properties to show on a page
export const PROPERTIES_PER_PAGE = 6;

/**
 * Gets the Array of page numbers to shown in the pagination component. The first and last page should always be shown
 * and curPage should be centered among the remaining pages if possible.
 * @param {Number}  totalPages - The total number of pages
 * @param {Number} curPage - The page number that is currently selected. This is 1 indexed so the first page would be 1
 * @param {Number} maxLabels - The maximum number of page numbers to show in the pagination component
 * @return {Array} - Array of page numbers to show in the pagination component.
 * @example getPaginationLabels(100, 50, 5) //returns [1, 49, 50, 51, 100]
 */
export const getPaginationLabels = (totalPages, curPage, maxLabels) => {
  //TODO: replace placeholder solution
  if (totalPages <= 0 || maxLabels <= 0) return [];

  const pages = [];
  const halfRange = Math.floor((maxLabels - 3) / 2);

  if (totalPages <= maxLabels) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (curPage <= halfRange + 2) {
    for (let i = 2; i <= maxLabels - 1; i++) {
      pages.push(i);
    }
    pages.push(totalPages);
  } else if (curPage >= totalPages - halfRange - 1) {
    pages.push(totalPages - maxLabels + 2);
    for (let i = totalPages - maxLabels + 3; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    for (let i = curPage - halfRange; i <= curPage + halfRange; i++) {
      pages.push(i);
    }
    pages.push(totalPages);
  }

  return pages;
};

/**
 * Get the properties to show for the specified page from the full list of properties
 * @param {Array}  properties - Array containing all properties
 * @param {Number} page - The current paginated page the UI should display
 * @return {Array} - The properties for the specified page
 */
export const getPropertiesForPage = (properties, page) => {
  const firstPropertyIndex = PROPERTIES_PER_PAGE * (page - 1);
  const lastPropertyIndex = PROPERTIES_PER_PAGE * page;
  return properties.slice(firstPropertyIndex, lastPropertyIndex);
};
