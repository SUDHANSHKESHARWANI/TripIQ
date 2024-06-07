import React, { useState, useEffect , useContext, useCallback } from 'react';
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClock,faLocationDot ,faFilter, faMoneyBill1Wave, faMoneyBillTransfer, faInfoCircle,faTemperatureHalf,  faBriefcase, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom"
import { DarkModeContext } from './DarkModeContext';
import {FidgetSpinner} from 'react-loader-spinner';
import jsPDF from 'jspdf';

const Itinerary = () => {

  const quotes = [
    "I need a vacation so long, I forget all my passwords.",    
    "Planning a trip is like solving a Rubik's cube, but with fewer colors and more luggage.",
    "Traveling is the only thing you buy that makes you richer. But first, you have to survive the planning!",
    "I'm in a committed relationship with my passport and luggage.",
    "Traveling: It leaves you speechless, then turns you into a storyteller... once you figure out the itinerary."
  ];
  const getRandomQuote=()=>{
    const randomIndex=Math.floor(Math.random()*quotes.length);
    return quotes[randomIndex]
  }
  const quote = getRandomQuote();

  const [imageURLs, setImageURLs] = useState({});
  const input=useSelector((state)=>state.input.inputData)  
  const { city, nod, groupType } = input;

  const query = `Make an itinerary for ${groupType} Trip to ${city} for ${nod} days. 
  Return the response in JSON Format.
  Example JSON Format:
  {
    "trip": {
      "title": "Solo Trip to Delhi",
      "itinerary": [
        {
          "day": "Day 1: Exploring Old Delhi",
          "activities": [
            {
              "time": "9:00 AM - 10:00 AM",
              "location": "Jama Masjid",
              "description": "Visit one of the largest mosques in India and experience its grandeur."
            }            
          ]
        }        
      ]
    }
  };`;
  // // console.log(input)
  const [data,setData]=useState(null)
  const [currency,setCurrency]=useState("")
  const [currencyVal,setCurrencyVal]=useState(null)
  const country=input.country;
  const coordinates={
    latitude:input.latitude,
    longitude:input.longitude
  }
  // console.log(coordinates)
  const [weather,setWeather]=useState({
    temp:"",
    desc:"",
    icon:""
  })
  const [img,setImg]=useState("")  
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  const { isDarkMode } = useContext(DarkModeContext);
  const [serverStatus,setServerStatus]=useState("up")

  // Actual API Call
  useEffect(()=>{
    const getResponse=async()=>{
      const options={
        method:"POST",
        body:JSON.stringify({
          message:query
        }),
        headers:{
          "Content-Type":"application/json"
        }
      }
      try {
        const response= await fetch("https://trip-iq-server.vercel.app/completions",options)
        const data=await response.json()
        setData(JSON.parse(data.choices[0].message.content))
        // console.log(data);
      } catch (error) {
        // console.error('Error fetching data:', error);
        setServerStatus("down")
        setLoading(false)
      }
    }
    getResponse();
  },[])

  
  // useEffect(()=>{
  //   // console.log(data)
  // },[data])

  //redirects to input page if any input is not filled
  useEffect(()=>{
    if(!city || !nod || !groupType){
      navigate("/input")
    }
    // console.log("Navigate UE")
  },[])
  
  // Fetch City Description
  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${city}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDescription(data.extract);
        // console.log("City Description UE")
      } catch (error) {
        // console.error('Error fetching data:', error);
        return null;
      }
    };

    if (city) {
      fetchDescription();
    }
  }, []);

  // fetch weather info
  useEffect(()=>{
    if(coordinates.latitude && coordinates.longitude){
    const fetchWeather = async (coordinates) =>{
      try {
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}&units=metric`)
        if (!response.ok) {
          throw new Error("Failed to fetch weather")
        }
        // // console.log(response)
        const data=await response.json();
        if (!data.main.temp) {
          throw new Error("Temperature not available")
        }
        // console.log(data.main.temp-273)
        // setWeather((weather)=>({
        //   ...weather,
        //   temp:data.main.temp-273
        // }))
        if (!data.weather || !data.weather[0] || !data.weather[0].main){
          throw new Error("Weather Description not available")
        }

        // console.log(data.weather[0].main)
        // console.log(data.weather[0].icon)
        const tempWeather = {
          temp:data.main.temp,
          desc:data.weather?.[0]?.main || "N/A",
          icon:"https://openweathermap.org/img/wn/"+data.weather?.[0]?.icon+".png" || ""
        }
        // console.log({"Weather":tempWeather})        
        setWeather(tempWeather)   
        
      } catch (error) {
        // console.error('Error fetching data:', error);
        return null;
      }      
    }
  
    fetchWeather(coordinates)
    // console.log("Weather Description UE")
  }
  },[])

  const fetchCurrencyCode = async (countryName) => {
    const url = 'https://restcountries.com/v3.1/all';    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch country data');
      }
      const data = await response.json();
      const country = data.find(c => c.name.common.toLowerCase() === countryName.toLowerCase());
      if (country && country.currencies) {
        const currencyCode = Object.keys(country.currencies)[0];
        setCurrency(currencyCode);
        // return currencyCode;
      } else {
        // console.log(`Currency code not found for ${countryName}`);
      }
    } catch (error) {
      // console.error('Error fetching currency code:', error);
      return null;
    }
  };
  
  const fetchCurrencyValue = async (currencyCode) => {
    try {
      // const currencyCode = await fetchCurrencyCode(country);        
      // if (!currencyCode) return;
      
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_KEY}/latest/USD`);
      if (!response.ok) {
        throw new Error('Failed to fetch currency value');
      }       
      const data = await response.json();
      const array= data.conversion_rates;
      const value=Math.round(array[currency]*100)/100;
      setCurrencyVal(value)        
    } catch (error) {
      console.error('Error fetching currency value:', error);
    }
  };

  // Log weather state in a subsequent render
  useEffect(() => {
    
   const fetchCurrencyData = async () =>{
     await fetchCurrencyCode(country)
   };
   fetchCurrencyData();
   // console.log("Currency Description UE")
  }, []);


  // Fetch the currency and currency value
  useEffect(()=>{
    if(currency){
      const fetchCurrencyValueAsync = async () =>{
        await fetchCurrencyValue(currency);
      };
      fetchCurrencyValueAsync();
    }
    // console.log("Cureency Value UE")
  },[currency])


  console.log(currency)
  console.log(currencyVal);
  const fetchImage = useCallback(async (location) => {
    try {
      const response = await fetch(
        `https://trip-iq-server.vercel.app/api/google-maps?location=${location}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const data = await response.json();
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].photos) {
        throw new Error('Image data not available');
      }
      const photoReference = data.candidates[0].photos[0].photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.REACT_APP_GMAP_API_KEY}`;
    } catch (error) {
      // console.error('Error fetching image:', error);
      return null; // Return an empty string if image fetching fails
    }
  },[]);

  // Fetch City Image
  useEffect(()=>{
    const getCityImage = async () =>{
      const cityImageUrl=await fetchImage(city)
      setImg(cityImageUrl)
    }

    getCityImage();
    // console.log("City Image UE")
  },[city,fetchImage])

  // Fetch Thumbnail Image 
  useEffect(() => {
    const getImageURLs = async () => {

      if(!data || !data.trip || !data.trip.itinerary){       
        // console.log({"Data available":data})
        return null;
      }
      const urls = {};
      for (const day of data.trip.itinerary) {
        for (const activity of day.activities) {
          const imageURL = await fetchImage(activity.location);
          urls[activity.location] = imageURL;
        }
      }
      setImageURLs(urls);
      setLoading(false); // Set loading to false once all data is fetched
    };

    getImageURLs();
    // console.log("Thumbnail Image UE")
  }, [fetchImage,data]); // try putting data instead of input

  // Go back button
  const handleBackClick = () =>{
    navigate(-1);
  }
  

  // Handle case where data is not yet available
  // if (!data || !data.trip || !data.trip.itinerary) {    
  //   return <div>Data not available</div>;
  // }  

  // Function to generate and download PDF
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Adding header
    doc.setFontSize(22);
    doc.text('TripIQ', 105, 10, null, null, 'center'); // Centered header
    doc.setFontSize(12);
    doc.text('Smart Travel Starts Here', 105, 18, null, null, 'center'); // Centered tagline
  
    // Adding a title for the trip
    doc.setFontSize(18);
    doc.text(data.trip.title, 105, 30, null, null, 'center'); // Centered trip title
    doc.setFontSize(12);
  
    let yPosition = 40; // Start position for content
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20; // Margin from bottom of the page
  
    const addNewPage = () => {
      doc.addPage();
      yPosition = 10; // Reset yPosition for new page
    };
  
    data.trip.itinerary.forEach((day, dayIndex) => {
      if (yPosition > pageHeight - marginBottom) addNewPage();
  
      doc.setFontSize(14);
      doc.text(day.day, 10, yPosition); // Day title
      yPosition += 10;
  
      day.activities.forEach((activity, activityIndex) => {
        const timeLocationText = `${activity.time} - ${activity.location}`;
        const descriptionText = activity.description;
  
        // Timings and Location in bold
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        const splitTimeLocationText = doc.splitTextToSize(timeLocationText, 180);
  
        if (yPosition + splitTimeLocationText.length * 6 > pageHeight - marginBottom) addNewPage();
  
        doc.text(splitTimeLocationText, 10, yPosition);
        yPosition += splitTimeLocationText.length * 6 + 2;
  
        // Description in normal font
        doc.setFont(undefined, 'normal');
        const splitDescriptionText = doc.splitTextToSize(descriptionText, 180);
  
        if (yPosition + splitDescriptionText.length * 6 > pageHeight - marginBottom) addNewPage();
  
        doc.text(splitDescriptionText, 10, yPosition);
        yPosition += splitDescriptionText.length * 6 + 10;
      });
  
      yPosition += 10; // Add some space between days
    });
  
    if (yPosition > pageHeight - marginBottom) addNewPage();
  
    // Adding "Happy Planning" at the end
    doc.setFontSize(16);
    doc.text('Happy Planning!', 105, yPosition, null, null, 'center');
  
    // Adding link to the website at the bottom
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 255); // Blue color for the link
    doc.textWithLink('Visit our website', 105, yPosition + 10, { url: 'https://yourwebsite.com' }, null, 'center');
  
    doc.save(`${data.trip.title}.pdf`);
  };
  


  return (
    <div className={`relative max-w-5xl  mx-auto pt-10 sm:pt-24 lg:pt-2 text-gray-800 ${isDarkMode ? 'dark' : ''}`}>     
    <button onClick={handleBackClick} className="text-lg mb-5 p-5 hover:bg-gray-200 dark:text-white hover:dark:bg-slate-500">
      <FontAwesomeIcon icon={faArrowLeft} /> Go Back
    </button>

    {/* Consitionally loading of page  */}
    {loading?(
      <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-3xl text-gray-600 text-center font-semibold mb-6 dark:text-sky-500">{quote}</p>
      <FidgetSpinner 
        height="100" 
        width="100" 
        color="#4fa94d" 
        ariaLabel="fidget-spinner-loading"
        visible={true} 
      />
      
    </div>
      ):(
        <div className="sm:border-0 md:border-4 dark:border-0 rounded-xl p-4 m-2">
        <h3 className="text-6xl text-orange-500 text-center font-semibold underline  p-2">{city}</h3> 
        <div className="flex justify-center my-6 ">
      {img && <img src={img} alt="CityImage" className="w-full sm:w-1/2 lg:w-1/4 outline outline-offset-8 outline-slate-400 rounded-3xl"/>  }     
        </div>
          
          <div className="dark:text-white pt-5">    
            <div className="flex flex-wrap">
            <FontAwesomeIcon icon={faFilter} className="mt-1" />
              <h3 className="mr-5 ml-1 font-semibold">Filters: </h3>
              <div className="border rounded-full bg-gray-100 mr-5 px-4 dark:bg-slate-900 dark:border-cyan-600">
                <span className="font-semibold">City : </span>{input.city}
              </div>
              <div className="border rounded-full bg-gray-100 mr-5 px-4 mt-4 md:mt-0 dark:bg-slate-900 dark:border-cyan-600">
              <span className="font-semibold">Number of Days : </span>{input.nod}
              </div>
              <div className="border rounded-full bg-gray-100 px-4 mt-4 md:mt-0 dark:bg-slate-900 dark:border-cyan-600">
              <span className="font-semibold">Group Type : </span>{input.groupType}
              </div>
          </div>
          <div className="flex mt-5">
            <FontAwesomeIcon icon={faBriefcase} className="pt-2"/> 
            <h3 className="font-semibold pt-1 ml-1">Overview</h3>
          </div>
          <p className="text-lg text-justify font-medium mt-4 dark:text-slate-300">{description}</p>  
          <div>
            <div className="flex mt-5">
              <FontAwesomeIcon icon={faInfoCircle} className="pt-2"/> 
              <h3 className="font-semibold pt-1 ml-1">General Information</h3>
            </div>
            <div className="flex flex-wrap dark:text-slate-300">
              {currency && <div className="flex flex-nowrap"><FontAwesomeIcon icon={faMoneyBill1Wave} className="my-5 ml-3  text-green-700"/>
              <p className="m-4">{currency}</p></div>}
              {currencyVal && <div className="flex flex-nowrap"><FontAwesomeIcon icon={faMoneyBillTransfer} className="my-5 ml-3 md:ml-8 text-green-700"/>
              <p className="m-4">1 USD = {currencyVal} {currency} </p>  </div> }
              <div className="flex flex-nowrap"><FontAwesomeIcon icon={faTemperatureHalf} className="my-5 ml-3 md:ml-8"/>       
              <p className="m-4"><strong>Temp:</strong> {weather.temp} &deg; C</p>
              <img src={weather.icon} alt="icon" className="mb-4"/>
              <p className="m-4">{weather.desc}</p> </div>       
            
            </div>
          </div>
          </div>
          {serverStatus==="up" && <div className="mb-4">
            <button
              onClick={generatePDF} // <-- Attach the PDF generation function to the button's onClick event
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> Extract as PDF
            </button>
          </div>}
          {serverStatus==="down"? 
          (<div className="sm:text-xl md:text-3xl flex flex-col text-gray-600 text-center font-semibold mb-6 dark:text-sky-500"><p>It seems like our server are down and we won't be able to design itinerary for you currently :(</p>
          <p className="mt-4">Apologies for inconvenience caused.</p></div>):
            (data.trip.itinerary.map((day, index) => (
              <div key={index} className="relative mb-10">        
                <h2 className="text-3xl md:text-4xl font-semibold p-3 mb-10  underline decoration-4 dark:text-white">{day.day}</h2>
                {day.activities.map((activity, activityIndex) => (
                  <div className="relative mb-5 " key={activityIndex}>
                    {isDarkMode && (<div class="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-sky-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>)}
                    <div className="relative flex flex-col sm:flex-row border rounded-lg  bg-slate-100 shadow-lg p-6 dark:bg-slate-900 dark:border-cyan-600">
                      <div className="flex-auto">
                      <div className="flex items-center">
                          <FontAwesomeIcon icon={faClock} className="dark:text-sky-500 mr-2" />
                          <h3 className="text-xl font-medium dark:text-sky-500">{activity.time}</h3>
                        </div>
                        <div className="flex items-center mt-2">
                          <FontAwesomeIcon icon={faLocationDot} className="text-2xl text-red-700 mr-2" />
                          <h3 className="text-2xl font-semibold underline decoration-2 dark:text-white"><a href={`https://www.google.com/maps/search/?api=1&query=${activity.location}+${city}`} target="_blank" rel="noopener noreferrer">{activity.location}</a></h3>
                        </div>
                      <p className="mt-6 text-xl ont-semibold text-gray-600 dark:text-slate-300">{activity.description}</p>  
                      </div>
                      <div className="flex-none w-full h-48 sm:w-48 sm:h-48 relative mt-4 sm:mt-0 sm:ml-4">             
                      {imageURLs[activity.location] !== null ? (
                        <img src={imageURLs[activity.location]} alt="Location" className="absolute inset-0 w-full h-full object-cover rounded-lg"/>
                        
                      ) : (
                        <div />
                      )}
                      </div>
                      
                    </div> 
                  </div>
                ))}
                </div>
            ))) }    
          </div>
      )
    }
    </div>
  );
}

export default Itinerary;
