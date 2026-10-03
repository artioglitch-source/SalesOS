import {describe,expect,it} from 'vitest';
import {kpiBand,metricScore,totalKpiScore} from './kpi';

describe('KPI engine',()=>{
 it('caps each metric before applying weight',()=>{expect(metricScore({actual:120,target:100,weight:40,cap:1})).toBe(40);});
 it('produces weighted totals',()=>{expect(totalKpiScore([{actual:90,target:100,weight:40,cap:1},{actual:1,target:1,weight:15,cap:1}])).toBe(51)});
 it('uses configured bands',()=>{expect(kpiBand(90)).toBe('Excellent');expect(kpiBand(80)).toBe('Very Good');expect(kpiBand(70)).toBe('Needs Development');expect(kpiBand(69.9)).toBe('Improvement Plan')});
});
