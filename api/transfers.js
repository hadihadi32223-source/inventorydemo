import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('transfers').select('*').order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { items, ...header } = req.body;
      const { data: doc, error: docError } = await supabase.from('transfers').insert(header).select().single();
      if (docError) throw docError;

      if (items && items.length > 0) {
        const detailRows = items.map((it) => ({ ...it, transfer_id: doc.id }));
        const { error: itemsError } = await supabase.from('transfer_items').insert(detailRows);
        if (itemsError) throw itemsError;
      }
      return res.status(201).json({ ...doc, items: items || [] });
    }
    if (req.method === 'PUT') {
      const { id, ...rest } = req.body;
      const { data, error } = await supabase.from('transfers').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      await supabase.from('transfer_items').delete().eq('transfer_id', id);
      const { error } = await supabase.from('transfers').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
