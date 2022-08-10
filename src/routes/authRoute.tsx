import React from 'react'
import { useStore } from 'react-redux';
import { Navigate, Route, useLocation } from 'react-router-dom'
import useApi from '../api/api';
import getStateProperty from '../redux/getStateProperty';

type Props = {
  children: JSX.Element
}


const AuthRoute = ({ children }: Props) => {

  const store = useStore()
  const location = useLocation()

  const Api = useApi()
  const savedToken = Api.getSavedToken()

  let userState = getStateProperty(store, 'user')

  return (userState.isLogged === true || savedToken !== null) ? (
    children
  ) : (
    <Navigate to={'/login'} state={{ from: location }} replace />
  )
  
}


export default AuthRoute