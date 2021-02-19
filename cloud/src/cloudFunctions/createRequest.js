import { hasActiveGame } from '../user';

const Request = Parse.Object.extend('Request');
const User = Parse.Object.extend('_User');

Parse.Cloud.define(
  'createRequest',
  async ({ params: { to }, user }) => {
    if (await hasActiveGame(user)) {
      throw new Error('You have an active game!');
    }
    const user2 = new User();
    user2.id = to;
    return (
      await new Request().save({ user1: user, user2 }, { useMasterKey: true })
    ).id;
  },
  {
    fields: {
      to: {
        required: true,
      },
    },
    requireUser: true,
  },
);
