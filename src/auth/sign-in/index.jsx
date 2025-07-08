import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function SignInpage() {
  return (
    <div className='flex justify-center my-20 items-center'>
      <SignIn/>
    </div>
  )
}

export default SignInpage