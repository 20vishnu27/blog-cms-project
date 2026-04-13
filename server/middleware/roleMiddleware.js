export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: "Not logged in" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access only" });
  }

  next();
};