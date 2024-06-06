import React, { useContext } from 'react';
import './Description.css';
import { Link } from 'react-router-dom';
import mainLogo from '../images/mainLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { DarkModeContext } from './DarkModeContext';

const Description = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center w-full">
    <Link to="/" className="mr-auto md:mr-0"><img src={mainLogo} alt="TripIQ" className="w-50 h-20"/></Link>
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center h-8 w-20 rounded-full p-1 mr-10 mt-8 md:mt-0 transition-colors duration-300 focus:outline-none ${
        isDarkMode ? 'bg-gray-800' : 'bg-yellow-500'
      }`}
    >
      <span className="sr-only">Toggle dark mode</span>
      <div
        className={`absolute left-1 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 transform ${
          isDarkMode ? 'translate-x-10 bg-gray-900' : 'translate-x-0 bg-white'
        }`}
      >
        {isDarkMode ? (
          <FontAwesomeIcon icon={faMoon} className="text-yellow-500" />
        ) : (
          <FontAwesomeIcon icon={faSun} className="text-gray-800" />
        )}
      </div>
    </button>
    
  </div>

  );
};

export default Description;
