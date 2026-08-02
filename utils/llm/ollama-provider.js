const axios = require('axios');
const { HOST } = require('../../common/contants');

const MODEL = process.env.OLLAMA_MODEL || 'mistral';

/**
 * Streams a completion from an Ollama server.
 * Calls onToken(text) for each generated chunk and resolves with the full response.
 */
const streamCompletion = async (prompt, onToken) => {
    if (!HOST) {
        throw new Error('HOST is not set (Ollama server URL)');
    }

    const response = await axios.post(`${HOST}/api/generate`, {
        model: MODEL,
        prompt,
        stream: true,
    }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'stream',
        timeout: 120000,
    });

    return new Promise((resolve, reject) => {
        let fullResponse = '';

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n').filter(l => l.trim());
            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.response) {
                        fullResponse += parsed.response;
                        onToken(parsed.response);
                    }
                } catch {
                    // skip malformed JSON lines
                }
            }
        });

        response.data.on('end', () => resolve(fullResponse));
        response.data.on('error', reject);
    });
};

module.exports = { streamCompletion };
