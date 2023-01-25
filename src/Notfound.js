import React from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <center className='mt-5'>
      <h1>Page not found</h1>
      <Link to="/" className='btn btn-dark btn-sm mt-3'>Go home</Link>
    </center>
  )
}

export default Notfound