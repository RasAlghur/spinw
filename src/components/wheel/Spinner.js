import React from 'react'
import Wheel from './Index';

function Spinner() {
  const coinGift = ['x0', 'x0.25', 'x0.5', 'x1', 'x1.25', 'x1.5', 'x1.75', 'x2'];

  return (
    <div className='mt-5'>
      <Wheel items={coinGift} />
    </div>

  )
}

export default Spinner;
