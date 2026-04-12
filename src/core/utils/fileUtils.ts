/**
 * Constructs full URL for accessing uploaded files from the API server
 * @param path - Relative file path from the API (e.g., "/uploads/profiles/abc123.jpg")
 * @returns Full URL to access the file
 */
export function getFileUrl(path: string): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.replace("/api", "");
  return `${baseUrl}${path}`;
}
