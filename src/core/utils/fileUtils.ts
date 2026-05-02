/**
 * Constructs full URL for accessing uploaded files from the API server.
 * If the path is already an absolute URL (Google profile pictures, external CDN),
 * it is returned as-is.
 * @param path - Relative file path or absolute URL
 * @returns Full URL to access the file
 */
export function getFileUrl(path: string): string {
  if (!path) return path;
  // Already absolute — Google profile pictures, external CDN, etc.
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.replace("/api", "");
  return `${baseUrl}${path}`;
}
