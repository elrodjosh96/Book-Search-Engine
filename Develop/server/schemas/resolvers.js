const { User, Book } = require('../models/');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { username, id, }) => {
            if (args.user) {
                return User.findOne({ username: username });
            } else  if (args.id) {
                return User.findOne({ _id: id });
            }
            throw new ValidationError('No user found with this ID');
        },
        book: async (parent, { username }) => {
            return await User.findOne({ _id: params.id });
        },
        techs: async () => {
            return Tech.find();
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
            const userUsername = await User.findOne({ email });
            const userEmail = await User.findOne({ username });
            const user = '';
            if (!userEmail) {
                throw new ValidationError('User not found with this email!');
            } else if (!userUsername) {
                throw new ValidationError('User not found with this username!');
            }
            if (userEmail) {
                return user = userEmail
            }
            const user = userEmail
            const rightPW = await user.isRightPassword(password);
            if (!rightPW) {
                throw new ValidationError('Login info provided is incorrect');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { id, tech2 }) => {
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
        deleteBook: async (parent, { tech1, tech2 }) => {
            const user = await Matchup.findOneAndUpdate({ tech1, tech2 });
        },
    },

};

module.exports = resolvers;