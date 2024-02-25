import { useRef, useState } from "react";
import Modal from "../components/Modal";
import { formatTime } from "../utils/elapsedTime";
import ReadyyGo from "./ReadyyGo";
function Game({id,text,category,difficulty}) {
  const userInput = useRef(null);
  const modalRef = useRef(null);
  const timerRef = useRef(null);
  const [gameStats, setGameStats] = useState({
    started: false,
    matched_letters_index: [],
    not_matched_letter_index: -1,
    all_mistakes: 0,
    message: "You completed this challenge with 0 mistakes !",
    ended : false,
    startTime : null,
    elapsedTime : 0,
    threeTwoOneReadyGo : false
  });
  const startGame = () => {
    setGameStats((prev)=>({...prev,threeTwoOneReadyGo : true}))
    // 3 2 1 go timeout here
    setTimeout(()=>{
        setGameStats((prev) => ({ ...prev, started: true , ended : false , all_mistakes : 0 , startTime:Date.now() ,  not_matched_letter_index : -1 , matched_letters_index : [] , threeTwoOneReadyGo : false }));
        setTimeout(() => {
            userInput.current && userInput.current.focus()
          }, 100);
        timerRef.current = setInterval(() => {
          setGameStats((prev)=>({...prev, elapsedTime : Date.now() - prev.startTime}))
        }, 1000);
    },4000)

  };
  const quitGame = () => {
    //using this fun later to send more data to Backend
    setGameStats((prev)=>({...prev,started : false , elapsedTime : 0 , startTime : null , matched_letters_index : [] , not_matched_letter_index : -1}))
    clearInterval(timerRef.current); // stopping the timer
  }
  
  const handleUserInput = (event) => {
    const input = event.target.value;
    const minLength = Math.min(input.length, text.length);

    let mismatchIndex = -1;
    let matchedIndices = [];
    // Find the index of the first mismatched character
    for (let i = 0; i < minLength; i++) {
        if (input[i].toLowerCase() !== text[i].toLowerCase()) {
            mismatchIndex = i;
            break;
        }
        matchedIndices.push(i);
    }
    setGameStats((prev) => ({
        ...prev,
        all_mistakes: prev.all_mistakes + (mismatchIndex !== -1 ? 1 : 0),
        not_matched_letter_index: mismatchIndex,
        matched_letters_index: matchedIndices,
    }));

    //once user completes the text !
    if (mismatchIndex === -1 && input.length === text.length) {
      setGameStats((prev) => ({
        ...prev,
        matched_letters_index : [],
        not_matched_letter_index : -1,
        message: `you Completed this challenge with ${prev.all_mistakes} mistakes`,
        ended : true,
        started : false
      }));
      // Stoping the timer when the game ends
      clearInterval(timerRef.current);
      modalRef.current.openModal();
    }
  };

  return (
    <>
      <Modal ref={modalRef} mistakes={gameStats.all_mistakes} message={gameStats.message} time={gameStats.elapsedTime} challenge_id={id} /> 
      <div className="w-full h-screen p-14 flex flex-col items-start justify-start">
        <div className="flex items-center justify-center gap-8">
          <h4 className="px-14 text-gold">{category} - {difficulty}</h4>
          <p className="text-blue-500 text-lg font-bolder"> time : {formatTime(gameStats.elapsedTime)}</p>
          <p className={`${(gameStats.all_mistakes <= 3 && gameStats.all_mistakes > 0) ? "text-orange-500 " : gameStats.all_mistakes > 3 ? "text-red-500 " : "text-green-500"} text-lg font-bolder`}>mistakes : {gameStats.all_mistakes}</p>
        </div>
        <h1 className="text-3xl w-12/12 font-extrabold text-center font-sans py-4 text-white">
            {text.split('').map((letter, index) => (
                <span key={index} className={`${gameStats.not_matched_letter_index === index ? "text-red" : gameStats.matched_letters_index.includes(index) ? 'text-green' : 'text-white'}`} style={{ color: gameStats.not_matched_letter_index === index ? 'red' : gameStats.matched_letters_index.includes(index) ? 'green' : 'white' }}>
                    {letter}
                </span>
            ))}
        </h1>
        {gameStats.threeTwoOneReadyGo && <ReadyyGo />}
        {gameStats.started && <textarea
            onChange={handleUserInput}
            ref={userInput}
            name=""
            id=""
            cols="30"
            rows="10"
            className="bg-white w-9/12 self-center p-4 outline-none mt-14 rounded-2xl"
          /> }
          {!gameStats.threeTwoOneReadyGo && !gameStats.started &&
          <button
            onClick={startGame}
            className="self-center mt-14 drop-shadow-glowWhite bg-white px-10 py-4 rounded-lg text-black font-semibold hover:bg-gray-400 transition duration-300"
          >
            Start
          </button>
        }
        {gameStats.started && <button
            onClick={quitGame}
            className="self-center mt-14  bg-red-700 px-10 py-4 rounded-lg text-black font-semibold hover:bg-red-800 transition duration-300"
          >
            Quit Game
          </button>}
      </div>
    </>
  );
}

export default Game;
