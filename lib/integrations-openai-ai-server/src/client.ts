import OpenAI from "openai";

function createOpenAIClient(): OpenAI {
  const apiKey =
    process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
  const baseURL =
    process.env.AI_INTEGRATIONS_OPENAI_BASE_URL ??
    process.env.OPENAI_BASE_URL ??
    "https://api.openai.com/v1";

  if (!apiKey) {
    throw new Error(
      "No OpenAI API key found. Set OPENAI_API_KEY in your .env file.",
    );
  }

  return new OpenAI({ apiKey, baseURL });
}

let _client: OpenAI | null = null;

export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    if (!_client) {
      _client = createOpenAIClient();
    }
    const value = (_client as any)[prop];
    return typeof value === "function" ? value.bind(_client) : value;
  },
});
