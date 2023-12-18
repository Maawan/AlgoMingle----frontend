import React from 'react'

const Button = ({children}) => {
  return (
    <div className='flex bg-[#ED5B2D]'>
        <p>{children}</p>
    </div>
  )
}

export default React.forwardRef(Button);