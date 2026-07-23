// Canonical asset categories — kept in sync with the Create Asset form
// (modules/assets/components/CreateAssets.tsx). Used by the Stock and
// Disbursement page category filters.
export const ASSET_CATEGORIES: string[] = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Printer",
  "Accessories",
  "TV",
  "Ipad/Tab",
  "Projector",
  "Attendence Machine",
  "Speaker",
  "Scanner",
  "Camera",
  "NVR/DVR",
  "Online/Industrial UPS",
  "Conference System",
  "Firewall",
  "Core Router",
  "Access Point",
  "Server",
  "Network Rack",
  "24 Port Switch Managable",
  "48 Port Switch Managable",
  "Non Managable Switch",
];

/**
 * Categories promoted to one-click chips above the table. Chosen from the live
 * volume per bucket — everything else stays reachable through the toolbar's
 * "Select Category" dropdown.
 *
 * Filtering is a LIKE match, so "Camera" also covers CAMERA / IP Camera /
 * PC Camera, which are separate rows in the data.
 */
export const TOP_STOCK_CATEGORIES: string[] = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Accessories",
  "Camera",
  "Printer",
];

export const TOP_DISBURSEMENT_CATEGORIES: string[] = [
  "Desktop",
  "Monitor",
  "Laptop",
  "Accessories",
  "Printer",
  "Attendence Machine",
];
