import React from 'react'

const Header = () => {
  return (
    <div className='w-full overflow-hidden h-24  flex   justify-around border-2 bg-[#f5f3f0]'>
        <div className='flex w-2/6 overflow-hidden justify-center  flex-shrink-1 cursor-pointer '>
            <img src="./logos/logo13.png" alt="" className='mx-2' />
            <img src="./logos/logo14.png"  alt="" className='phone:hidden tablet:block' />
        </div>
        <div className='flex phone:w-5/6 tablet:w-3/6 h-full text-sm tablet:text-[18px]  font-primaryFont font-bold  text-[#762D16] cursor-pointer'>
            <ul className='flex w-full overflow-hidden justify-around  items-center '>
                <li className='p-2 text-center transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Home</li>
                <li className=' p-2 text-center transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Interview</li>
                <li className=' p-2 text-center transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Signin</li>
                <li className=' p-2 text-center transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>Signout</li>
                <li className=' p-2 text-center transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>logout</li>
                <li className=' p-2 text-center transition-all duration-300 hover:text-xl hover:border border-[#762d16] rounded-md'>About</li>
            </ul>
        </div>
    </div>
  )
}

export default Header;