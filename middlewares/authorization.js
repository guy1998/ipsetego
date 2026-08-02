const { tokenChecker, tokenRefresher } = require("../utils/jwt");
const cookieManager = require("../utils/cookies");

const checkRole = (userRole, requiredRole) => {
  return userRole === requiredRole || !requiredRole;
};

const authorize = (roleRequired = null) => {
  return async (req, res, next) => {
    const tokens = req.cookies?.tokenCookie;
    if (tokens) {
      const checkAccess = tokenChecker(tokens.accessToken);
      if (checkAccess.result) {
        const roleCheckResult = checkRole(
          checkAccess.payload.role,
          roleRequired,
        );
        if (roleCheckResult) {
          req.user = checkAccess.payload;
          return next();
        }
        return res.status(403).json("Access not allowed for this role!");
      } else {
        const refreshAccess = tokenRefresher(tokens.refreshToken);
        if (refreshAccess.result) {
          cookieManager.setCookie(res, {
            accessToken: refreshAccess.content.accessToken,
            refreshToken: refreshAccess.content.refreshToken,
          });
          req.cookies.tokenCookie.accessToken =
            refreshAccess.content.accessToken;
          const decoded = tokenChecker(refreshAccess.content.accessToken);
          const roleCheckResult =
            decoded.result && checkRole(decoded.payload.role, roleRequired);
          if (roleCheckResult) {
            req.user = decoded.payload;
            return next();
          }
          return res.status(403).json("Access not allowed for this role!");
        } else {
          return res.status(401).json(refreshAccess.content);
        }
      }
    } else {
      return res.status(401).json("No token presented");
    }
  };
};

module.exports = authorize;
