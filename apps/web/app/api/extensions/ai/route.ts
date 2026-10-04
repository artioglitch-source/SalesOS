import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/server';
import {z} from 'zod';

const schema=z.object({idea:z.string().min(3).max(2000),locale:z.enum(['ar','en']).default('ar')});
const starters=[
 {match:/theme|style|ثيم|نمط/i,kind:'theme',manifest:{kind:'theme',slot:'app-shell',style:'ocean'}},
 {match:/metric|kpi|مؤشر|بطاق/i,kind:'metric',manifest:{kind:'metric',slot:'dashboard',source:'v_monthly_trend',metric:'sales'}},
 {match:/shortcut|button|اختصار|زر/i,kind:'shortcut',manifest:{kind:'shortcut',slot:'quick-add',label:'New shortcut',href:'/reports'}},
 {match:/automat|notify|تنبيه|أتمت/i,kind:'automation',manifest:{kind:'automation',trigger:'invoice.overdue',actions:[{type:'notify'}]}}
];

function parseJson(text:string){
 const a=text.indexOf('{'),b=text.lastIndexOf('}');
 if(a<0||b<a)throw new Error('AI did not return a valid extension manifest');
 return JSON.parse(text.slice(a,b+1));
}

export async function POST(req:Request){
 const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Idea is required'},{status:400});
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data:m}=await s.from('org_members').select('org_id,role').eq('user_id',user.id).eq('status','active').limit(1).maybeSingle();
 if(!m||!['owner_admin','sales_manager'].includes(m.role))return NextResponse.json({error:'Manager permission required'},{status:403});

 const key=process.env.GEMINI_API_KEY;
 const model=(process.env.GEMINI_MODEL||'gemini-3.8-flash').replace(/^models\//,'');
 const base=(process.env.GEMINI_BASE_URL||'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/,'');

 if(key){
  try{
   const ar=parsed.data.locale==='ar';
   const instructions=ar
    ?'أنشئ manifest واحداً آمناً لامتداد SalesOS بصيغة JSON فقط. لا تستخدم JavaScript أو HTML أو أوامر تنفيذية أو روابط خارجية. المفاتيح المسموحة: kind, slot, style, source, metric, trigger, actions, label, href, columns, filters, description.'
    :'Create one safe SalesOS extension manifest as JSON only. Do not include JavaScript, HTML, executable commands, or external URLs. Allowed keys: kind, slot, style, source, metric, trigger, actions, label, href, columns, filters, description.';
   const resp=await fetch(base+'/models/'+encodeURIComponent(model)+':generateContent',{method:'POST',headers:{'content-type':'application/json','x-goog-api-key':key},body:JSON.stringify({
    system_instruction:{parts:[{text:instructions}]},
    contents:[{role:'user',parts:[{text:parsed.data.idea}]}],
    generationConfig:{temperature:0.1,maxOutputTokens:700}
   })});
   const raw=await resp.text();const data=raw?JSON.parse(raw):{};
   if(!resp.ok)throw new Error(data?.error?.message||'Gemini extension builder failed');
   const text=String(data?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||'').join('')||'');
   return NextResponse.json({mode:'real',name:'AI extension',manifest:parseJson(text)});
  }catch(error){
   const starter=starters.find(x=>x.match.test(parsed.data.idea))||starters[3];
   return NextResponse.json({mode:'local',name:'SalesOS '+starter.kind+' extension',manifest:{...starter.manifest,description:parsed.data.idea,generated:'local',ai_error:error instanceof Error?error.message:'AI unavailable'}});
  }
 }

 const starter=starters.find(x=>x.match.test(parsed.data.idea))||starters[3];
 return NextResponse.json({mode:'local',name:'SalesOS '+starter.kind+' extension',manifest:{...starter.manifest,description:parsed.data.idea,generated:'local'}});
}