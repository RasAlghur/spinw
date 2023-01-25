import { useAddress, useChainId } from '@thirdweb-dev/react'
import { onSnapshot, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { colRefRefer } from '../Config'
import { FaSearch } from 'react-icons/fa'



const History = () => {
    const [data, setData] = useState([])
    const [value, setValue] = useState('')

    const userAddress = useAddress()
    const chainId = useChainId()
    const address = userAddress || null;

    useEffect(() => {
        const fetchBlog = () => {
            const output = query(colRefRefer, where('refer', '==', address), orderBy('createdTime', 'desc'))
            onSnapshot(output, (snapshot) => {
                if (!snapshot.empty) {
                    let blog = [];
                    snapshot.docs.forEach((doc) => {
                        blog.push({ ...doc.data(), id: doc.id })
                        // console.log(blog)
                        setData(blog)
                    })
                } else {
                    setData([])
                }
            })
        }
        fetchBlog();
    }, [address])

    if (!userAddress) {
        return (
            <div className='mt-5'>
                <p className='text-center text-danger'>Please connect your wallet to see your refer history</p>
            </div>
        )
    }


    if (chainId !== 56) {
        return (
            <div className='mt-5'>
                <p className='text-center text-danger'>Please change your Network to BSC mainnet to see your dashboard info</p>
            </div>
        )
    }



    const searchHandler = () => {
        const { search } = value
        // console.log(search)

        const result = data.filter(character => character.status === search);
        if (result.length > 0) {
            return setData(result)
        }

        return setData([])
    }

    return (
        <div>
            <div className='filter_row'>
                <div className='filter_col_1'>
                    <h6>Referrals History</h6>
                </div>

                <div className='filter_col_2'>
                    <input type='search' name='search' id='search' placeholder='Filters'
                        onChange={(e) => setValue({ ...value, [e.target.name]: e.target.value })} />
                    <button type="submit" id='submit' onClick={searchHandler}> <FaSearch size={12} /> </button>
                </div>
            </div>

            {
                data.length !== 0 ? (
                    <div className='table-responsive mt-3'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>DATE</th>
                                    <th>PROFIT</th>
                                    <th>STATUS</th>
                                    <th>PAID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map(({ id, paid, play, status, createdTime }) => {
                                        const date = createdTime.toDate().toDateString()
                                        const isPlay = parseInt(play)
                                        // const isReward = reward.substring(1, 5)
                                        // const rewarded = parseFloat(isReward);
                                        const profit = isPlay / 10;


                                        return (
                                            <tr key={id}>
                                                <td>{date || null}</td>
                                                <td>{profit ? `${profit}$FKS` : 0}</td>
                                                <td>{status || null}</td>
                                                <td>{paid || null}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='mt-5 text-center'>
                        <p className='text-center text-danger'>Refer Someone today!</p>
                        <button className='btn btn-dark btn-sm shadow-none' onClick={() => window.location.reload(true)}>Reload</button>
                    </div>
                )
            }

        </div>

    )
}

export default History;