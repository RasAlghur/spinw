import React, { useEffect } from 'react'
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import '../../styles/globals.css'
import { useNavigate, useParams } from 'react-router-dom'
import { collection, doc, where, onSnapshot, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { colRefRefer, database } from '../Config'

export default function ReferBonus() {
    const navigate = useNavigate();
    const { wallet } = useParams()
    const address = useAddress();


    // check if the address already save on the database
    useEffect(() => {
        if (address && address !== wallet) {
            const fetchBlog = () => {
                const output = query(colRefRefer, where('referee', '==', address))
                onSnapshot(output, (snapshot) => {
                    if (!snapshot.empty) {
                        let blog = [];
                        snapshot.docs.forEach((doc) => {
                            blog.push({ ...doc.data(), id: doc.id })
                            console.log(blog)
                            navigate('/dashboard')
                        })
                    } else {
                        const post = {
                            refer: wallet,
                            referee: address,
                            status: 'Pending',
                            play: '',
                            // reward: '',
                            paid: 'Not Paid',
                            createdTime: serverTimestamp(),

                        }

                        const uuid = () => {
                            const values = 'fgXDRTDcfgFTdFGHfdRTDfxcfghHFtGVHJKGYUcdrtdulBHjvcFufyYUhvgHJTJH';
                            let token = '';
                            for (var i = 0; i < 6; i++) {
                                token += values[Math.floor(Math.random() * values.length)]
                            };
                            return token;
                        }

                        try {
                            const colRef = collection(database, 'refers')
                            setDoc(doc(colRef, uuid()), post).then(() => {
                                navigate('/play')
                                console.log('data save')
                                return;
                            }).catch(error => {
                                console.log(error.data)
                            })
                        } catch (error) {
                            console.log(error.data)
                        }
                    }
                })
            }
            fetchBlog();
        }

    }, [address, navigate, wallet])

    return (
        <div className='referWrapper'>
            <div className='refer'>
                <div className='referB'>
                    <ConnectWallet />
                </div>
            </div>
        </div>
    )
}