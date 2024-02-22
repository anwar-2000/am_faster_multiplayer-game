import {
    forwardRef,
    useImperativeHandle,
    useRef,
  } from "react";
  import { IoCloseOutline } from "react-icons/io5";
  
  const Modal = forwardRef((props, ref) => {
    const dialog = useRef();
  
    useImperativeHandle(ref, () => ({
      openModal: () => dialog.current.showModal(),
    }));
  
    return (
      <dialog ref={dialog} className="bg-gold relative w-10/12 h-[350px] flex items-center justify-center">
        <h1>{props.message}</h1>
        <form
          method="dialog"
          style={{ position: "absolute", top: "0.5rem", right: "1rem" }}
        >
          <button className="p-2">
            <IoCloseOutline size={30} color="red" />
          </button>
        </form>
      </dialog>
    );
  });
  
  export default Modal;
  