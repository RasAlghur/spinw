import React from 'react'
import { BiWalletAlt } from 'react-icons/bi'
import { FaPlay, FaPoll } from 'react-icons/fa'
import { Link } from 'react-router-dom'
// FaCreativeCommonsNd,

const Details = ({ priceInUSD, FlokiSpin, FlokiSpinInBNB, FlokiSpinInUSD, BnbBalanceInUsd, tokenPrice }) => {


  return (
    <div className='mt-5'>
      <div className='row'>
        <div className='col'>
          <div className='dash'>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard, here you can see your token balance and your recent spin history</p>
          </div>
        </div>
        <div className='col'>
          <div className='row row-cols-md-2 row-cols-sm-1 row-cols-1'>
            <div className='col'>
              <div className='tokenBalance'>
                <h5>{priceInUSD}</h5>
                <p>Bnb Price</p>
              </div>
            </div>
            <div className='col'>
              <div className='tokenBalance'>
                <h5>{tokenPrice}</h5>
                <p>Token Price</p>
              </div>
            </div>
            <div className='col w-100'>
              <div className='row row-cols-lg-3 row-cols-md-2 row-cols-sm-1 row-cols-1'>
                <div className='col'>
                  <div className='m-2'>
                    <a href='https://pancakeswap.finance/swap?outputCurrency=0x2C00B293c7DA6c24f232D7415282bBb88BC62541&inputCurrency=BNB' className='btn-da m-1'> Buy Token</a>
                  </div>
                </div>

                <div className='col'>
                  <div className='m-2'>
                    <Link to='/play' className='btn-dan m-1'> Play Spin <span className='iconPlay'> <FaPlay size={10} /></span> </Link>
                  </div>
                </div>

                {/* <div className='col'>
                  <div className='m-2'>
                    <Link to='/refer' className='btn-dan m-1'> Refer </Link>
                  </div>
                </div> */}

              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <main>

        <div className='row row-cols-md-3 row-cols-sm-2 row-cols-1 balance'>
          <div className='col'>
            <div className='m-2'>
              <h6> My $FKS Token Balance</h6>
              <div className='dashWrapper'>
                <div className='dashInnerWrapper'>
                  <div className='dashIcons'><span><BiWalletAlt size={25} /></span></div>
                  <div className='dashText'>
                    <h6>{FlokiSpin}</h6>
                    <p> {`USD Value ${FlokiSpinInUSD}`}</p>
                    <p>{`BNB Value ${FlokiSpinInBNB}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className='col'>
            <div className='m-2'>
              <h6>My BNB Balance</h6>
              <div className='dashWrapper'>
                <div className='dashInnerWrapper'>
                  <div className='dashIcons'><span><BiWalletAlt size={25} /></span></div>
                  <div className='dashText'>
                    <h6>{BnbBalance}</h6>
                    <p>USD Value {BnbBalanceInUsd}</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className='col'>
            <div className='m-2'>
              <h6>Profit from Spin Game</h6>
              <div className='dashWrapper'>
                <div className='dashInnerWrapper'>
                  <div className='dashIcons'><span><FaPoll size={25} /></span></div>
                  <div className='dashText'>
                    <h6>Coming soon!</h6>
                    <p>Total Profit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Details