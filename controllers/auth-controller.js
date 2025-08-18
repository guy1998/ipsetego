const { User } = require('../models');
const { passwordVerifier } = require('../utils/security');
const { tokenIssuing } = require('../utils/jwt');
const cookieManager = require('../utils/cookies');

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email }});
        if (!user) {
            res.status(404).json({ message: "User not found!" });
        }else if (!passwordVerifier(password, user.password)) {
            res.status(400).json({ message: "Password is invalid!" });
        } else {
            const tokenObj = tokenIssuing({
                userId: user.id,
                role: user.role,
            });
            cookieManager.setCookie(res, tokenObj);
            res.status(200).json({ message: "Authentication was successful!" });
        }
    } catch (error) {
        res.status(503).json({ message: "Internal server error!" });
    }
};

const logout = async (req, res) => {
    try {
        cookieManager.deleteCookie(res);
        res.status(200).json({ message: "Logging out..." });
    } catch (error) {
        res.status(503).json({ message: "Internal server error!" });
    }
};

module.exports = {
    login,
    logout
}