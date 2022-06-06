export default ({ route, store, redirect }) => {
  const loginPath = '/auth/login';
  const { user } = store.state.auth;
  const includesLogin = route.path.includes(loginPath);
  if (!user && !includesLogin) {
    return redirect({ path: loginPath, query: { from: route.fullPath } });
  } else if (user && includesLogin) {
    return redirect('/profile');
  }
};
