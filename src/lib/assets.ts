/**
 * Resolves static asset paths correctly across both local dev and subpath deployments like GitHub Pages (/MODALINE/).
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  // If it's already an absolute external URL or data/blob URI, return as-is
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${normalizedBase}${cleanPath}`;
}
