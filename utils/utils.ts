export const getHeaders = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  if (userInfo && userInfo.access_token) {
    return { Authorization: `Bearer ${userInfo.access_token}` };
  }
  return {};
}
