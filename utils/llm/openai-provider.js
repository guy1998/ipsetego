const axios = require('axios');

const BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Streams a completion from any OpenAI-compatible chat completions endpoint
 * (OpenAI, Groq, Together, a local vLLM/llama.cpp server, etc — set OPENAI_BASE_URL).
 * Calls onToken(text) for each generated chunk and resolves with the full response.
 */
const streamCompletion = async (prompt, onToken) => {
    if (!API_KEY) {
        throw new Error('OPENAI_API_KEY is not set');
    }

    const response = await axios.post(`${BASE_URL}/chat/completions`, {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        responseType: 'stream',
        timeout: 120000,
    });

    return new Promise((resolve, reject) => {
        let fullResponse = '';
        let buffer = '';

        response.data.on('data', (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const data = trimmed.slice(5).trim();
                if (data === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(data);
                    const token = parsed.choices?.[0]?.delta?.content;
                    if (token) {
                        fullResponse += token;
                        onToken(token);
                    }
                } catch {
                    // skip malformed SSE lines
                }
            }
        });

        response.data.on('end', () => resolve(fullResponse));
        response.data.on('error', reject);
    });
};

module.exports = { streamCompletion };
