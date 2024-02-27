
function UserPlayedGames({children}) {
  
  return (
    <div className='bg-slate-800 rounded-lg p-8 w-7/12 min-h-screen flex flex-col items-center justify-start'>
        <h1 className="self-start text-2xl text-gold pb-4">Recent Solo Games</h1>
        {children}
    </div>
  )
}

export default UserPlayedGames