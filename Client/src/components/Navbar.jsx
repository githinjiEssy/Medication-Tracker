import React from 'react'
import { Pill } from 'lucide-react'

function Navbar() {
  return (
    <nav className='w-full flex justify-center items-center'>
      <div className='flex justify-between items-center p-4 w-[90%] border-b border-[var(--muted-foreground)]'>
        <div className="flex items-center gap-2 font-bold text-[var(--primary)] text-xl">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-md grid grid-flow-col justify-items-center items-center">
            <Pill className='text-[var(--primary-foreground)]'/>
          </div> 
          MedTrack
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-teal-600">Product</a>
          <a href="#" className="hover:text-teal-600">Features</a>
          <a href="#" className="hover:text-teal-600">Security</a>
          <a href="#" className="hover:text-teal-600">Pricing</a>
        </div>
        <button className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition">
          Get Started
        </button>
      </div>
    </nav>
  )
}

export default Navbar
