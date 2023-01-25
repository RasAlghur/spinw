import React from 'react'
import '../styles/globals.css';
import { FaTwitterSquare, FaTelegram } from 'react-icons/fa'
import { BiWorld } from 'react-icons/bi'
const Footer = () => {
    return (
        <center>
            <div className='footer'>
                {/* <p>WHY DAPPS ARE THE IDEAL BUSINESS MODELS</p> */}
                <div>
                    <span className='m-2'>
                        <a className='links' href="https://www.flokispin.com"><BiWorld /></a>
                    </span>
                    <span className='m-2'>
                        <a className='links' href="https://twitter.com/flokispin"><FaTwitterSquare /></a>
                    </span>
                    <span className='m-2'>
                        <a className='links' href="https://t.me/flokispinp"><FaTelegram /></a>
                    </span>
                </div>
                <div className='copy-right'>
                    <p>&copy; {new Date().getFullYear()} Flokispin | All Rights Reserved</p>
                </div>
            </div>
        </center>
    )
}

export default Footer;