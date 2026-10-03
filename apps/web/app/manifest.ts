import type {MetadataRoute} from 'next';

export default function manifest():MetadataRoute.Manifest{
 return {
  name:'SalesOS',
  short_name:'SalesOS',
  description:'Sales and operations workspace',
  start_url:'/ar',
  display:'standalone',
  background_color:'#0a0a0a',
  theme_color:'#0a0a0a',
  lang:'ar',
  dir:'rtl',
  icons:[]
 };
}
