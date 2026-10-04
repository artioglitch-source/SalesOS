import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
import {supabasePublishableKey,supabaseUrl} from '@/lib/supabase/config';

export async function proxy(request:NextRequest){
  let response=NextResponse.next({request});
  const supabase=createServerClient(supabaseUrl,supabasePublishableKey,{cookies:{
    getAll:()=>request.cookies.getAll(),
    setAll:(cookiesToSet)=>{
      cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));
      response=NextResponse.next({request});
      cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options));
    },
  }});
  const pathname=request.nextUrl.pathname;

  // API routes are already server-routed and must never be localized.
  if(pathname.startsWith('/api/')) return response;

  await supabase.auth.getUser();

  if(pathname==='/'||pathname==='')return NextResponse.redirect(new URL('/ar',request.url));

  // Backward compatibility for the broken generated link /ar/undefined/...
  const legacy=pathname.match(/^\/(ar|en)\/undefined(?:\/(.*))?$/);
  if(legacy){
    return NextResponse.redirect(new URL('/'+legacy[1]+(legacy[2]?'/'+legacy[2]:''),request.url));
  }

  if(!/^\/(ar|en)(\/|$)/.test(pathname)){
    return NextResponse.redirect(new URL('/ar'+(pathname==='/'?'':pathname),request.url));
  }

  return response;
}

export const config={matcher:['/((?!_next|favicon.ico|.*\\..*).*)']};