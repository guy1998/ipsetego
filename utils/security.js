const bcrypt = require("bcrypt");

const passwordHasher = password => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

const passwordVerifier = (incomingPassword, databasePassword) => {
  return bcrypt.compareSync(incomingPassword, databasePassword);
};

module.exports = {
  passwordHasher,
  passwordVerifier
};