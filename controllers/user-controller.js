const { User, Thought } = require("../models");

const userController = {
  getAllUsers(req, res) {
    User.find({})
      // .populate({
      //   path: "homies",
      //   select: "-__v",
      // })
      // .select("-__v")
      .sort({ _id: -1 })
      // .exec()
      .then((dbUserData) => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(400).send("could not find user with that id ");
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "homies",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "She's gone lad, no user found with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res
            .status(404)
            .json({ message: "She's gone lad, no user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Jinkies! No user with this id!" });
        }
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({
          message: "Jinkies User and associated thoughts deleted!",
        });
      })
      .catch((err) => res.json(err));
  },

  addHomie({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { homies: params.homieId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Jinkies! No user with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  removeHomie({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { homies: params.homieId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Jinkies! No user with this id!" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};
module.exports = userController;
