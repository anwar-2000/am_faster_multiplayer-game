import React, { useState, useEffect } from 'react';

function ReadyyGo() {
  const text = ["3", "2", "1", "TYPE!!"];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStepIndex < text.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }, 1000); // after 1 sec change to next index

    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  return (
    <div className='w-full grid place-items-center py-20'>
      <h1 className='text-8xl font-extrabold text-slate-500'>{text[currentStepIndex]}</h1>
    </div>
  );
}

export default ReadyyGo;