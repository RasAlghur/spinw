import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const userAuth = () => {
    // let userDetails = JSON.parse(sessionStorage.getItem('token'));
    let userDetails = sessionStorage.getItem('token')
    return userDetails
}

const Protected = () => {
    const isAuth = userAuth()
    return isAuth ? <Outlet /> : <Navigate to='/login' />
}

export default Protected;