"use client"

import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const id = useParams();
  console.log(id)
  return (
    <div>Helllooooooooooooooooooooo</div>
  )
}

export default page