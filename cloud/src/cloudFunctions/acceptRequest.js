import { getRequest } from '../request';
import { hasActiveGame } from '../user';
import { createGame } from './createGame';
import { joinGame } from './joinGame';

Parse.Cloud.define(
  'acceptRequest',
  async ({ params: { requestId }, user }) => {
    const request = await getRequest(requestId);
    if (request.get('user2').id !== user.id) {
      throw new Error("You don't have permission!");
    }
    if (await hasActiveGame(user)) {
      throw new Error('You have an active game!');
    }
    if (await hasActiveGame(request.get('user1'))) {
      throw new Error('He has an active game!');
    }

    const gameId = await createGame({ user: request.get('user1') });
    await joinGame({ params: { gameId }, user: request.get('user2') });

    await request.destroy({
      useMasterKey: true,
    });

    return gameId;
  },
  {
    fields: {
      requestId: {
        required: true,
      },
    },
    requireUser: true,
  },
);
