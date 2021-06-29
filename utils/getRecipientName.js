const getRecipientName = (users, userLoggedIn) =>
  users?.filter((userToFilter) => userToFilter !== userLoggedIn?.name)[1];

export default getRecipientName;
