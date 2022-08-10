import { Store } from "redux";

const getStateProperty = (store:Store, propertyName:string) => 
  store.getState()[propertyName]


export default getStateProperty