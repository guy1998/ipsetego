const axios = require('axios');
const { HOST } = require('../common/contants');
const { User, Project, Experience, ModelInteraction } = require('../models');

const buildUserContext = (user) => {
    let context = `You are ${user.name} ${user.lastname}.\n`;

    if (user.hobbies && user.hobbies.length > 0) {
        context += `My hobbies are: ${user.hobbies.join(', ')}.\n`;
    }

    if (user.languages && user.languages.length > 0) {
        context += `I speak: ${user.languages.join(', ')}.\n`;
    }

    if (user.linkedin) {
        context += `My LinkedIn profile: ${user.linkedin}\n`;
    }

    if (user.github) {
        context += `My GitHub profile: ${user.github}\n`;
    }

    if (user.Projects && user.Projects.length > 0) {
        context += `\nMy Projects:\n`;
        user.Projects.forEach((project) => {
            context += `- ${project.title}`;
            if (project.description) context += `: ${project.description}`;
            if (project.relatedLink) context += ` (${project.relatedLink})`;
            context += '\n';
        });
    }

    if (user.Experiences && user.Experiences.length > 0) {
        context += `\nMy Professional Experience:\n`;
        user.Experiences.forEach((exp) => {
            context += `- ${exp.title}`;
            const startDate = new Date(exp.startDate).getFullYear();
            let dateRange = ` (${startDate}`;
            if (exp.endDate) {
                dateRange += ` - ${new Date(exp.endDate).getFullYear()}`;
            } else {
                dateRange += ' - Present';
            }
            dateRange += ')';
            context += dateRange;
            if (exp.description) context += `: ${exp.description}`;
            if (exp.relatedLink) context += ` (${exp.relatedLink})`;
            context += '\n';
        });
    }

    return context;
};

/**
 * Stream the model response to the HTTP response using SSE.
 * Looks up the portfolio owner by publicId, saves the interaction encrypted.
 */
const streamModelAsUser = async (publicId, prompt, ip, res) => {
    const user = await User.findOne({
        where: { publicId },
        include: [
            { model: Project, as: 'Projects' },
            { model: Experience, as: 'Experiences' },
        ],
    });

    if (!user) {
        throw new Error(`User with publicId ${publicId} not found`);
    }

    const userContext = buildUserContext(user);
    const fullPrompt = `${userContext}\n\nUser's Question: ${prompt}\n\nAnswer as me, in first person.`;

    // Save the question record immediately
    const interaction = await ModelInteraction.create({
        userId: user.id,
        question: prompt,
        ip,
        questionAt: new Date(),
    });

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const ollamaResponse = await axios.post(`${HOST}/api/generate`, {
        model: 'mistral',
        prompt: fullPrompt,
        stream: true,
    }, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'stream',
        timeout: 120000,
    });

    let fullResponse = '';

    ollamaResponse.data.on('data', (chunk) => {
        const raw = chunk.toString();
        const lines = raw.split('\n').filter(l => l.trim());
        for (const line of lines) {
            try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                    fullResponse += parsed.response;
                    res.write(`data: ${JSON.stringify({ token: parsed.response })}\n\n`);
                }
                if (parsed.done) {
                    res.write(`data: [DONE]\n\n`);
                }
            } catch {
                // skip malformed JSON lines
            }
        }
    });

    ollamaResponse.data.on('end', async () => {
        try {
            await interaction.update({
                response: fullResponse,
                responseAt: new Date(),
            });
        } catch (err) {
            console.error('Error saving interaction response:', err.message);
        }
        res.end();
    });

    ollamaResponse.data.on('error', async (err) => {
        console.error('Ollama stream error:', err.message);
        res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
        res.end();
    });
};

module.exports = {
    streamModelAsUser,
};
