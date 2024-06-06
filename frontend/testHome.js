import React from 'react'
import {useNavigate} from "react-router-dom"



const Home = () => {
    const navigate = useNavigate();

    const handleSubmit = () =>{
        navigate("/input")
    }
  return (
    <div className="relative max-w-5xl mx-auto pt-10 sm:pt-24 lg:pt-32">
      <h1 className="text-6xl font-extrabold text-center dark:text-white" >
            Design Memorable Itineraries with <span className="text-orange-500">AI Trip Planner</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
            Effortlessly plan your ideal journey with our AI-powered travel planner, offering personalized itineraries and seamless trip management.
        </p>
        <div className="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
        <button onClick={ handleSubmit} className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-thin h-16 text-2xl px-9 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400" >
            Get Started <span className="ml-2 pb-1">&rarr;</span>
        </button>        
        </div>
        <div className="max-w-4xl mt-20 text-center mx-auto">
            <h2 className="text-orange-500 tracking-tight font-extrabold sm:text-3xl">"Traveling – it leaves you speechless, then turns you into a storyteller."</h2>
            <p className="text-slate-900 pt-8 font-semibold dark:text-slate-300">~ Ibn Battuta</p>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
    </div>
  )
}

export default Home
