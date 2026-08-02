require('dotenv').config();

// LLM_PROVIDER selects the backend used by the portfolio chat feature.
// "ollama" (default) talks to a local/self-hosted Ollama server (HOST, OLLAMA_MODEL).
// "openai" talks to any OpenAI-compatible chat completions API (OPENAI_BASE_URL, OPENAI_API_KEY, OPENAI_MODEL).
const provider = (process.env.LLM_PROVIDER || 'ollama').toLowerCase();

const providers = {
    ollama: () => require('./ollama-provider'),
    openai: () => require('./openai-provider'),
};

if (!providers[provider]) {
    throw new Error(`Unknown LLM_PROVIDER "${provider}". Expected "ollama" or "openai".`);
}

module.exports = providers[provider]();
