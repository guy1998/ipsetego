const { NewsletterSubscription } = require('../models');

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    const [, created] = await NewsletterSubscription.findOrCreate({ where: { email } });
    if (!created) {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }
    res.status(201).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: 'Internal server error!' });
  }
};

module.exports = { subscribe };
