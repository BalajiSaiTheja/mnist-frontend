import { useContext, useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";
import { predictionContext } from "../main";
import { visualizationContext } from "@/App";

import "./components.css";

function ImageUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const inputEle = useRef(null);
    const { setPrediction } = useContext(predictionContext);
    const {setVisualizationURL} = useContext(visualizationContext);

    const triggerFileOpen = () => {
        inputEle.current.click();
    }

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        }
    }, [preview])


    const uploadFile = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

        }
    };

    const handleUploadFile = async (e) => {
        if (e) e.preventDefault();

        if (!file) {
            alert("Upload the file first");          // TBI
            return;
        }

        const formdata = new FormData();
        formdata.append("uploaded_image", file);
        // console.log([...formdata.entries()])
        try {
            const response = await fetch("http://127.0.0.1:8000/predict", {
                method: "POST",
                body: formdata
            });

            if (response.ok) {
                const data = await response.json();
                setPrediction(data.prediction);
            } else {
                console.error("Server error:", response.statusText);
            }
        }
        catch (err) {
            console.log(`Error in handleUpload ${err}`);
        }


        try {
            const response = await fetch("http://127.0.0.1:8000/visualize", {
                method: "POST",
                body: formdata
            });

            if (response.ok) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setVisualizationURL(imageObjectURL);
            } else {
                console.error("Server error:", response.statusText);
            }
        }
        catch (err) {
            console.log(`Error in handleUpload ${err}`);
        }
    }


    return <div id="file-upload-outercontainer" className="w-1/2 max-h-72 pb-5 flex flex-col justify-center items-center bg-gray-600 card">
        <div id="file-upload-innercontainer" className="m-2 w-7/10 h-56 flex flex-col items-center justify-center gap-4 rounded-lg">
            <input type="file" ref={inputEle} id="fileinput" className=" hidden" onChange={uploadFile}></input>
            {file ? <img onClick={triggerFileOpen} src={preview} alt="uploaded-image" className="w-full h-full block cursor-pointer rounded-md" /> : <FaImage
                onClick={triggerFileOpen}
                className="cursor-pointer text-4xl"
            />
            }
        </div>
        <button onClick={handleUploadFile} className="m-1 w-[50%] h-[10%] text-[1cqw] justify-center rounded-full bg-blue-500  font-medium text-white transition duration-200 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-400 dark:text-white dark:hover:bg-blue-300 dark:active:bg-blue-200  cursor-pointer">
            Predict
        </button>

    </div>
}

export default ImageUpload;