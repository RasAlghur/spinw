import React, { useEffect, useState } from 'react'
import { doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore'
import { colRefRefer, database } from '../Config'
import { toast, ToastContainer } from 'react-toastify'

export default function AdminRefer() {


    // const [confirm, setConfirm] = useState(false);
    const [blogs, setBlogs] = useState([])
    const [post, setPost] = useState('')

    useEffect(() => {
        // setLoading(true)
        const fetchBlog = () => {
            const output = query(colRefRefer, orderBy('createdTime', 'desc'))
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
            setPost({ paid: 'Paid' })

            const docRef = doc(database, 'refers', gameId)
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
                        <th>DATE</th>
                        <th>PROFIT</th>
                        <th>WALLET</th>
                        <th>STATUS</th>
                        <th>PAID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        blogs.map(({ id, paid, play, status, createdTime, refer }) => {
                            const date = createdTime.toDate().toDateString()
                            const isPlay = parseInt(play)
                            // const isReward = reward.substring(1, 5)
                            // const rewarded = parseFloat(isReward);
                            const profit = isPlay / 10;


                            return (
                                <tr key={id}>
                                    <td>{date || null}</td>
                                    <td>{profit || null} $FKS</td>
                                    <td>{refer || null}</td>
                                    <td>{status || null}</td>
                                    <td>{paid || null}</td>
                                    <td><button className='btn btn-sm btn-success w-100' disabled={status !== 'Active'} onClick={() => updateHandler(id)}>{status || null}</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}