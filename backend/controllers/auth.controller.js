import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utilis/generateToken.js';

export const signup = async (req, res) => {
    try {
        const {fullName,username,password,confirmPassword,gender} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error:"Passwords do not match"})
        }

        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error:"Username already exists"})
        }

        //Hash password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //api for profile https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = 'https://avatar.iran.liara.run/public/boy?username=${username}'
        const girlProfilePic = 'https://avatar.iran.liara.run/public/girl?username=${username}'

        const newUser = new User({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender=== 'male' ? boyProfilePic : girlProfilePic,
        })

        if(newUser){
            //Generate JWT token
            await generateTokenAndSetCookie(res, newUser._id);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic,
            });
        }
        else{
            res.status(400).json({error:"Invalid user data"});
        }

    } catch (error) {
        console.log("Error in signup", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const login = async (req, res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }

        generateTokenAndSetCookie(res, user._id);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic,
        });
    }catch(error){
        console.log("Error in login", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"Logout successful"});
    }catch(error){
        console.log("Error in logout", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};