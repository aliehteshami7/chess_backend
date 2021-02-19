export const getRequest = async (requestId) => {
  const query = new Parse.Query('Request');
  query.equalTo('objectId', requestId);
  return await query.first({ useMasterKey: true });
};
