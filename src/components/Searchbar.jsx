// 'use client'
// import React, { useState } from 'react';
// import { FiSearch } from 'react-icons/fi';
// import { useRouter } from 'next/navigation';
// import { useDispatch } from 'react-redux';
// import { setIsTyping } from '@/redux/features/loadingBarSlice';


// const Searchbar = () => {
//   const ref = React.useRef(null);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleSubmit = (e) => {
//     if (searchTerm === '') {
//       e.preventDefault();
//       return;
//     }
//     e.preventDefault();
//     router.push(`/search/${searchTerm}`);
//   };
//   const handleFocus = () => {
//     dispatch(setIsTyping(true));
//   };
//   const handleBlur = () => {
//     dispatch(setIsTyping(false));
//   };

  

//   return (
//     <form onSubmit={handleSubmit} autoComplete="off" className="p-2 text-gray-400 relative focus-within:text-gray-600">
//       <label htmlFor="search-field" className="sr-only">
//         Search all files
//       </label>
//       <div className="flex flex-row justify-start items-center">
//         <FiSearch aria-hidden="true" className="w-5 h-5 ml-4 text-gray-300" />
//         <input
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//           name="search-field"
//           autoComplete="off"
//           id="search-field"
//           className="flex-1 bg-transparent w-32 focus:border-b border-white lg:w-64 placeholder-gray-300 outline-none text-base text-white p-4"
//           placeholder="Search"
//           type="search"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
//     </form>
//   );
// };

// export default Searchbar;
import React, { useState, useEffect } from 'react'; 
import { FiSearch, FiMic } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setIsTyping } from '@/redux/features/loadingBarSlice';
import annyang from 'annyang';

const Searchbar = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    if (annyang) {
      annyang.addCallback('result', handleVoiceResult);
    }
    return () => {
      if (annyang) {
        annyang.removeCallback('result', handleVoiceResult);
      }
    };
  }, []);


  const startListening = () => {
    setIsListening(true);
    if (annyang) {
      annyang.start();
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (annyang) {
      annyang.abort();
    }
  };

  const handleVoiceResult = (phrases) => {
    setSearchTerm(phrases[0]);
    handleSubmit({ preventDefault: () => {} }); // Simulate form submission
    stopListening();
  };

  const handleSubmit = (e) => {
    if (searchTerm === '') {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    router.push(`/search/${searchTerm}`);
  };

  const handleFocus = () => {
    dispatch(setIsTyping(true));
  };

  const handleBlur = () => {
    dispatch(setIsTyping(false));
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="p-2 text-gray-400 relative focus-within:text-gray-600">
      <label htmlFor="search-field" className="sr-only">
        Search all files
      </label>
      <div className="flex flex-row justify-start items-center">
        <FiSearch aria-hidden="true" className="w-5 h-5 ml-4 text-gray-300" />
        <input
          onFocus={handleFocus}
          onBlur={handleBlur}
          name="search-field"
          autoComplete="off"
          id="search-field"
          className="flex-1 bg-transparent w-32 focus:border-b border-white lg:w-64 placeholder-gray-300 outline-none text-base text-white p-4"
          placeholder="Search"
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className="ml-2 text-gray-300 focus:outline-none"
        >
          <FiMic aria-hidden="true" className={`w-5 h-5 ${isListening ? 'text-red-500' : 'text-gray-300'}`} />
        </button>
      </div>
    </form>
  );
};

export default Searchbar;
