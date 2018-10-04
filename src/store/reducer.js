const defaultState = {
  login:false,
  wallet:null
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case "set_wallet":
      return{
        ...state,
        wallet : action.wallet
      };
    case "set_walletData":
      return{
        ...state,
        walletData : action.walletData
      };
    case "login":
      return {
        ...state,
        login: true
      }
    default:
      return state;
  }
  // const newState = JSON.parse(JSON.stringify(state));
  // if(action.type === 'change_answer'){
  //   newState.answer = !state.answer;
  // }
  // return newState;
}
