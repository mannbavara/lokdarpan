/**
 * Formats a date string to DD/MM/YYYY format
 * @param dateString - Date string in ISO format (e.g., "2025-12-13" or "2025-12-13T10:24:56.350530")
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "-";
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }

    // Get day, month, year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

/**
 * Formats a date string to DD-MM-YYYY HH:MM:SS AM/PM format
 * @param dateString - Date string in ISO format (e.g., "2025-12-13T10:24:56.350530")
 * @returns Formatted date string in DD-MM-YYYY HH:MM:SS AM/PM format
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) {
    return "-";
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "-";
    }

    // Get day, month, year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Get hours in 12-hour format
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    // Get minutes, seconds
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}
