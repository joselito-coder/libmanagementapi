const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth.model');
const bcrypt = require('bcryptjs');
const asyncWrapper = require('../middleware/async');
const authSchema = require('../joiSchemas/authSchema');
const { createCustomError } = require('../errors/customError');


const login = asyncWrapper(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: "Please Provide Login details" })
        return;
    }

    //  Check password here
    const auth = await Auth.findOne({ username });

    if (!auth) {
        return res.status(404).json({ error: `User with username ${username} found` })
    }


    let { username: user, _id: id, password: hashedPass, role } = auth;

    const isPassCorrect = await bcrypt.compare(password, hashedPass);

    if (isPassCorrect) {
        const token = jwt.sign({ id, username, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({ token, success: true })
    }

    res.status(400).json({ error: "Please provide correct credentials" });


})


const register = asyncWrapper(async (req, res, next) => {

    const { value, error } = authSchema.validate(req.body);

    if (error) {
        let errorMsg = error.details[0].message;
        return next(createCustomError(errorMsg, 400));
    }

    const auth = await Auth.create(req.body);
    if (auth) {
        return res.status(200).json({ success: true });
    }
    else {
        return res.status(500).json({ error: "Some Error occured" });
    }



})

const test = asyncWrapper(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(400).json({ error: "Please provide a token" })
    }


    const auth = authorization.split(" ")[1];

    // console.log(req.headers);
    // console.log(auth);

    const babu = await jwt.verify(auth, process.env.JWT_SECRET);

    const { username, role } = babu;

    const msg = `Hi there Mr ${username} Your role is ${role}`;

    res.json({ msg });

    // res.json({ info: "YOU data is sekret" });
})

const usage = (req, res) => {
    res.send("Please POST /login for login \nand POST /register To register ");
}


module.exports = {
    login,
    register,
    test,
    usage,
}