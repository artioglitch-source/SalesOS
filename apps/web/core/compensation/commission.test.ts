import {describe,expect,it} from 'vitest';
import {calculateCommission,gpFactor,kpiBonus,tierRate} from './commission';

const tiers=[{from:0,to:.7,rate:0},{from:.7,to:.8,rate:.0025},{from:.8,to:.9,rate:.004},{from:.9,to:1,rate:.006},{from:1,to:1.1,rate:.008},{from:1.1,to:1.2,rate:.01},{from:1.2,rate:.012}];
const gp=[{from:0,to:.1,factor:0},{from:.1,to:.15,factor:.85},{from:.15,to:.2,factor:1},{from:.2,factor:1.1}];

describe('commission engine',()=>{
 it('matches tier boundaries',()=>{expect(tierRate(.7,tiers)).toBe(.0025);expect(tierRate(.8,tiers)).toBe(.004);expect(tierRate(1,tiers)).toBe(.008);expect(tierRate(1.2,tiers)).toBe(.012)});
 it('matches GP factors',()=>{expect(gpFactor(.0999,gp)).toBe(0);expect(gpFactor(.1,gp)).toBe(.85);expect(gpFactor(.15,gp)).toBe(1);expect(gpFactor(.2,gp)).toBe(1.1)});
 it('matches KPI bonus boundaries',()=>{expect(kpiBonus(69.99)).toBe(0);expect(kpiBonus(70)).toBe(500);expect(kpiBonus(80)).toBe(1000);expect(kpiBonus(90)).toBe(1500);expect(kpiBonus(95)).toBe(2000)});
 it('calculates a 90% attainment example',()=>{const r=calculateCommission({netSales:450000,target:500000,gp:90000,kpiScore:90,collectionPct:1,tiers,gpTiers:gp});expect(r.achievement).toBe(.9);expect(r.rate).toBe(.006);expect(r.finalCommission).toBe(2970);expect(r.kpiBonus).toBe(1500)});
});
