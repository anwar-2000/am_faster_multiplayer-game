import { useLoaderData } from "react-router-dom";
import Game from "../components/Game";

function SoloGame({}) {
  const {challenge} = useLoaderData()
  //console.log(challenge)
  return <Game text={challenge.text_content} id={challenge.id} category={challenge.category} difficulty={challenge.difficulty} />
  }

export default SoloGame;

export const speceficGameLoader = async ({params}) => {
    const challengeId = params.challengeId
    const response = await fetch(`http://localhost:8000/challenges/${challengeId}`)
    if(!response.ok){
        throw new Error("Error fetching the challenge")
    }
    const data = await response.json()
    return data;
}
