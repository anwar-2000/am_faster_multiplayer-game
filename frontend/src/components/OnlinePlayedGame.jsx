import React from 'react'
import { formatTime } from '../utils/elapsedTime'

function OnlinePlayedGame({category,difficulty,mistakes,time,date}) {
  console.log(mistakes)
  return <>
     <small className='text-blue-500'>{new Date(date).toDateString()}</small>
    <div className='w-full mb-4 bg-slate-900 text-slate-500 rounded-lg p-2 flex items-center justify-evenly'>
        <div className='flex flex-col items-center justify-center'>
            <h4 className='text-blue-500'>{category}</h4>
            <h4 className='text-blue-500'>{difficulty}</h4>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <h4 className={`${(mistakes <= 3 && mistakes > 0) ? "text-orange-500 " : mistakes > 3 ? "text-red-500 " : "text-green-500"}`}>mistakes : {mistakes}</h4>
          <h4 className='text-green-500'>time : {formatTime(time)}</h4> 
        </div>
    </div>
    </>
}

export default OnlinePlayedGame