import { useRef, useState } from "react";
import Modal from "../components/Modal";
function SoloGame({}) {
  const text = `In the digital age, our data is under constant siege. Hackers lurk in the shadows, weaving phishing scams, exploiting vulnerabilities, and deploying malware, all aiming to steal information and disrupt systems. Cybersecurity warriors stand guard, building firewalls, crafting encryption, and hunting threats, vigilant defenders in the never-ending battle for digital security.`;
  const userInput = useRef(null);
  const modalRef = useRef(null);
  const [gameStats, setGameStats] = useState({
    started: false,
    matched_letters_index: [],
    not_matched_letter_index: -1,
    all_mistakes: 0,
    message: "You completed this challenge with 0 mistakes !",
    ended : false
  });
  const startGame = () => {
    setGameStats((prev) => ({ ...prev, started: true , ended : false , all_mistakes : 0 , not_matched_letter_index : -1 , matched_letters_index : [] }));
  };
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
    // if (mismatchIndex !== -1) {
    //   alert(
    //     `You made a mistake with ${input[mismatchIndex]} instead of ${text[mismatchIndex]}`
    //   );
    // }
    setGameStats((prev) => ({
        ...prev,
        all_mistakes: prev.all_mistakes + (mismatchIndex !== -1 ? 1 : 0),
        not_matched_letter_index: mismatchIndex,
        matched_letters_index: matchedIndices,
    }));
    if (mismatchIndex === -1 && input.length === text.length) {
      setGameStats((prev) => ({
        ...prev,
        matched_letters_index : [],
        not_matched_letter_index : -1,
        message: `you Completed this challenge with ${prev.all_mistakes} mistakes`,
        ended : true,
        started : false
      }));
      modalRef.current.openModal();
    }
  };

  return (
    <>
      <Modal ref={modalRef} message={gameStats.message}  /> 
      <div className="w-full h-screen p-14 flex flex-col items-start justify-start">
        <h4 className="px-14 text-gold">Cyber Security</h4>
        <h1 className="text-3xl w-12/12 font-extrabold text-center font-sans text-white">
            {text.split('').map((letter, index) => (
                <span key={index} className={`${gameStats.not_matched_letter_index === index ? "text-red" : gameStats.matched_letters_index.includes(index) ? 'text-green' : 'text-white'}`} style={{ color: gameStats.not_matched_letter_index === index ? 'red' : gameStats.matched_letters_index.includes(index) ? 'green' : 'white' }}>
                    {letter}
                </span>
            ))}
        </h1>
        {gameStats.started ? (
          <textarea
            onChange={handleUserInput}
            ref={userInput}
            name=""
            id=""
            cols="30"
            rows="10"
            className="bg-white w-9/12 self-center p-4 outline-none mt-14 rounded-2xl"
          />
        ) : (
          <button
            onClick={startGame}
            className="self-center mt-14 drop-shadow-glowWhite bg-white px-10 py-4 rounded-lg text-black font-semibold hover:bg-gray-400 transition duration-300"
          >
            Start
          </button>
        )}
      </div>
    </>
  );
}

export default SoloGame;
