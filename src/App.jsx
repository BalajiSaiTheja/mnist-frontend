import ImageUpload from "./components_/ImageUpload";
import ImagePrediction from "./components_/ImagePrediction";
import ImageCanvas from "./components_/ImageCanvas";
import TabComponent from "./components_/TabComponent";
import Visualization from "./components_/Visualization";
import { createContext, useState } from "react";
import Blog from "./components_/blog-components/Blog";
import { TracingBeam } from "./components_/TracingBeam";

export const visualizationContext = createContext();

function App() {
  const [visualizationURL, setVisualizationURL] = useState(null);
  const [component_render_bluprint, setComponent_render_bluprint] = useState([0, 1]);
  const [components, setComponents] = useState([{
    value: "Upload Image",
    elem: <ImageUpload />
  }, {
    value: "Draw",
    elem: <ImageCanvas />
  }]);


  return <div className="w-screen h-screen flex flex-col">
    <div className="w-full py-5 sticky bg-transparent">
      <TracingBeam>
        <Blog />
      </TracingBeam>
    </div>
    <visualizationContext.Provider value={{ visualizationURL, setVisualizationURL }}>
      <div className="w-full flex flex-row items-stretch justify-evenly p-5 gap-5">
        <TabComponent
          component_render_bluprint={component_render_bluprint}
          components={components}
        />
        <ImagePrediction />
      </div>
      <div>
        <Visualization />
      </div>
    </visualizationContext.Provider>

  </div>
}

export default App;