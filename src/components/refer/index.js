import React, { useEffect, useState } from 'react'
import { useAddress } from '@thirdweb-dev/react'
import {
    FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon,
    TelegramShareButton, TelegramIcon, TwitterShareButton, TwitterIcon
} from 'react-share'
import History from './history'
import { colShort, database } from '../Config'
import { collection, doc, where, onSnapshot, query, serverTimestamp, setDoc } from 'firebase/firestore';


export default function Refer() {
    const address = useAddress()
    const [data, setData] = useState(null)
    const wallet = address || null
    useEffect(() => {
        if (address) {
            (() => {
                const output = query(colShort, where('address', '==', wallet))
                onSnapshot(output, (snapshot) => {
                    if (!snapshot.empty) {
                        let blog = [];
                        snapshot.docs.forEach((doc) => {
                            blog.push({ ...doc.data(), id: doc.id })
                            setData(blog[0].id)
                            // navigate('/dashboard')
                        })
                    } else {
                        const post = {
                            address,
                            createdTime: serverTimestamp(),

                        }

                        const uuid = () => {
                            const values = '134qws423wd4356w32ss456w3d345e345de563454ev67rg867r6';
                            let token = '';
                            for (var i = 0; i < 6; i++) {
                                token += values[Math.floor(Math.random() * values.length)]
                            };
                            return token;
                        }

                        try {
                            const colRef = collection(database, 'shorts')
                            setDoc(doc(colRef, uuid()), post).then(() => {
                                // navigate('/dashboard')
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

            })()
        }
    }, [address, setData, wallet])

    const shareUrl = `https://www.app.flokispin.com/${data}`;
    console.log(shareUrl)

    if (!address) {
        return <p>Connect Wallet to see your referrer</p>
    }

    return (
        <>
            <div className='mt-2'>
                <p>Refer Someone Today</p>
                <FacebookShareButton url={shareUrl} className='me-2'>
                    <FacebookIcon size={20} />
                </FacebookShareButton>
                {/* round = { true} */}

                <WhatsappShareButton url={shareUrl}>
                    <WhatsappIcon size={20} />
                </WhatsappShareButton>

                <TelegramShareButton url={shareUrl} className='ms-2'>
                    <TelegramIcon size={20} />
                </TelegramShareButton>

                <TwitterShareButton url={shareUrl} className='ms-2'>
                    <TwitterIcon size={20} />
                </TwitterShareButton>
            </div>

            <div className='mt-3'>
                <History />
            </div>
        </>
    )
}
