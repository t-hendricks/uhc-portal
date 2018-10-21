const initialState = {
  token: 'Fetching authorization token',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_AUTHORIZATION_TOKEN':
      return { ...state, token: action.payload.data };
    case 'FETCH_AUTHORIZATION_TOKEN_FULFILLED':
      return { ...state, token: action.payload.data };
    case 'FETCH_AUTHORIZATION_TOKEN_REJECTED':
      return { ...state, token: 'Failed to obtain authorization token. Please refresh.' };
    default:
      return state;
  }
};

export default reducer;
