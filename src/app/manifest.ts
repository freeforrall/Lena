import { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {name:"The Shared Space",short_name:"Shared Space",start_url:"/",display:"standalone",background_color:"#171321",theme_color:"#171321",icons:[]};
}