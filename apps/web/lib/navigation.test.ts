import {describe,expect,it} from 'vitest';
import {navGroups} from '@/lib/navigation';

describe('SalesOS navigation',()=>{
  it('contains all major workstreams',()=>{
    const ids=navGroups.flatMap(g=>g.items.map(x=>x.id));
    expect(ids).toEqual(expect.arrayContaining(['sales','accounts','contacts','leads','deals','pipeline','calendar','activities','tasks','collections','targets','products','regions','teams','reps','kpi','performance','payroll','finance','hr','reports','alerts','brief','assistant','import','extensions','settings']));
  });
  it('has unique ids',()=>{
    const ids=navGroups.flatMap(g=>g.items.map(x=>x.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
