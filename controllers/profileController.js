const _ = require('lodash');
const { Profile, validateProfile } = require('../models/Profile')
const formidable = require('formidable');
const fs = require('fs');

module.exports.addProfile = async (req, res) => {
    const existingProfile = await Profile.findOne({ userId: req.user.id })
    if (existingProfile) return res.status(200).send('profile already created')
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send('something Wrong');
        const { error } = validateProfile(_.pick(fields, ['firstName', 'lastName', 'email', 'phone', 'country', 'address', 'city', 'postCode']));



        if (error) return res.status(400).send(error.details[0].message);
        const profile = new Profile({
            firstName: fields.firstName,
            lastName: fields.lastName,
            email: fields.email,
            phone: fields.phone,
            country: fields.country,
            address: fields.address,
            city: fields.city,
            postCode: fields.postCode,
            userId: req.user.id
        });
        if (files.photo) {
            fs.readFile(files.photo.path, (err, data) => {
                if (err) return res.status(400).send("problem with image upload")
                profile.photo.data = data,
                    profile.photo.contentType = files.photo.type
                profile.save((err, result) => {
                    if (err) return res.status(500).send(err)
                    else return res.status(201).send("Profile created Successfully")
                })
            })
        }
    })
}
module.exports.getProfile = async (req, res) => {
    const userId = req.user.id
    const userProfile = await Profile.findOne({ userId : userId,}).select({photo : 0})
    return res.status(200).send(userProfile)
}

module.exports.getPhoto = async(req, res)=>{
    const userId = req.params.id;
    const userPhoto = await Profile.findById({_id : userId}).select({photo : 1, _id : 0});
    res.set('content-type', userPhoto.photo.contentType);
    return res.status(200).send(userPhoto.photo.data)
}
