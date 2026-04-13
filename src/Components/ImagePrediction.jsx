import "./components.css";
import { predictionContext } from "../main";
import { useContext } from "react";

function ImagePrediction(){
    const {prediction}  = useContext(predictionContext);

    return <div className="w-[25%] max-h-72 p-5 mt-13 flex flex-col justify-center items-center bg-gray-600 card">
        <p  className=" text-9xl">
            {prediction}
        </p>
    </div>
}

export default ImagePrediction;