import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })

    res.cookie("jwt",token,{
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, //prevent XSS attacks cross-site scripting
        sameSite: "strict", //prevent CSRF attacks
        secure: process.env.NODE_ENV !== "development", //secure cookie in production
    });
};

export default generateTokenAndSetCookie;