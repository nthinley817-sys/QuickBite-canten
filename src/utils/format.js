export const money = (n) => `Nu. ${n}`;

// Pending -> Processing -> Completed. Used by both the customer "Refresh Status"
// button and staff action buttons so both views advance the same mock order.
export const nextStatus = { Pending: "Processing", Processing: "Completed", Completed: "Completed" };

// Simple demo hash function for the Data Structure Monitor's bucket visualization.
// This is a UI demonstration only — it is NOT a real hash table implementation.
export const simpleHash = (str) => {
  let sum = 0;
  for (const c of str) sum += c.charCodeAt(0);
  return sum % 10;
};
