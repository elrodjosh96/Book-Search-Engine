const { AuthenticationError, ValidationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { username, id, }) => {
            if (username) {
                return User.findOne({ username: username }).populate('savedBooks');
            } else if (id) {
                return User.findOne({ _id: id }).populate('savedBooks');
            }
            throw new ValidationError('No user found with this ID');
            // },
            // book: async (parent, { username }) => {
            //     return await User.findOne({ _id: params.id });
            // },
            // techs: async () => {
            //     return Tech.find();
            // }
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            if (!user) {
                throw new ValidationError('ERROR!');
            }
            return { token, user };
        },
        login: async (parent, { username, email, password }) => {
            //come back to this OR
            const user = await User.findOne({ email } || { username });
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            };
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Wrong Password!');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: id },
                    {
                        $addToSet: {
                            books: [{ bookId }],
                        },
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
            }
            throw new ValidationError('Must be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $pull: { savedBooks: bookId }
                    });
            }
        }
    },
}

module.exports = resolvers;