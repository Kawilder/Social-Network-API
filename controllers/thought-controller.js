const { Thought } = require('../models');
const { User } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
    .sort({ _id: -1 })
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
    console.log(err);
    res.status(400).json(err);
    });
  },

  getThoughtById({ params }, res) {
    Thought.findOne({_id: params.id})
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
    console.log(err);
    res.status(400).json(err);
    });
  },

  addNewThought({ params, body}, res) {
    Thought.create (body)
    .then(({ thoughtText }) => {
      return User.findOneAndUpdate(
        { _id: body.userId},
        { $push: { thoughts: thoughtText } },
        { new: true, runValidators: true }
      );
    })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No user with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  updateThought({ params, body}, res) {
    Thought.findOneAndUpdate({ _id: params.id}, 
    body, 
    {new: true, runValidators: true })
        
    .then(dbThoughtData => {
    if (!dbThoughtData) {
    res.status(404).json({ message: 'No thought with this id!' });
    return;
    }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

    addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  removeReaction({ params }, res) {
  Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $pull: { reactions: { reactionId: params.reactionId } } },
    { new: true }
  )
    .then(dbPizzaData => res.json(dbPizzaData))
    .catch(err => res.json(err));
  }
    
}

module.exports = thoughtController;