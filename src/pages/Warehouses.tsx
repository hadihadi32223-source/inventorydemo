import { useEffect, useMemo, useState } from 'react';
import { Plus, Printer, FileDown, Edit, Eye, Power, Trash2 } from 'lucide-react';
import Toolbar from '../components/Toolbar';
import SearchBox from '../components/SearchBox';
import DataGrid from '../components/DataGrid';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';
import { detailsMessage, disabledMessage, exportCsv, hardDeletedMessage, safePrint } from '../lib/uiActions';

interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string;
  manager: string;
  status: string;
}

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Warehouse | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      setWarehouses(await api.warehouses());
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return warehouses.filter((w) =>
      !q || w.name.toLowerCase().includes(q) || w.code.toLowerCase().includes(q) || w.location.toLowerCase().includes(q)
    );
  }, [warehouses, search]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      if (editing) await api.updateWarehouse({ ...body, id: editing.id });
      else await api.createWarehouse(body);
      setShowForm(false);
      setEditing(null);
      fetch();
    } catch (err) { alert((err as Error).message); }
  };

  const columns = [
    { key: 'code', header: 'كود المستودع', width: '120px' },
    { key: 'name', header: 'اسم المستودع', width: '220px' },
    { key: 'location', header: 'الموقع', width: '220px' },
    { key: 'manager', header: 'المدير', width: '160px' },
    { key: 'status', header: 'الحالة', width: '100px', render: (row: Warehouse) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'إجراءات',
      width: '170px',
      render: (row: Warehouse) => (
        <div className="flex items-center gap-1">
          <button onClick={() => detailsMessage('بيانات المستودع', `${row.name}\nالكود: ${row.code}\nالموقع: ${row.location}`)} className="p-1 rounded hover:bg-slate-100 text-slate-600" title="عرض"><Eye className="w-4 h-4" /></button>
          <button onClick={() => { setEditing(row); setShowForm(true); }} className="p-1 rounded hover:bg-blue-50 text-blue-600" title="تعديل"><Edit className="w-4 h-4" /></button>
          <button onClick={() => { if (window.confirm('هل تريد تعطيل هذا المستودع؟')) void api.deleteWarehouse(row.id).then(() => { disabledMessage(); return fetch(); }); }} className="p-1 rounded hover:bg-orange-50 text-orange-600" title="تعطيل"><Power className="w-4 h-4" /></button>
          <button onClick={() => { if (window.confirm('هل تريد حذف هذا المستودع نهائيًا من النسخة المحلية؟')) void api.hardDeleteWarehouse(row.id).then(() => { hardDeletedMessage(); return fetch(); }); }} className="p-1 rounded hover:bg-red-50 text-red-600" title="حذف"><Trash2 className="w-4 h-4" /></button>
          <button onClick={() => safePrint(`إدارة المستودعات`)} className="p-1 rounded hover:bg-slate-100 text-slate-600" title="طباعة"><Printer className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Toolbar title="إدارة المستودعات">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded">
          <Plus className="w-4 h-4" />مستودع جديد
        </button>
        <button onClick={() => safePrint('إدارة المستودعات')} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded hover:bg-slate-50"><Printer className="w-4 h-4" />طباعة</button>
        <button onClick={() => exportCsv('إدارة المستودعات', filtered as unknown as Record<string, unknown>[])} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded hover:bg-slate-50"><FileDown className="w-4 h-4" />تصدير</button>
      </Toolbar>

      <div className="bg-white border border-slate-200 rounded shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <SearchBox value={search} onChange={setSearch} placeholder="بحث باسم أو كود المستودع" />
          <div className="mr-auto text-xs text-slate-500">عدد التسجيلات: <span className="font-bold text-slate-700">{filtered.length}</span></div>
        </div>
        <DataGrid columns={columns} data={filtered} loading={loading} />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{editing ? 'تعديل مستودع' : 'مستودع جديد'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">كود المستودع</label>
                  <input name="code" defaultValue={editing?.code} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">اسم المستودع</label>
                  <input name="name" defaultValue={editing?.name} required className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">الموقع</label>
                <input name="location" defaultValue={editing?.location} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">المدير</label>
                  <input name="manager" defaultValue={editing?.manager} className="w-full border border-slate-300 rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">الحالة</label>
                  <select name="status" defaultValue={editing?.status || 'active'} className="w-full border border-slate-300 rounded px-3 py-2 text-sm">
                    <option value="active">مفعّل</option>
                    <option value="inactive">معطّل</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-slate-300 rounded text-sm hover:bg-slate-50">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded text-sm hover:bg-teal-700">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
