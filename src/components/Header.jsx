import React from 'react'

const Header = () => {
  return (
    <div className='w-full overflow-hidden h-24  flex justify-around border-2 bg-[#f5f3f0]'>
        <div className='flex w-[200px] cursor-pointer'>
            <img src="./logos/logo13.png" alt="" className='mx-2' />
            <img src="./logos/logo14.png" alt="" className='' />
        </div>
        <div className='flex h-full font-primaryFont font-bold text-[#762D16] cursor-pointer'>
            <ul className='flex items-center'>
                <li className='mx-2 p-2 transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Home</li>
                <li className='mx-2 p-2 transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Interview</li>
                <li className='mx-2 p-2 transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Signin</li>
                <li className='mx-2 p-2 transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Signout</li>
                <li className='mx-2 p-2 transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>logout</li>
                <li className='mx-2 p-2 transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>About</li>
            </ul>
        </div>
    </div>
  )
}

export default Header