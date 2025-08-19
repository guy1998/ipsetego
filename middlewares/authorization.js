const { tokenChecker, tokenRefresher } = require('../utils/jwt');
const cookieManager = require('../utils/cookies');

const checkRole = (userRole, requiredRole) => {
    return userRole === requiredRole || !requiredRole;
};

const authorize = async (req, res, next, role) => {
    const tokens = req.cookies.tokenCookie;
    if (tokens) {
        const checkAccess = tokenChecker(tokens.accessToken);
        if (checkAccess.result) {
            const roleCheckResult = checkRole(checkAccess.payload.role, role);
            if (roleCheckResult)
                return next();
            res.status(401).json("Access not allowed for this role!");
        } else {
            const refreshAccess = tokenRefresher(tokens.refreshToken);
            if (refreshAccess.result) {
                cookieManager.setCookie(res, {
                    accessToken: refreshAccess.content.accessToken,
                    refreshToken: refreshAccess.content.refreshToken,
                });
                req.cookies.tokenCookie.accessToken = refreshAccess.content.accessToken;
                const roleCheckResult = checkRole(checkAccess.payload.role, role);
                if (roleCheckResult)
                    return next();
                res.status(401).json("Access not allowed for this role!");
            } else {
                return res.status(401).json(refreshAccess.content);
            }
        }
    } else {
        return res.status(401).json('No token presented');
    }
};

module.exports = authorize