import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

const Modal = forwardRef(({ message }, ref) => {
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {};
  useImperativeHandle(ref, () => ({
    openModal: () => setOpenModal(true),
  }));

  return (
    <>
      {openModal && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-30" />
          <div className="fixed top-1/2 left-1/2 z-40 flex flex-col gap-5 items-start justify-start drop-shadow-glowWhite -translate-x-1/2 -translate-y-1/2 h-[250px] w-5/12 bg-white rounded-lg p-4 shadow-lg z-60">
            <h1 className="self-center py-4">00h:00m:45s </h1>
            <IoCloseOutline
              size={24}
              color="red"
              onClick={() => setOpenModal(false)}
              className="absolute cursor-pointer top-0 right-0 "
            />

            <h1 className="text-xl mb-4">{message}</h1>
            <button className="self-center bg-gold text-white px-8 py-2 rounded-lg">Try Again</button>
          </div>
        </>
      )}
    </>
  );
});

export default Modal;
