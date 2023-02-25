import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDownloadForOffline } from 'react-icons/md';
import {v4 as uuidv4} from"uuid"
import {fetchUser}  from '../utils/fetchUser';
import { client, urlFor } from '../client';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import UserProfile from './UserProfile';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  // State hooks to track hover and saving state
  const [postHovered, setPostHovered] = useState(false);


  // Initializes navigation hook
  const navigate = useNavigate();

  // Fetches user from the backend
  const user = fetchUser();

  // Determines if post has already been saved by the user
  const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user?.googleId))?.length
  
  
  const savePin = (id) => {
    if (!alreadySaved) {
    
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save [-1]", [{
          _key: uuidv4(),
          userId :user.googleId,
          postedBy: {
            _type: "postedBy",
            _ref:user.googleId
          }
           
        }])
        .commit()
        .then(() => {
        window.location.reload();
       
      })
  }
  }
  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => 
    window.location.reload())
  }

  return (
    <div className='m-2'>
      <div className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
        // Event handlers for mouse hover and leave
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        // Click handler to navigate to post details
        onClick={() => navigate(`/pin-detail/${_id}`)}>
        <img className='rounded-lg w-full' alt="user-post" src={urlFor(image)?.width(250).url()} />
        {/* Render buttons for downloading and saving posts */}
        {postHovered && (
          <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50' style={{ height: "100%" }}>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2'>
                <a
                  // Download post on click and stop event propagation
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none">
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* Render 'Save' or 'Saved' button based on whether the post has already been saved */}
              {alreadySaved ? (
                <button type="button" className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                  {save?.length} Saved
                </button>
              ) :
                <button type="button" className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                  onClick={(e) => {
                    e.stopPropagation()
                  }}>Save</button>}
            </div>
            <div className='flex justify-between items-center gap-2 w-full'>
              {destination && (
                <a
                  href={destination.length > 20 ? destination.slice(8, 20) : destination.slice(8)}
                  target="_blank"
                  rel="noreferrer"
                  className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'>
                  <BsFillArrowUpRightCircleFill />
                </a>
            
              )}
              {postedBy?._id === user?.googleId && (
                <button type="button" className='bg-white p-2 opacity-70 hover:opacity-100 font-bold text-dark rounded-3xl hover:shadow-md outline-none'
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}>
                  <AiTwotoneDelete/>
                      </button>
                      
              )}
            
          </div>      
          </div>  
        )}
      </div>
      <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
        <img className='w-8 h-8 rounded-full object-cover'src={postedBy?.image} alt="user-profile"/>
        <p className="font-semibold capitalize">
          {postedBy?.userName}
      </p>
      </Link>
    </div>
  )
}

export default Pin;
