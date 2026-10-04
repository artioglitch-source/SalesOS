export type Locale='ar'|'en';
export function safeLocale(locale:string|null|undefined):Locale{return locale==='en'?'en':'ar'}
export function localizedPath(locale:string|null|undefined,path:string){const clean=path.startsWith('/')?path:'/'+path;return '/'+safeLocale(locale)+(clean==='/'?'':clean)}