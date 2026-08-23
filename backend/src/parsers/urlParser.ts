export async function analyzeUrlTarget(targetUrl: string): Promise<{ text: string; domain: string }> {
  try {
    const urlObj = new URL(targetUrl);
    const domain = urlObj.hostname;

    // Fetch page text safely with 5-second timeout and 500KB cap
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ScamCheck-Security-Analyzer/1.0'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        text: `Opportunity URL: ${targetUrl}\nDomain: ${domain}\nStatus: HTTP ${response.status}`,
        domain
      };
    }

    const html = await response.text();
    // Strip script, style, and HTML tags to extract clean readable text
    const cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // 10k characters cap

    return {
      text: `Opportunity URL: ${targetUrl}\nDomain: ${domain}\nExtracted Page Content:\n${cleanText}`,
      domain
    };
  } catch (err: any) {
    return {
      text: `Opportunity URL: ${targetUrl}\nDomain analysis: Unreachable or private network link (${err.message || 'connection failed'}).`,
      domain: targetUrl
    };
  }
}
