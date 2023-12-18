import React from 'react'
import Button from '../components/Button'

const Home = () => {
  return (
    <div className='w-full flex  border'>
        <div className='flex-1 border-4'>
            <h2>Want to give Mock Interviews ?</h2>
            <h2>with people around the world having same interest in DSA</h2>
            <Button>
                Click me
            </Button>
        </div>
        <div className='flex-1 border-4 justify-center flex'>

            <img src="./banner1.png" alt="" className='' />
        </div>
    </div>
  )
}

export default Home