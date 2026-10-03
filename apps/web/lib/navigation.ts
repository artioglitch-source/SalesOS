export type NavGroup={label:string;items:Array<{id:string;href:string;ar:string;en:string;icon:string}>};

export const navGroups:NavGroup[]=[
 {label:'workspace',items:[
  {id:'home',href:'/',ar:'اليوم',en:'Today',icon:'home'},
  {id:'sales',href:'/sales',ar:'المبيعات',en:'Sales',icon:'receipt'},
  {id:'accounts',href:'/accounts',ar:'الحسابات',en:'Customers',icon:'building'},
  {id:'contacts',href:'/contacts',ar:'جهات الاتصال',en:'Contacts',icon:'users'},
  {id:'leads',href:'/leads',ar:'العملاء المحتملون',en:'Leads',icon:'target'},
  {id:'deals',href:'/deals',ar:'الفرص',en:'Deals',icon:'briefcase'},
  {id:'pipeline',href:'/pipeline',ar:'خط المبيعات',en:'Pipeline',icon:'kanban'},
 ]},
 {label:'operations',items:[
  {id:'activities',href:'/activities',ar:'الزيارات والمتابعة',en:'Activities',icon:'activity'},
  {id:'tasks',href:'/tasks',ar:'المهام',en:'Tasks',icon:'check'},
  {id:'collections',href:'/collections',ar:'التحصيل',en:'Collections',icon:'wallet'},
  {id:'targets',href:'/targets',ar:'الأهداف',en:'Targets',icon:'gauge'},
  {id:'products',href:'/products',ar:'المنتجات',en:'Products',icon:'package'},
  {id:'regions',href:'/regions',ar:'المناطق',en:'Regions',icon:'map'},
  {id:'teams',href:'/teams',ar:'الفرق',en:'Teams',icon:'layers'},
  {id:'reps',href:'/reps',ar:'المندوبون',en:'Reps',icon:'user-check'},
 ]},
 {label:'people & finance',items:[
  {id:'kpi',href:'/kpi',ar:'KPI',en:'KPI',icon:'sparkles'},
  {id:'performance',href:'/performance',ar:'الأداء',en:'Performance',icon:'chart'},
  {id:'payroll',href:'/payroll',ar:'الرواتب والعمولات',en:'Payroll',icon:'coins'},
  {id:'finance',href:'/finance',ar:'المالية',en:'Finance',icon:'landmark'},
  {id:'hr',href:'/hr',ar:'الموارد البشرية',en:'HR',icon:'id'},
 ]},
 {label:'insights & platform',items:[
  {id:'reports',href:'/reports',ar:'التقارير',en:'Reports',icon:'report'},
  {id:'alerts',href:'/alerts',ar:'التنبيهات',en:'Alerts',icon:'bell'},
  {id:'brief',href:'/brief',ar:'موجز اليوم',en:'Daily Brief',icon:'sparkles'},
  {id:'assistant',href:'/assistant',ar:'المساعد',en:'Assistant',icon:'bot'},
  {id:'import',href:'/import',ar:'استيراد البيانات',en:'Import',icon:'upload'},
  {id:'extensions',href:'/extensions',ar:'الامتدادات',en:'Extensions',icon:'plug'},
  {id:'settings',href:'/settings',ar:'الإعدادات',en:'Settings',icon:'settings'},
 ]}
];
