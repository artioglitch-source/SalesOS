'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, PackagePlus, Search, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/browser';
import { useOrg } from '@/lib/org/context';
import { Card, EmptyState, PageHeader, StatusPill } from '@/components/ui/primitives';

type ProductForm = {
  sku: string;
  code: string;
  name: string;
  description: string;
  unit_price: string;
  cost_price: string;
  tax_rate: string;
  unit: string;
  group_id: string;
};

export function CatalogPage({ locale }: { locale: 'ar' | 'en' }) {
  const ar = locale === 'ar';
  const supabase = useMemo(() => createClient() as any, []);
  const { activeOrgId, role } = useOrg();
  const privileged = ['owner_admin', 'sales_manager', 'supervisor', 'accountant_hr'].includes(role ?? '');

  const [rows, setRows] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProductForm>({
    sku: '',
    code: '',
    name: '',
    description: '',
    unit_price: '0',
    cost_price: '0',
    tax_rate: '0',
    unit: 'piece',
    group_id: '',
  });

  async function load() {
    if (!activeOrgId) return;

    const productQuery = privileged
      ? supabase.from('products').select('*').eq('org_id', activeOrgId).order('name')
      : supabase.from('v_products_catalog').select('*').eq('org_id', activeOrgId).order('name');

    const [products, productGroups] = await Promise.all([
      productQuery,
      supabase.from('product_groups').select('id,name').eq('org_id', activeOrgId).order('name'),
    ]);

    setRows(products.data ?? []);
    setGroups(productGroups.data ?? []);
  }

  useEffect(() => {
    void load();
  }, [activeOrgId, privileged, supabase]);

  const filtered = rows.filter((row) =>
    [row.name, row.sku, row.code].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase()),
  );

  async function save() {
    if (!activeOrgId || !form.name.trim()) return;

    setError('');

    const payload: Record<string, unknown> = {
      org_id: activeOrgId,
      sku: form.sku || null,
      code: form.code || null,
      name: form.name.trim(),
      description: form.description || null,
      unit_price: Number(form.unit_price || 0),
      tax_rate: Number(form.tax_rate || 0),
      unit: form.unit || 'piece',
      group_id: form.group_id || null,
      active: true,
    };

    if (privileged) {
      payload.cost_price = Number(form.cost_price || 0);
    }

    const result = await supabase.from('products').insert(payload);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setOpen(false);
    setForm({
      sku: '',
      code: '',
      name: '',
      description: '',
      unit_price: '0',
      cost_price: '0',
      tax_rate: '0',
      unit: 'piece',
      group_id: '',
    });
    await load();
  }

  async function toggle(row: any) {
    if (!privileged || !activeOrgId) return;

    await supabase
      .from('products')
      .update({ active: !row.active })
      .eq('id', row.id)
      .eq('org_id', activeOrgId);

    await load();
  }

  return (
    <section className="space-y-6 p-4 md:p-7">
      <PageHeader
        eyebrow={ar ? 'الكتالوج' : 'Catalog'}
        title={ar ? 'المنتجات' : 'Products'}
        description={
          ar
            ? 'كتالوج موحد للأسعار والمنتجات مع إبقاء التكلفة محمية للأدوار المصرح بها.'
            : 'One catalog for selling prices, with cost protected for authorized roles.'
        }
        actions={
          privileged ? (
            <button
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-3 py-2.5 text-sm text-white dark:bg-white dark:text-neutral-950"
            >
              <PackagePlus className="size-4" />
              {ar ? 'منتج جديد' : 'New product'}
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs text-neutral-500">
              <ShieldCheck className="size-4" />
              {ar ? 'الوصول للكتالوج فقط' : 'Catalog access only'}
            </span>
          )
        }
      />

      {open && privileged && (
        <Card className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU" className="rounded-xl border px-3 py-2.5" />
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Code" className="rounded-xl border px-3 py-2.5" />
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={ar ? 'اسم المنتج' : 'Product name'} className="rounded-xl border px-3 py-2.5 lg:col-span-2" />
            <input type="number" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} placeholder={ar ? 'سعر البيع' : 'Unit price'} className="rounded-xl border px-3 py-2.5" />
            <input type="number" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} placeholder={ar ? 'التكلفة' : 'Cost'} className="rounded-xl border px-3 py-2.5" />
            <input type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} placeholder="Tax %" className="rounded-xl border px-3 py-2.5" />
            <select value={form.group_id} onChange={(e) => setForm({ ...form, group_id: e.target.value })} className="rounded-xl border bg-transparent px-3 py-2.5">
              <option value="">{ar ? 'مجموعة المنتج' : 'Product group'}</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={ar ? 'الوصف' : 'Description'} className="mt-3 w-full rounded-xl border px-3 py-2.5" />
          <div className="mt-3 flex items-center gap-2">
            <button onClick={save} className="rounded-xl bg-neutral-950 px-4 py-2.5 text-sm text-white dark:bg-white dark:text-neutral-950">
              {ar ? 'حفظ' : 'Save product'}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute start-3 top-3 size-4 text-neutral-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ar ? 'ابحث بالاسم أو SKU' : 'Search name or SKU'} className="w-full rounded-xl border bg-white py-2.5 ps-9 pe-3 text-sm dark:border-neutral-800 dark:bg-neutral-900" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
              <tr>
                <th className="px-4 py-3 text-start">Product</th>
                <th className="px-4 py-3 text-start">SKU</th>
                <th className="px-4 py-3 text-start">Group</th>
                <th className="px-4 py-3 text-start">Price</th>
                {privileged && <th className="px-4 py-3 text-start">Cost</th>}
                <th className="px-4 py-3 text-start">Status</th>
                {privileged && <th className="px-4 py-3 text-end" />}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3"><div className="font-medium">{row.name}</div><div className="mt-1 text-xs text-neutral-500">{row.description || '—'}</div></td>
                  <td className="px-4 py-3 font-mono text-xs">{row.sku || row.code || '—'}</td>
                  <td className="px-4 py-3">{groups.find((group) => group.id === row.group_id)?.name || '—'}</td>
                  <td className="px-4 py-3 tabular-nums">{Number(row.unit_price || 0).toLocaleString()} EGP</td>
                  {privileged && <td className="px-4 py-3 tabular-nums">{Number(row.cost_price || 0).toLocaleString()} EGP</td>}
                  <td className="px-4 py-3"><StatusPill status={row.active ? 'active' : 'inactive'} /></td>
                  {privileged && <td className="px-4 py-3 text-end"><button onClick={() => toggle(row)} className="rounded-lg border p-2" title={row.active ? 'Deactivate' : 'Activate'}>{row.active ? <ToggleRight className="size-4" /> : <ToggleLeft className="size-4" />}</button></td>}
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <EmptyState
              title={ar ? 'لا توجد منتجات' : 'No products'}
              description={ar ? 'أضف المنتجات والأسعار لتفعيل البيع السريع وعروض الأسعار.' : 'Add products and prices to power quick sales and quotes.'}
            />
          )}
        </div>
      </Card>

      <p className="flex items-center gap-2 text-xs text-neutral-500">
        <Box className="size-3.5" />
        {ar ? 'التكلفة وهامش الربح يظلان محميين من أدوار البيع الأمامية.' : 'Cost and gross profit remain protected from frontline sales roles.'}
      </p>
    </section>
  );
}
