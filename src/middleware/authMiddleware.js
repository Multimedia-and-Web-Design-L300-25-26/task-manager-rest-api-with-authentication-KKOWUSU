import jwt from "jsonwebtoken";
import User from "../models/User.js";


// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
   try {
    // Step 1: Get the Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please include Authorization header",
      });
    }

    // Step 2: Extract the token from "Bearer <token>"
    // Split by space and get the second part (the token)
    const token = authHeader.split(" ")[1];

    // Step 3: Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Find the user by their ID from the decoded token
    const user = await User.findById(decoded.id);

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 5: Attach user to request object
    // This makes the user accessible in all protected routes via req.user
    req.user = user;

    // Step 6: Call next() to proceed to the next middleware/route handler
    next();
  } catch (error) {
    // If token verification fails (invalid, expired, etc.)
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export default authMiddleware;