import React from 'react'
// import Login from './Auth/Login'
// import { createBrowserHistory } from "history";


function Home() {
  // let history = createBroawserHistory();
  // let location = history.location;
  // console.log(location)
  // history.replace("/logged-in")
  return (
    <div className='mt-5'>
      {/* <div><Login/></div> */}
      <center>
        <div className='home'>
          <div className='row row-cols-md-3 row-cols-sm-2 row-cols-1'>
            <div className='col'>
              <div className='wrapper'>
                <h6>We are Introduction Flokispin ($FKS)</h6>
                <a href='https://medium.com/@flokispin/we-are-introducing-flokispin-fks-98586d80a658'> Introduction</a>
              </div>
            </div>

            <div className='col'>
              <div className='wrapper'>
                <h6>How to Play Flokispin and Earn $FKS Tokens</h6>
                <a href='https://medium.com/@flokispin/how-to-play-flokispin-and-earn-fks-tokens-77eb4fe3521e'> How to Buy</a>
                {/* <h5>{SpinVaultBalance}</h5> */}
                {/* <p>USD Value: {SpinVaultBalanceInUSD}</p> */}
                {/* <p>BNB Value: {SpinVaultBalanceInBNB}</p> */}
              </div>
            </div>

            <div className='col'>
              <div className='wrapper'>
                <h6>Roadmap</h6>
                <a href='https://flokispin.com/#roadmap'>Roadmap</a>
                {/* <h5>{DailyVaultBalance}</h5> */}
                {/* <p>USD Value: {DailyVaultBalanceInUSD}</p> */}
                {/* <p>BNB Value: {DailyVaultBalanceInBNB}</p> */}
              </div>
            </div>
          </div>
        </div>
      </center>
      {/* <div><Login/></div> */}
    </div>
  )
}

export default Home