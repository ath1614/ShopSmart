import useAuthStore from '../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null });
  });

  it('sets auth correctly', () => {
    const user = { id: '1', email: 'test@test.com', role: 'SHOPPER' };
    useAuthStore.getState().setAuth(user, 'token123');
    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().token).toBe('token123');
  });

  it('clears auth on logout', () => {
    useAuthStore.getState().setAuth({ id: '1' }, 'token123');
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
