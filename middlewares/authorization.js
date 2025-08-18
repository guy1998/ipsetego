const { tokenChecker, tokenRefresher } = require('../utils/jwt');

const authorize = async (req, res, next) => {
    const tokens = req.cookies.tokenCookie;
    if (tokens) {
        const checkAccess = tokenChecker(tokens.accessToken);
        if (checkAccess.result) {
            return next();
        } else {
            const refreshAccess = tokenRefresher(tokens.refreshToken);
            if (refreshAccess.result) {
                cookieManager.setCookie(res, {
                    accessToken: refreshAccess.content.accessToken,
                    refreshToken: refreshAccess.content.refreshToken,
                });
                req.cookies.tokenCookie.accessToken = refreshAccess.content.accessToken;
                return next();
            } else {
                return res.status(401).json(refreshAccess.content);
            }
        }
    } else {
        return res.status(401).json('No token presented');
    }
};

module.exports = authorize