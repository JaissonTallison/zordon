const API_URL = "http://localhost:3333";

export async function apiFetch(path: string) {
  const res = await fetch(`${API_URL}${path}`);

  if (!res.ok) {
    const text = await res.text();
    console.error("Erro API:", res.status, text);

    throw new Error(`Erro na API: ${res.status}`);
  }

  return res.json();
}