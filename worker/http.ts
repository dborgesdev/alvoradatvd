export async function fetchLimited(
  url: string,
  maxBytes = 2_000_000,
): Promise<string> {
  return (await fetchLimitedResponse(url, maxBytes)).text;
}
export async function fetchLimitedResponse(
  url: string,
  maxBytes = 2_000_000,
): Promise<{ text: string; headers: Headers }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
      headers: {
        Accept:
          "application/rss+xml, application/xml, application/json, text/xml;q=0.9",
      },
    });
    if (!response.ok || !response.body) throw new Error("Fonte indisponível");
    if (Number(response.headers.get("Content-Length")) > maxBytes)
      throw new Error("Resposta muito grande");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let length = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > maxBytes) {
        await reader.cancel();
        throw new Error("Resposta muito grande");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return { text: new TextDecoder().decode(bytes), headers: response.headers };
  } finally {
    clearTimeout(timer);
  }
}
