const USER_ROLES = {
  VIEWER: 'Viewer',
  ANALYST: 'Analyst', 
  ADMIN: 'Admin'
};

const USER_STATUSES = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

const VALID_USER_ROLES = Object.values(USER_ROLES); 
const VALID_USER_STATUSES = Object.values(USER_STATUSES);

const RECORD_TYPES = {
  INCOME:  'Income',
  EXPENSE: 'Expense',
};

const RECORD_CATEGORIES = {
  [RECORD_TYPES.INCOME]: [
    'Service Revenue',
    'Product Sales',
    'Investment Return',
    'Bonus',
    'Grant',
    'Funding',
    'Other',
  ],
  [RECORD_TYPES.EXPENSE]: [
    'Rent',
    'Salaries',
    'Software',
    'Equipment',
    'Marketing',
    'Travel',
    'Food and Meals',
    'Utilities',
    'Taxes',
    'Miscellaneous',
    'Other',
  ],
};

// Derived constants
const RECORD_TYPE_LIST       = Object.values(RECORD_TYPES);
const ALL_RECORD_CATEGORIES  = [...new Set(Object.values(RECORD_CATEGORIES).flat())];

const getCategoriesForType = (type) => RECORD_CATEGORIES[type] ?? [];
const getAllTypesAndCategories = () => {
  const result = {};
  for (const type of RECORD_TYPE_LIST) {
    result[type] = getCategoriesForType(type);
  }
  return result;
};

module.exports = {
  VALID_USER_ROLES,
  VALID_USER_STATUSES,
  RECORD_TYPES,
  RECORD_CATEGORIES,
  RECORD_TYPE_LIST,
  ALL_RECORD_CATEGORIES,
  getCategoriesForType,
  getAllTypesAndCategories
};