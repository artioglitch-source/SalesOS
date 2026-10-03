import {NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {createClient} from '@/lib/supabase/server';

function hash(value:string){return createHash('sha256').update(value).digest('hex')}
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'x-api-key, content-type','Access-Control-Allow-Methods':'GET, OPTIONS'};

export async function OPTIONS(){return new NextResponse(null,{status:204,headers:cors})}
export async function GET(request:Request){
 const key=request.headers.get('x-api-key');if(!key)return NextResponse.json({error:'x-api-key required'},{status:401,headers:cors});
 const supabase=await createClient();const url=new URL(request.url);const limit=Math.min(100,Math.max(1,Number(url.searchParams.get('limit')||50)));const offset=Math.max(0,Number(url.searchParams.get('offset')||0));
 const {data,error}=await supabase.rpc('api_list_accounts',{p_key_hash:hash(key),p_limit:limit,p_offset:offset});
 if(error)return NextResponse.json({error:error.message},{status:401,headers:cors});
 return NextResponse.json({data:data||[],limit,offset},{headers:cors});
}
