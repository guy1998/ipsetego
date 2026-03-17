const { tokenChecker, tokenRefresher } = require('../utils/jwt');

const adminAuthorize = () => {
    return async (req, res, next) => {
        const tokens = req.cookies?.adminTokenCookie;
        if (!tokens) {
            return res.status(401).json({ message: 'No token presented' });
        }

        const checkAccess = tokenChecker(tokens.accessToken);
        if (checkAccess.result) {
            if (checkAccess.payload.role !== 'admin') {
                return res.status(403).json({ message: 'Access not allowed for this role!' });
            }
            req.admin = checkAccess.payload;
            return next();
        }

        const refreshAccess = tokenRefresher(tokens.refreshToken);
        if (refreshAccess.result) {
            const newTokens = refreshAccess.content;
            res.cookie('adminTokenCookie', { ...newTokens }, {
                maxAge: 3600000,
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
            req.cookies.adminTokenCookie.accessToken = newTokens.accessToken;

            const decoded = tokenChecker(newTokens.accessToken);
            if (!decoded.result || decoded.payload.role !== 'admin') {
                return res.status(403).json({ message: 'Access not allowed for this role!' });
            }
            req.admin = decoded.payload;
            return next();
        }

        return res.status(401).json({ message: refreshAccess.content });
    };
};

module.exports = adminAuthorize;
