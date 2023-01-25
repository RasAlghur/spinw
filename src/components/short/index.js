import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { database } from '../Config'
import '../../styles/globals.css'

export default function Short() {
    const navigation = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const fetchBlog = () => {
            const output = doc(database, 'shorts', id)
            onSnapshot(output, (doc) => {
                if (doc.data()) {
                    // console.log(doc.data(), doc.id)
                    const { address } = doc.data()
                    console.log(address)
                    navigation(`/refer/${address}`)
                    return;
                }
                return navigation('*')
                // http://localhost:3000/4e7r25
            })
        }
        fetchBlog()
    }, [id, navigation])

    return (
        <div className='spinnerWrapper'>
            <div className="lds-hourglass"></div>
            {/* <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div> */}
        </div>
    )
}

