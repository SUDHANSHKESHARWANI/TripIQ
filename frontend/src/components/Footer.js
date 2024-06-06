import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEnvelope} from "@fortawesome/free-solid-svg-icons"
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
  return (
    <div className="relative max-w-5xl mx-auto pt-10 sm:pt-24 lg:pt-32">
        <div className="text-center text-4xl text-orange-500  font-bold dark:text-sky-500">
            Happy Planning!
        </div>
        <div className="mt-4 text-center">
            <a href="mailto:skeshu28@gmail.com" className="p-4" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faEnvelope} className="text-5xl pt-6 dark:text-white" />
            </a>
            <a href="https://www.instagram.com/sudhansh_k?igsh=enNtZzQ2MHVuOW1l" className="p-4" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="text-5xl pt-6 dark:text-white" />
            </a>
            <a href="https://www.linkedin.com/in/sudhansh-kesharwani?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="p-4" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="text-5xl pt-6 dark:text-white" />
            </a>
        </div>
    </div>
  )
}

export default Footer
