export type CommissionTier={from:number;to?:number|null;rate:number};
export type GPFactorTier={from:number;to?:number|null;factor:number};

export function tierRate(achievement:number,tiers:CommissionTier[]){
 const match=tiers.find(t=>achievement>=t.from&&(t.to==null||achievement<t.to));
 return match?.rate??0;
}
export function gpFactor(gpPct:number,tiers:GPFactorTier[]){
 const match=tiers.find(t=>gpPct>=t.from&&(t.to==null||gpPct<t.to));
 return match?.factor??0;
}
export function kpiBonus(score:number){
 if(score>=95)return 2000;if(score>=90)return 1500;if(score>=80)return 1000;if(score>=70)return 500;return 0;
}
export function calculateCommission(input:{netSales:number;target:number;gp:number;kpiScore:number;collectionPct:number;tiers:CommissionTier[];gpTiers:GPFactorTier[]}){
 const achievement=input.target>0?input.netSales/input.target:0;
 const gpPct=input.netSales>0?input.gp/input.netSales:0;
 const rate=tierRate(achievement,input.tiers);const factor=gpFactor(gpPct,input.gpTiers);
 const baseCommission=input.netSales*rate;const finalCommission=baseCommission*factor;const bonus=kpiBonus(input.kpiScore);
 return {achievement,gpPct,rate,factor,baseCommission,finalCommission,kpiBonus:bonus,collectionGate:input.collectionPct<1?'review':'ok',totalVariable:finalCommission+bonus};
}
