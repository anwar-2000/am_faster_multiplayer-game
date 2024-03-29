import { forwardRef, useImperativeHandle, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import {toast} from "sonner"
import { formatTime } from "../utils/elapsedTime";

const Modal = forwardRef(({ online , message ,mistakes, challenge_id, time}, ref) => {
  const [openModal, setOpenModal] = useState(false);
  const token = localStorage.getItem("userToken")
  const handleCloseModal = () => {
    setOpenModal(false)
  };
  const handleSaveScore = async () => {
    if (!online) {
        try {
          const response = await fetch("http://localhost:8000/games",{
            method : "POST",
            headers : {
              "authorization" : `Bearer ${token}`,
              "Content-type" : "application/json"
            },
            //more params to pass .... (game category)
            body : JSON.stringify({
              challenge_id : challenge_id,
              mistakes : mistakes,
              time : time
            })
          })
          if(!response.ok){
              const errorData = await response.json()
              toast.error(errorData.message)
              return;
          }
          toast.success("Saved !") 
        } catch (error) {
          console.log(error)
        }
    } else {
      // saving online game data
    }

  }
  useImperativeHandle(ref, () => ({
    openModal: () => setOpenModal(true),
  }));

  return (
    <>
      {openModal && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30" />
          <div className="fixed top-1/2 left-1/2 z-40 flex flex-col gap-5 items-start justify-start  -translate-x-1/2 -translate-y-1/2 h-[250px] w-5/12 bg-slate-800 rounded-lg p-4 shadow-lg z-60">
            <h1 className="self-center text-3xl font-extrabold py-4 text-blue-800">{formatTime(time)}</h1>
            <IoCloseOutline
              size={24}
              color="red"
              onClick={handleCloseModal}
              className="absolute cursor-pointer top-2 right-2 "
            />

            <h1 className="text-xl mb-4 text-slate-400 self-center">{message}</h1>
            <div className="w-full flex flex-wrap gap-4 items-center justify-center">
            {
              // TODO : add a play again feature for online mode also !
            }
            {!online && <button className="self-center bg-gold text-white px-8 py-2 rounded-lg" onClick={handleCloseModal}>Try Again</button>}
            {!online && token && <button className="self-center bg-blue-800 text-white px-8 py-2 rounded-lg" onClick={handleSaveScore}>Save Score</button>}            
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default Modal;
