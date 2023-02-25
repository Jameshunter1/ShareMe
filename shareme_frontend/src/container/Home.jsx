import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";
import { UserProfile, Sidebar } from '../components';
import Pins from './Pins';
import { client } from "../client";
import logo from "../assets/logo.png"
import {userQuery} from "../utils/data"
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  // useState Hook to toggle sidebar
  const [toggleSidebar, setToggleSidebar] = useState(false)

  // useState Hook to store user data
  const [user, setUser] = useState(null)

  // useRef Hook to scroll to top of page
  const scrollRef = useRef(null)

  // useEffect Hook to fetch user data
  useEffect(() => {
    const userInfo = fetchUser();
    const query = userQuery(userInfo?.googleId)
    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
  }, []);

  // useEffect Hook to scroll to top of page when page loads
  useEffect(() => {
    scrollRef.current.scrollTo(0,0)
  }, [])

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out'>
      {/* Sidebar for medium and larger screens */}
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user && user} />
      </div>
      {/* Sidebar for smaller screens */}
      <div className='flex md:hidden flex-row'>
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/">
            <img src={logo} alt="logo" className='w-28'/>
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="logo" className='w-28'/>
          </Link>
        </div>
      </div>

      {/* Sidebar for small screens when toggleSidebar is true */}
      {toggleSidebar && (
        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end'>
            <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() =>
              setToggleSidebar(false)}
            />
          </div>
          <Sidebar user={user && user} closeToggle={setToggleSidebar} />
        </div>
      )}

      {/* Main content area */}
      <div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
        <Routes>
          {/* Route to user profile */}
          <Route path="/user-profile/:userId" element={<UserProfile/>}/>
          {/* Route to pins */}
          <Route path="/*" element={<Pins user={user && user} />}/>
        </Routes>
      </div>
    </div>
  )
}

export default Home
