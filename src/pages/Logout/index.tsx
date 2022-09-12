import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import useApi from '../../api/api'



const Logout = () => {

  const Api = useRef(useApi()).current
  const dispatch = useRef(useDispatch()).current

  useEffect(() => {
    const fn = async () => {
      dispatch({
        type: 'LOGOUT_USER',
        payload: {
          data: {}
        }
      })
      await Api.logout()
    }
    fn()
  }, [Api, dispatch])

  return (
    <Navigate to={'/login'} replace />
  )

}


export default Logout