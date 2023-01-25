import React, { useState } from 'react'
import '../../styles/globals.css'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'
import { auth, database } from '../Config';


export default function Register() {
    const navigate = useNavigate()
    const [post, setPost] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const changeHandle = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value })
    }

    const submitHandle = (e) => {
        e.preventDefault()
        // console.log(post)
        try {
            const { email, password, name } = post
            createUserWithEmailAndPassword(auth, email, password)
                .then((res) => {
                    // console.log(res)
                    setDoc(doc(database, 'users', res.user.uid), {
                        name,
                        email,
                        // timeStamp: serverTimestamp(),
                    }).then(() => {
                        setSuccess('users created',)
                        setTimeout(() => navigate('/login'), 2000)
                    }).catch((err) => setError(err.message))
                }).catch(err => console.log("create ", err.message))


        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className='logRegWrapper'>

            <form onSubmit={submitHandle} className='logReg'>

                {
                    error ? (<p className='text-center text-danger'>{error}</p>) :
                        (<p className='text-success text-center'>{success}</p>)
                }

                <div className='form-group m-1'>
                    <input type="text" name="name" id="name" placeholder='Enter name' className='form-control' onChange={changeHandle} />
                </div>

                <div className='form-group m-1'>
                    <input type="email" name="email" id="email" placeholder='Enter email address' className='form-control' onChange={changeHandle} />
                </div>

                <div className='form-group m-1'>
                    <input type="password" name="password" id="password" placeholder='Enter password' className='form-control' onChange={changeHandle} />
                </div>

                <div className='form-group m-1'>
                    <input type="submit" value="Register" id="submit" className='btn btn-sm btn-dark w-100' />
                </div>

            </form>
        </div>
    )
}