import React, { useState, useRef, useEffect, useContext } from 'react'
import './InputPage.css'
import { useDispatch } from 'react-redux'
import {setInputData} from "../features/input/inputSlice"
import {useNavigate} from "react-router-dom"
import { DarkModeContext } from './DarkModeContext';

const apiKey = process.env.REACT_APP_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';

function loadAsyncScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      defer: true,
      src
    });
    script.addEventListener("load", () => resolve(script));
    script.addEventListener("error", () => reject(new Error(`Failed to load script: ${src}`)));
    document.head.appendChild(script);
  });
}

const extractAddress = (place) => {

  const address = {
    city: "",
    state: "",    
    country: "",
    latitude: null,   // Added latitude
    longitude: null,  // Added longitude
    plain() {
      const city = this.city ? this.city + ", " : "";      
      const state = this.state ? this.state + ", " : "";
      return city + state + this.country;
    }
  }
  console.log(place?.geometry)
  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach(component => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes("locality")) {
      address.city = value;
    }

    if (types.includes("administrative_area_level_2")) {
      address.state = value;
    }

    if (types.includes("country")) {
      address.country = value;
    }

  });

  if (place.geometry) {
    address.latitude=place.geometry.location.lat();
    address.longitude=place.geometry.location.lng();
  }
  return address;
}


const InputPage = () => {

  const [input,setInput]=useState({
    city:"",
    nod:0,
    groupType:"",
    latitude: null,   // Added latitude
    longitude: null,   // Added longitude
    country:""
  })   
  console.log(input)
  const dispatch = useDispatch()
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);
  const [showWarning, setShowWarning] = useState(false);

  
  // init gmap script
  const initMapScript = () => {
    // if script already loaded
    if(window.google) {
      return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }

  // do something on address change
  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();   
    // const geometry=autocomplete.getGeometry();
    console.log(place) 
    // console.log(geometry)
    const extractedAddress=extractAddress(place)  
    console.log(extractedAddress)   
    setInput((inputData)=>({
      ...inputData,
      city:extractedAddress.city,
      latitude: extractedAddress.latitude,   // Set latitude
      longitude: extractedAddress.longitude,  // Set longitude
      country:extractedAddress.country
    })
  )}

  const handleOptionClick = (option) => {
    setInput((inputData)=>({
      ...inputData,
      groupType:option
    })   
  )};
    
  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return; 

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current);
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete));

    //make city null if it is cleared
    searchInput.current.addEventListener("input",(event)=>{
      if(event.target.value===""){
        setInput((inputData)=>({
          ...inputData,
          city:"",
          latitude:null,
          longitude:null,
          country:""
        }))
      }
    })

  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((inputData) => ({
      ...inputData,
      [name]: value
    }));
  };
  

  const handleSubmit = () => {
    if (!input.city || !input.nod || !input.groupType) {
      // If any of the required fields are empty, show the warning
      setShowWarning(true);
    } else {
      // If all required fields are filled, dispatch the data and navigate
      setShowWarning(false); // Hide the warning if it's currently shown
      dispatch(setInputData(input));
      navigate("/itinerary");
    }
  };
  // load map script after mounted
  useEffect(() => {
    initMapScript().then(() => initAutocomplete()).catch((error) => console.error(error));
  }, []);

  // const handleDisable = () =>{
  //   return !(input.city != "" && input.nod != 0 && input.groupType != "")
  // }
  // console.log(!(input.city != "" && input.nod != 0 && input.groupType != ""))

  return (
    <div className={`px-10 sm:px-4 mt-5 ${isDarkMode ? 'dark' : ''}`}>
      <h5 className="text-4xl font-bold dark:text-slate-300">Tell us your travel preferences</h5>
        <p className="pt-3 text-slate-500 dark:text-slate-300">Please provide us with some basic information and we will design a customize trip itinerary based on your preferences!</p>
        <div className="InputSection pt-8">        
          <p className="text-xl font-semibold mt-8 dark:text-slate-300">What is destination of choice?</p>        
          <input ref={searchInput} type="text" placeholder="Search location...." className={`mt-2 p-2 border hover:shadow-lg focus:outline-none focus:border-blue-500 rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:shadow-md hover:shadow-gray-700' : 'border-gray-400'}`}/>        
          <p className="text-xl font-semibold mt-8 dark:text-slate-300">How many days are you planning to travel?</p>         
          <select name="nod" value={input.nod} onChange={handleChange} className={`mt-2 p-3 border hover:shadow-lg focus:outline-none focus:border-blue-500 rounded-xl ${isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:shadow-md hover:shadow-gray-700' : 'border-gray-400'}`}>
            <option className="font-thin" value="">Select an option...</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>           
          </select>
          <p className="text-xl font-semibold mt-8 dark:text-slate-300">Who do you plan on traveling with on your next adventure?</p>       
          <div className="flex flex-wrap">
            <div
              className={`w-full sm:w-auto border ml-2 sm:ml-0 m-2 p-4 rounded-lg cursor-pointer hover:shadow-lg ${input.groupType === 'Solo' ? 'bg-violet-300 text-black font-bold' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:shadow-md hover:shadow-gray-700' : 'border-gray-400'}`}
              onClick={() => handleOptionClick('Solo')}
            >
              Solo
            </div>
            <div
              className={`w-full sm:w-auto border p-4 m-2 rounded-lg cursor-pointer hover:shadow-lg ${input.groupType === 'Couple' ? 'bg-violet-300 text-black font-bold' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:shadow-md hover:shadow-gray-700' : 'border-gray-400'}`}
              onClick={() => handleOptionClick('Couple')}
            >
              Couple
            </div>
            <div
              className={`w-full sm:w-auto border p-4 m-2 rounded-lg cursor-pointer hover:shadow-lg ${input.groupType === 'Friends' ? 'bg-violet-300 text-black font-bold' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:shadow-md hover:shadow-gray-700' : 'border-gray-400'}`}
              onClick={() => handleOptionClick('Friends')}
            >
              Friends
            </div>
            <div
              className={`w-full sm:w-auto border p-4 m-2 rounded-lg cursor-pointer hover:shadow-lg ${input.groupType === 'Family' ? 'bg-violet-300 text-black font-bold' : isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-700 hover:shadow-md hover:shadow-gray-700' : 'border-gray-400'}`}
              onClick={() => handleOptionClick('Family')}
            >
              Family
            </div>          
          </div>
          <button className={`w-full sm:w-auto text-white font-bold p-4 ml-0 m-2 mt-5 rounded-lg bg-violet-900 hover:shadow-4xl ${isDarkMode ? 'border-gray-700' : 'border-gray-800'}`} 
           onClick={handleSubmit} >Plan a new Trip</button>
           {showWarning && (
        <p className="text-red-500">Please fill in all the required fields.</p>
      )}
        </div>      
    </div>
  )
}


export default InputPage
