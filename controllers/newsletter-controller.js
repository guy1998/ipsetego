const { NewsletterSubscription } = require('../models');
const { encryptDeterministic } = require('../utils/encryption');

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    // Use pre-encrypted value in WHERE to avoid the setter encrypting it again
    const existing = await NewsletterSubscription.findOne({ where: { email: encryptDeterministic(email) } });
    if (existing) {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }
    await NewsletterSubscription.create({ email }); // setter encrypts on create
    res.status(201).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.log(error);
    res.status(503).json({ message: 'Internal server error!' });
  }
};

module.exports = { subscribe };
