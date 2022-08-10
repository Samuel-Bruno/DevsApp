import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import useApi from '../../api/api'



const Logout = () => {

  const Api = useApi()
  const dispatch = useDispatch()

  useEffect(()=>{
    const fn = async () => {
      dispatch({
        type:'LOGOUT_USER',
        payload:{
          data:{}
        }
      })
      await Api.logout()
    }
    fn()
  },[])

  return (
    <Navigate to={'/login'} replace />
  )
  
}


export default Logout