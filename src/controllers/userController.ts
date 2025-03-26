import User from '../models/User.js';
import { Request, Response } from 'express';

  export const getUsers = async(_req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  export const getSingleUser = async(req: Request, res: Response) => {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
         res.status(404).json({ message: 'No user with that ID' });
      } else {
        res.json(user);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // create a new user
  export const createUser = async(req: Request, res: Response) => {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // update a user
  export const updateUser = async(req: Request, res: Response) => {
    try {
      const dbUserData = await User.findByIdAndUpdate(
        req.params.userId,  // The user's _id
        { 
          username: req.body.username,  // New username
          email: req.body.email,      // New email
        },
        { 
          new: true,             // This option ensures that the updated document is returned (instead of the original)
          runValidators: true    // This ensures that validation rules (like required fields) are run during the update
        }
      );
      res.json(dbUserData);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // delete a user
  export const deleteUser = async(req: Request, res: Response) => {
    try {
      const dbUserData = await User.findByIdAndDelete(req.params.userId);
      res.json(dbUserData);
      return;
    } catch (err) {
      res.status(500).json(err);
      return
    }
  }

  // add a friend
  export const addFriend = async(req: Request, res: Response) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(user);
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }

  // remove a friend
  export const removeFriend = async(req: Request, res: Response) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with this id!' });
      }
      
      res.json(user);
      return;
    } catch (err) {
      res.status(500).json(err);
      return;
    }
  }
