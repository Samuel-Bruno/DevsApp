import { UserData } from "../../types/api/loginRes";
import { ActionsType, UserStateType } from "../../types/reducers/userReducer";

const initialState: UserStateType = {
  isLogged: false,
  data: {
    avatar: '',
    email: '',
    id: '',
    name: '',
    photoUrl: '',
    token: '',
    chats: []
  }
}


const userReducer = (state: UserStateType = initialState, action: ActionsType) => {


  switch (action.type) {
    case 'SET_LOGGED':
      return (action.payload.isLogged === true) ? 
      {
        ...state,
        isLogged: action.payload.isLogged as boolean,
        data: action.payload.userData as UserData
      } : { 
        ...state,
        isLogged: action.payload.isLogged as boolean
      }
      break
    case 'LOGOUT_USER':
      return { ...state, isLogged: false, data: initialState.data }
      break;
    case 'UPDATE_USER_INFO':
      return {
        ...state,
        data: action.payload.userData as UserData
      }
      break;
    default:
      return state
      break
  }

}


export default userReducer