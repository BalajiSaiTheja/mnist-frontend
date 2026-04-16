import { visualizationContext } from "@/App";
import { useContext } from "react";

function Visualization() {
    const { visualizationURL } = useContext(visualizationContext);

    return (
        <div className="w-[75%] mx-auto my-5 flex justify-center items-cente rounded-xl overflow-hidden p-4 border border-gray-700">
            {!visualizationURL ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <p>Visualization will appear here after prediction</p>
                </div>
            ) : (
                <img
                    // object-contain ensures the WHOLE plot is visible
                    // h-auto lets the image height be determined by its content
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-2xl"
                    src={visualizationURL}
                    alt="Model interpretability visualization"
                />
            )}
        </div>
    );
}

export default Visualization;