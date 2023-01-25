import React, { useEffect, useState } from 'react'
import { doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { colRef, database } from '../Config'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'

export default function Admin() {


    // const [confirm, setConfirm] = useState(false);
    const [blogs, setBlogs] = useState([])
    const [post, setPost] = useState('')

    useEffect(() => {
        // setLoading(true)
        const fetchBlog = () => {
            const output = query(colRef, orderBy('createdTime', 'desc'))
            onSnapshot(output, (snapshot) => {
                let blog = [];
                snapshot.docs.forEach((doc) => {
                    blog.push({ ...doc.data(), id: doc.id })
                    setBlogs(blog)
                })
            })
        }
        fetchBlog();
    }, [])

    const updateHandler = (gameId) => {
        // console.log(gameId)
        try {
            // e.preventDefault()
            setPost({ status: 'Paid' })

            const docRef = doc(database, 'games', gameId)
            updateDoc(docRef, post).then(() => {
                // console.log('success')
                toast("You Paid User Successfully")
            })
        } catch (error) {
            console.log(error)
        }
    }

    // const DeleteHandler = (subId) => {
    //     const docRef = doc(database, 'games', subId)
    //     deleteDoc(docRef).then(() => {
    //         toast("deleted successful")
    //     }).catch((err) => console.log(err))
    // }


    // const confirmHandler = () => {
    //     setConfirm(true)
    // }

    return (
        <div className='table-responsive'>
            <div><ToastContainer /> </div>

            <div className='my-5'>
                <Link to='/admin/refer' className='btn btn-sm btn-dark'>Refers</Link>
            </div>
            {/* <div>
                {
                    confirm &&
                    <div className='confirmWrapper'>
                        <div className='confirm'>
                            <p className='text-center'>Are You Sure</p>
                            <button className='btn btn-dark btn-sm m-1 px-5'>Processed</button>
                            <button className='btn btn-danger btn-sm m-1 px-5' onClick={() => setConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                }
            </div> */}
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>AMOUNT</th>
                        <th>REWARD</th>
                        <th>WALLET</th>
                        <th>PROFIT</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        blogs.map(({ id, play, rewards, status, createdTime, useAddress }) => {
                            const date = createdTime.toDate().toDateString()
                            const isPlay = parseInt(play)
                            const isReward = rewards.substring(1, 5)
                            const rewarded = parseFloat(isReward)

                            const profit = rewarded * isPlay

                            // const ob = { rewarded, isPlay }
                            // const profit = Object.values(ob).reduce((acc, val) => acc * val, 0);
                            // console.log(profit)
                            return (
                                <>
                                    <tr key={id}>
                                        <td>{id}</td>
                                        <td>{date}</td>
                                        <td>{play}</td>
                                        <td>{rewards}</td>
                                        <td>{useAddress}</td>
                                        <td>{profit}</td>
                                        <td><button className='btn btn-sm btn-success w-100' disabled={status !== 'Not Paid'} onClick={() => updateHandler(id)}>{status || null}</button></td>
                                        {/* <td><button onClick={() => DeleteHandler(id)}>Delete</button></td> */}
                                    </tr>
                                </>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}