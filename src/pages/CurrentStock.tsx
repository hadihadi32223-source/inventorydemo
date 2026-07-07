import { useEffect, useMemo, useState } from 'react';
import { FileDown, Filter, Printer, Warehouse } from 'lucide-react';
import Toolbar from '../components/Toolbar';
import SearchBox from '../components/SearchBox';
import DataGrid from '../components/DataGrid';
import StatusBadge from '../components/StatusBadge';
import { api } from '../lib/api';
import { exportCsv, safePrint } from '../lib/uiActions';

type StockRow = {
  id: number;
  item_name: string;
  sku: string;
  barcode: string;
  warehouse: string;
  location: string;
  batch_number: string;
  serial_number: string;
  expiry_date: string;
  qty_available: number;
  qty_reserved: number;
  qty_in_transit: number;
  qty_damaged: number;
  last_movement_at: string;
  status: string;
};

export default function CurrentStock() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.currentStock().then((data) => setRows(data)).finally(() => setLoading(false));
  }, []);

  const warehouses = useMemo(() => Array.from(new Set(rows.map((row) => row.warehouse))), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !q || [row.item_name, row.sku, row.barcode, row.location, row.batch_number, row.serial_number]
        .some((value) => String(value || '').toLowerCase().includes(q));
      const matchesWarehouse = !warehouse || row.warehouse === warehouse;
      const matchesStatus = !status || row.status === status;
      return matchesSearch && matchesWarehouse && matchesStatus;
    });
  }, [rows, search, warehouse, status]);

  const totalAvailable = filtered.reduce((sum, row) => sum + Number(row.qty_available || 0), 0);

  const columns = [
    { key: 'item_name', header: 'الصنف', width: '220px' },
    { key: 'sku', header: 'SKU', width: '110px' },
    { key: 'barcode', header: 'Barcode', width: '130px' },
    { key: 'warehouse', header: 'المستودع', width: '160px' },
    { key: 'location', header: 'الموقع', width: '220px' },
    { key: 'batch_number', header: 'Batch', width: '120px' },
    { key: 'serial_number', header: 'Serial', width: '120px' },
    { key: 'expiry_date', header: 'تاريخ الانتهاء', width: '120px' },
    { key: 'qty_available', header: 'المتاح', width: '90px' },
    { key: 'qty_reserved', header: 'المحجوز', width: '90px' },
    { key: 'qty_in_transit', header: 'قيد النقل', width: '90px' },
    { key: 'qty_damaged', header: 'التالف', width: '90px' },
    { key: 'last_movement_at', header: 'آخر حركة', width: '120px' },
    { key: 'status', header: 'الحالة', width: '100px', render: (row: StockRow) => <StatusBadge status={row.status} label={row.status === 'warning' ? 'تحت الحد' : row.status === 'danger' ? 'خطر' : undefined} /> },
  ];

  return (
    <div className="space-y-4">
      <Toolbar title="المخزون الحالي">
        <button onClick={() => safePrint('المخزون الحالي')} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded hover:bg-slate-50"><Printer className="w-4 h-4" />طباعة</button>
        <button onClick={() => exportCsv('المخزون-الحالي', filtered as unknown as Record<string, unknown>[])} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 bg-white text-slate-700 text-sm font-medium rounded hover:bg-slate-50"><FileDown className="w-4 h-4" />تصدير</button>
      </Toolbar>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="text-xs text-slate-500">إجمالي الكمية المتاحة في النتائج</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{totalAvailable}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="text-xs text-slate-500">عدد المواقع المعروضة</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{filtered.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex items-center gap-3">
          <Warehouse className="w-8 h-8 text-teal-600" />
          <div className="text-xs text-slate-500 leading-relaxed">هذه الشاشة للعرض فقط. لا يمكن تعديل الكمية إلا من خلال مستند معتمد يولّد حركة مخزون.</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <SearchBox value={search} onChange={setSearch} placeholder="بحث بالصنف، SKU، Barcode، Batch، Serial أو الموقع" />
          <Filter className="w-4 h-4 text-slate-400" />
          <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 bg-white text-sm">
            <option value="">جميع المستودعات</option>
            {warehouses.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 bg-white text-sm">
            <option value="">جميع الحالات</option>
            <option value="active">طبيعي</option>
            <option value="warning">تحت الحد</option>
            <option value="danger">خطر</option>
          </select>
          <div className="mr-auto text-xs text-slate-500">عدد السجلات: <span className="font-bold text-slate-700">{filtered.length}</span></div>
        </div>
        <DataGrid columns={columns} data={filtered} loading={loading} />
      </div>
    </div>
  );
}
