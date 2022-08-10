import { UserData } from "../../api/loginRes";

export type UserStateType = {
  isLogged: boolean,
  data: UserData
}

export type ActionsType = {
  type: string;
  payload: {
    isLogged:boolean;
    data?:{};
    userData?:UserData;
  } | any;
}