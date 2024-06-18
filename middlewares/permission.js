const can = (...roles) => {
    return (req, res, next) => {
        const role = req.user.role;
        if (!roles.includes(role)) {
            return res
                .status(405)
                .json({
                    status: 'error',
                    message: 'You don\'t have permission'
                });
        }

        return next();
    };
};

module.exports = can;