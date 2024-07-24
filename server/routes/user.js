import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User } from '../models/user.js';
import { Task } from '../models/Tasks.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import multer from 'multer';
import path from 'path';


/* UPLOAD IMAGES FOR PROFILE PICTURE */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Profile'); // Save to 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append file extension
    }
});

const upload = multer({ storage: storage });

/* Register New Employees */

router.post('/signup', upload.single('profilePicture'), async (req, res) => {
    const {
        username,
        email,
        password,
        firstName,
        lastName,
        gender,
        role,
        contactNumber
    } = req.body;

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
        return res.json({ message: "User already existed" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = new User({
        username,
        email,
        password: hashpassword,
        firstName,
        lastName,
        gender,
        role,
        contactNumber,
        profilePicture: req.file ? req.file.path : null
    });

    await newuser.save();
    return res.json({ status: true, message: "Record registered", newEmployee: newuser });
});

/* Create Tasks */

router.post('/task', async (req, res) => {
    try {
        const {
            name,
            description,
            date,
            priority
        } = req.body;

        const existingTask = await Task.findOne({ $or: [{ name }, { description }] });
        if (existingTask) {
            return res.status(400).json({ message: "Task already created!" });
        }

        const newTask = new Task({
            name,
            description,
            date,
            priority,
        });

        await newTask.save();
        return res.status(201).json({ status: true, message: "Task Created", newTask: newTask });
    } catch (error) {
        console.error("Error creating task:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: "User is not registered" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ status: false, message: "Password is incorrect" });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username }, // Include user ID in the token payload
        process.env.KEY,
        { expiresIn: '7h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 60 * 60 * 1000 }); // Set maxAge to match the token expiry

    return res.json({ status: true, message: "Login successfully", role: user.role });
});


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: true, message: "Logged out successfully" });
});



router.post('/forgot-password', async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "User not registered" })
        }

        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' })

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'prod.tracker2024@gmail.com',
                pass: 'nzif bqmm mwdp lxtq'
            }
        });

        var mailOptions = {
            from: 'prod.tracker2024@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:5173/resetPassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.json({ message: "Error sending email" })
            } else {
                return res.json({ status: true, message: "Email sent" })

            }
        });

    } catch (err) {
        console.log(err)
    }

})

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body

    try {
        const decoded = jwt.verify(token, process.env.KEY);

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({ message: "Invalid token or user does not exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword;
        await user.save();

        res.json({ status: true, message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Invalid or expired token" });
    }
})

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ status: false, message: "No token provided" });
        }

        console.log("Token:", token);

        const decoded = jwt.verify(token, process.env.KEY);

        console.log("Decoded token:", decoded);

        if (!decoded.id) {
            console.log("Token does not contain user ID");
            return res.status(400).json({ status: false, message: "Invalid token: no user ID" });
        }

        req.user = decoded; // Attach decoded user info to the request
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ status: false, message: "Unauthorized", error: err.message });
    }
};

router.get('/verify', verifyUser, (req, res) => {
    return res.json({ status: true, message: "authorized" });
});


//    ADMIN INTERFACE: Employee Status added in Employe Details

router.put('/status', async (req, res) => {
    const { userId, status } = req.body;

    if (!['Production', 'Meeting', 'Coaching', 'Lunch', 'Break', 'Unavailable'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ status: user.status });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


// EMPLOYEE: Status update

router.put('/update-status', verifyUser, async (req, res) => {
    const allowedStatuses = ['Production', 'Meeting', 'Coaching', 'Lunch', 'Break', 'Unavailable'];
    try {
        const { status } = req.body;
        const userId = req.user.id;

        console.log('User ID from token:', userId);

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        console.log('Updating status for user:', userId, 'New status:', status);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status: status },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Status updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});

router.get('/get-status', verifyUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId, 'status');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, status: user.status });
    } catch (error) {
        console.error("Error fetching user status:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
});



  // ------------------------------------------------------


/* GET THE INFORMATION TO PUT IN EMPLOYEE DETAILS */

router.get('/employees', async (req, res) => {
    try {
        const employees = await User.find();
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



/* GET THE INFORMATION FOR TASK */

// Example backend endpoint
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



/* Delete Tasks */

router.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (err) {
        console.error("Error deleting Task:", err);
        res.status(400).json(err);
    }
});

/* Task Routes */

export { router as UserRouter }
