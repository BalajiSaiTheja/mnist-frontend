import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { predictionContext } from "@/main";
import { visualizationContext } from "@/App";

const baseURL = import.meta.env.VITE_BACKEND_URL;

function ImageCanvas() {
    const { setPrediction } = useContext(predictionContext);
    const { setVisualizationURL } = useContext(visualizationContext);

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const setCanvasSize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;

            const ctx = canvas.getContext('2d');
            ctx.lineCap = "round";
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
        };

        const timer = setTimeout(setCanvasSize, 50);
        return () => clearTimeout(timer);
    }, []);

    const getCoordinates = (nativeEvent) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const offsetX = (nativeEvent.clientX - rect.left) * (canvas.width / rect.width);
        const offsetY = (nativeEvent.clientY - rect.top) * (canvas.height / rect.height);

        return { offsetX, offsetY };
    };

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    }

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleReset = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = "white";
        //  ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handlePredict = () => {
        const canvas = canvasRef.current;
        const dup_canvas = document.createElement("canvas");
        const dup_ctx = dup_canvas.getContext('2d');

        dup_canvas.width = canvas.width;
        dup_canvas.height = canvas.height;
        dup_ctx.fillStyle = "white";
        dup_ctx.fillRect(0, 0, canvas.width, canvas.height);

        dup_ctx.drawImage(canvas, 0, 0);

        const imageData = dup_canvas.toBlob(async (blob) => {
            if (!blob) {
                console.log("Conversion of canvas to blob error occured");
                return;
            }

            const formdata = new FormData();
            formdata.append("uploaded_image", blob, 'canvasImage.png');
            ///   console.log([...formdata.entries()])
            try {
                const response = await fetch(`${baseURL}/predict`, {
                    method: "POST",
                    body: formdata
                });

                if (response.ok) {
                    const data = await response.json();
                    setPrediction(data.prediction);
                    // console.log("Prediction result:", data);
                    handleReset();
                } else {
                    console.error("Server error:", response.statusText);
                }
            }
            catch (err) {
                console.log(`Error in handleUpload ${err}`);
            }

            try {
                const response = await fetch(`${baseURL}/visualize`, {
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

        });


    }


    return <div className="w-1/2 max-h-72 flex flex-col justify-center items-start  card">
        <div className="w-full h-full flex flex-col justify-center mb-4 items-center ">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full flex-1 rounded-lg cursor-crosshair border-none"
            ></canvas>
        </div>
        <div className="flex w-full justify-around mt-4 mb-8">
            <Button className=""
                variant="outline"
                onClick={handleReset}
            ><p className=" cursor-pointer">Reset</p></Button>
            <Button className="mx"
                variant="outline"
                onClick={handlePredict}
            ><p className=" cursor-pointer">Predict</p></Button>
        </div>
    </div>
}


export default ImageCanvas;