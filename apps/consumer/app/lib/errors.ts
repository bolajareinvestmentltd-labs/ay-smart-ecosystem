export function safeJson(response: Response) {
  return response.json().catch(() => ({}));
}
