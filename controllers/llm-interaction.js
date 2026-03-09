const axios = require('axios');
const { HOST } = require('../common/contants');
const { User, Project, Experience } = require('../models');

const queryTheModel = async (query) => {
    const response = await axios.post(`${HOST}/api/generate`, {
      model: 'mistral',
      prompt: query
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000
    });
    return response.data;
}

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
            if (project.description) {
                context += `: ${project.description}`;
            }
            if (project.relatedLink) {
                context += ` (${project.relatedLink})`;
            }
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
                const endDate = new Date(exp.endDate).getFullYear();
                dateRange += ` - ${endDate}`;
            } else {
                dateRange += ' - Present';
            }
            dateRange += ')';
            context += dateRange;
            if (exp.description) {
                context += `: ${exp.description}`;
            }
            if (exp.relatedLink) {
                context += ` (${exp.relatedLink})`;
            }
            context += '\n';
        });
    }
    
    return context;
}

const queryModelAsUser = async (userId, prompt) => {
    try {
        const user = await User.findByPk(userId, {
            include: [
                { model: Project, as: 'Projects' },
                { model: Experience, as: 'Experiences' }
            ]
        });
        
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        
        const userContext = buildUserContext(user);
        const fullPrompt = `${userContext}\n\nUser's Question: ${prompt}\n\nAnswer as me, in first person.`;
        
        const response = await queryTheModel(fullPrompt);
        
        return response;
    } catch (error) {
        console.error('Error querying model as user:', error.message);
        throw error;
    }
}

module.exports = {
    queryTheModel,
    queryModelAsUser
}