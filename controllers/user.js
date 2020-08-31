const Deck = require("../models/Deck");
const User = require("../models/User");

const Joi = require("@hapi/joi")
Joi.objectId = require('joi-objectid')(Joi)
 
const idSchema = Joi.object().keys({
    userID: Joi.objectId().required(),
})

const getUser = async (req, res, next) => {
  const isValid = idSchema.validate(req.params)
  

  const { userID } = req.params;

  const user = await User.findById(userID);

  return res.status(200).json({ user });
};

const getUserDecks = async (req, res, next) => {
    const { userID } = req.params
    const user = await User.findById(userID).populate('decks');
    return res.status(200).json({ decks: user.decks });
};

const index = async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({ users });
};

const newUser = async (req, res, next) => {
  const newUser = new User(req.body);
  await newUser.save();

  return res.status(201).json({ user: newUser });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.params;
  const owner = await User.findById(userID);
  const newDecks = await new Deck({ ...req.body, owner: owner }).save();
  owner.decks.push(newDecks._id);
  await owner.save();
  return res.status(201).json({
    deck: newDecks
  });
};

const replaceUser = async (req, res, next) => {
  // enforce new user to old user
  const { userID } = req.params;

  const newUser = req.body;

  const result = await User.findByIdAndUpdate(userID, newUser);

  return res.status(200).json({ success: true });
};

const updateUser = async (req, res, next) => {
  // number of fields
  const { userID } = req.params;

  const newUser = req.body;

  const result = await User.findByIdAndUpdate(userID, newUser);

  return res.status(200).json({ success: true });
};

module.exports = {
  getUser,
  getUserDecks,
  getListUsers: index,
  newUser,
  newUserDeck,
  replaceUser,
  updateUser
};
