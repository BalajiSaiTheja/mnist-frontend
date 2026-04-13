import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";


function TabComponent({component_render_bluprint,components}){

    const [make_tab_opaque,setMake_tab_opaque] = useState(0);
    const components_set = new Set(component_render_bluprint);
    const torender = components.filter((_,index)=>{
        return components_set.has(index);
       
    });
    
    const handleOpaque =(ind)=>{
        setMake_tab_opaque(ind);
    }
    

    return (
        <Tabs className="w-1/2 h-full flex flex-col">
      <TabsList className="grid w-1/2 grid-cols-2 mb-4">
        {
                torender.map((comp,i)=>{
                return <TabsTrigger 
                className={`cursor-pointer ${make_tab_opaque == i ? "opacity-50 text-xl text-green-900" : "opacity-100"}`}
                id={`tab_${i}`}
                key={i}
                onClick={()=>{
                    handleOpaque(i);
                }}
                value={comp.value}>{comp.value}</TabsTrigger>    
            })
        }
      </TabsList>
      {
        torender.map((comp,i)=>{
                return <TabsContent className="flex-1 min-h-[300px] flex flex-col mt-0" key={i} value={comp.value}>{comp.elem}</TabsContent>
                })
      }
    </Tabs>
    );
}

export default TabComponent;