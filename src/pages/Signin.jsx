import React from 'react'
import Input from '../components/Input'
import Button from '../components/Button'

const Signin = () => {
  return (
    <div className="w-full flex justify-center bg-[url('./wal/wal1.png')]">
        <div className='w-[400px]  flex justify-center items-center m-4 border-1 bg-white rounded-lg shadow-orange-300 shadow-md '>
            <div className='w-full flex flex-col my-10 items-center'>
            <img src="./logos/logo14.png" alt="" className='h-[70px] w-[70px]' />
            <p className=' font-lumanosimo font-bold mb-4'>Login to continue...</p>
            <Input placeholder="Enter email address" className="w-[80%] my-2"/>
            <Input placeholder="Enter your password" type="password" className="w-[80%] mt-2"/>
            <p className='w-[80%]  text-right text-sm cursor-pointer text-[#1e1e1e] hover:text-[#A53F1F]'>Forgot Password ?</p>
            <Button value={"Login"} className={"w-[80%] mt-2"}/>
            <p className='w-[80%] text-sm'>New to AlgoMingle ? <span className='text-[#1e1e1e]   hover:text-[#A53F1F] cursor-pointer'>Register Now</span></p>
            </div>
            
        </div>
    </div>
  )
}

export default Signin