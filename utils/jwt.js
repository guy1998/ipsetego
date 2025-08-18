const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieManager = require('./cookie-manager');

const tokenIssuing = async (userInfo) => {
    const accessToken = jwt.sign({ ...userInfo }, process.env.JWT_KEY, { expiresIn: 900 }) //15 minutes
    const refreshToken = jwt.sign({ ...userInfo }, process.env.JWT_KEY, { expiresIn: '2h' });
    return { accessToken: accessToken, refreshToken: refreshToken };
}

const tokenChecker = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        return { result: true, payload: decoded };
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { result: false, code: 2 }
        } else {
            return { result: false, code: 3 }
        }
    }
}

const tokenRefresher = (refreshToken) => {
    const checkToken = tokenChecker(refreshToken);
    if (checkToken.result) {
        const content = tokenIssuing(checkToken.payload)
        return { result: true, content }
    } else if (checkToken.code === 2) {
        return { result: false, content: "Token expired" }
    } else {
        return { result: false, content: "Token is invalid" }
    }
}

const identifyRole = (req)=>{
    const accessToken = req.cookies.tokenCookie.accessToken;
    const decoded = jwt.verify(accessToken, process.env.JWT_KEY);
    return decoded.role;
}

const retrieveId = (req)=>{
    const accessToken = req.cookies.tokenCookie.accessToken;
    const decoded = jwt.verify(accessToken, process.env.JWT_KEY);
    return decoded.userId;
}

module.exports = {
    retrieveId,
    identifyRole,
    tokenRefresher,
    tokenChecker,
    tokenIssuing
}

