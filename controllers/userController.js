const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/User');


module.exports.signUp = async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = {};
    user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send("user already exists")
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    try {
        const result = await user.save();
        const token = await user.getJwt();
        res.send({
            name: req.body.name,
            email: req.body.email,
            token: token,
            message: "user Registered Successfully"
        })
    } catch (error) {

    }
}

module.exports.signIn = async (req, res) => {
    let user = {};
    user = await User.findOne({email: req.body.email});
    if(!user) res.status(404).send("user not found in server");
    const passWordValidation = await bcrypt.compare(req.body.password,user.password);
    if(!passWordValidation) return res.status(400).send("Invalid Password");
    const token = await user.getJwt();
    res.send({
        id: user._id,
        email : user.email,
        name:user.name,
        role: user.role,
        token: token,
        message: "Logged In successfully"
    })

}