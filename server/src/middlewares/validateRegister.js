export async function validateRegister(req, res, next) {
    let { name, email, password } = req.body;

    // Sanitize input
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    // Required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // Name validation
    if (name.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Name must be at least 3 characters long",
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address",
        });
    }

    // Password validation
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message:
                "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number, and special character.",
        });
    }

    // Save sanitized values
    req.body.name = name;
    req.body.email = email;
    req.body.password = password;

    next();
}