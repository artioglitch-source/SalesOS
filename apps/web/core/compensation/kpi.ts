export type KPIMetricInput={actual:number;target:number;weight:number;cap:number};
export function metricScore({actual,target,weight,cap}:KPIMetricInput){
 if(target<=0)return 0;
 return Math.min(actual/target,cap)*weight;
}
export function totalKpiScore(metrics:KPIMetricInput[]){return metrics.reduce((sum,m)=>sum+metricScore(m),0)}
export function kpiBand(score:number,bands={excellent:90,very_good:80,needs_development:70}){
 if(score>=bands.excellent)return 'Excellent';
 if(score>=bands.very_good)return 'Very Good';
 if(score>=bands.needs_development)return 'Needs Development';
 return 'Improvement Plan';
}
