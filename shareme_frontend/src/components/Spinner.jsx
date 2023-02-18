import React from 'react'
import {Circles} from "react-loader-spinner";

const Spinner = ({message}) => {
  return (
      <div className='flex flex-col justify-center items-center w-full h-full mt-6'>
          <Circles type="Circles" color="#00bfff" height={50} width={200} className="mt-5" />
          <p className='text-lg text-center px-2 m-6'>{message}</p>
    </div>
  )
}

export default Spinner