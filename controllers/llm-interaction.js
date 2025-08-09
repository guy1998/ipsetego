const axios = require('axios');
const { HOST } = require('../common/contants');

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

module.exports = {
    queryTheModel
}