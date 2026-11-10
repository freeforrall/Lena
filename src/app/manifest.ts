import type { MetadataRoute } from 'next';
export default function manifest():MetadataRoute.Manifest { return {name:'The Shared Space',short_name:'Shared Space',start_url:'/',display:'standalone',background_color:'#f6f4f8',theme_color:'#211a2d',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]}; }
