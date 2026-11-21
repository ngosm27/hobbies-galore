import React from 'react'

const listItems = [
    'Dashboard',
    'Reports',
    'Calendars',
    'Categories',
    'About'
]

const Navbar = () => {
  return (
    <div className='fixed bg-black flex justify-between items-center gap-16 py-3 px-10 left-1/2 translate-x-[-50%] top-[20px] rounded-full backdrop-blur-md bg-opacity-60 text-white shadow-lg z-10'>
        <ul className='flex gap-8 text-xl'>
            {
                listItems.map((item) => (
                    <li className='relative group cursor-pointer' key={item}>
                        {item}
                        <span className='absolute left-0 bottom-[-5px] w-0 h-1 rounded-x1 bg-blue-500 transition-all duration-300 group-hover:w-full'></span>
                    </li>
                ))
            }
        </ul>
        <button className='bg-blue-500 py-1 px-6 rounded-3xl shadow-2xl text-white text-lg font-semibold hover:bg-green-400 hover:shadow-blue-500'>Contact</button>
    </div>
  )
}

export default Navbar