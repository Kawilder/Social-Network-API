const { User } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find({})
    .populate('friends')
    .sort({ _id: -1 })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  getUserById({ params }, res,) {
    User.findOne({_id: params.id})
    .populate("friends")
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
    },

  CreateUser({body}, res) {
    User.create(body)
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(400).json(err));
  },

  updateUser({ params, body}, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No User with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No User with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  },

  addFriend({params}, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  unFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  }

}

module.exports = userController;