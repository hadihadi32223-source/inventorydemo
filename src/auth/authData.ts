export type RoleKey = 'admin' | 'manager' | 'storekeeper' | 'data_entry' | 'readonly';

export type AuthUser = {
  id: number;
  full_name: string;
  username: string;
  role: RoleKey;
  role_name: string;
  status: 'active' | 'inactive' | 'locked';
  password_hash: string;
  last_login_at?: string;
  created_at?: string;
};

export type RoleDefinition = {
  key: RoleKey;
  name: string;
  description: string;
};

export type PermissionDefinition = {
  code: string;
  nameAr: string;
  module: string;
  description: string;
};

const USERS_KEY = 'arabic_wms_auth_users';
const CURRENT_USER_KEY = 'arabic_wms_current_user';
const ROLE_PERMISSIONS_KEY = 'arabic_wms_role_permissions';

export const roleDefinitions: RoleDefinition[] = [
  { key: 'admin', name: 'مدير النظام', description: 'صلاحيات كاملة على النظام' },
  { key: 'manager', name: 'مدير المستودع', description: 'اعتماد العمليات المخزنية ومراقبة التقارير' },
  { key: 'storekeeper', name: 'أمين المستودع', description: 'إنشاء مستندات الوارد والصادر والتحويل والجرد كمسودات' },
  { key: 'data_entry', name: 'موظف إدخال', description: 'إدارة البيانات الأساسية وإنشاء المسودات دون اعتماد' },
  { key: 'readonly', name: 'قراءة فقط', description: 'عرض البيانات والتقارير دون تعديل' },
];

export const permissionDefinitions: PermissionDefinition[] = [
  { code: 'Dashboard.View', nameAr: 'عرض لوحة التحكم', module: 'الرئيسية', description: 'الدخول إلى لوحة التحكم' },
  { code: 'Items.View', nameAr: 'عرض الأصناف', module: 'الأصناف', description: 'عرض قائمة الأصناف وبياناتها' },
  { code: 'Items.Create', nameAr: 'إضافة صنف', module: 'الأصناف', description: 'إضافة أصناف جديدة' },
  { code: 'Items.Edit', nameAr: 'تعديل صنف', module: 'الأصناف', description: 'تعديل بيانات الأصناف' },
  { code: 'Items.Disable', nameAr: 'تعطيل صنف', module: 'الأصناف', description: 'تعطيل صنف بدل الحذف' },
  { code: 'MasterData.View', nameAr: 'عرض البيانات الأساسية', module: 'البيانات الأساسية', description: 'عرض التصنيفات والوحدات والموردين والجهات' },
  { code: 'MasterData.Manage', nameAr: 'إدارة البيانات الأساسية', module: 'البيانات الأساسية', description: 'إضافة وتعديل وتعطيل البيانات الأساسية' },
  { code: 'Warehouses.View', nameAr: 'عرض المستودعات', module: 'المستودعات', description: 'عرض المستودعات ومواقع التخزين' },
  { code: 'Warehouses.Create', nameAr: 'إضافة مستودع', module: 'المستودعات', description: 'إضافة مستودعات جديدة' },
  { code: 'Locations.View', nameAr: 'عرض مواقع التخزين', module: 'مواقع التخزين', description: 'عرض المواقع والأرفف والخانات' },
  { code: 'Locations.Create', nameAr: 'إضافة موقع تخزين', module: 'مواقع التخزين', description: 'إضافة مواقع تخزين جديدة' },
  { code: 'Stock.View', nameAr: 'عرض المخزون الحالي', module: 'المخزون', description: 'عرض الكميات الحالية' },
  { code: 'StockMovements.View', nameAr: 'عرض حركات المخزون', module: 'المخزون', description: 'عرض سجل الحركات' },
  { code: 'LowStock.View', nameAr: 'عرض تنبيهات الحد الأدنى', module: 'المخزون', description: 'عرض الأصناف تحت الحد الأدنى واقتراح إعادة التوريد' },
  { code: 'Inbound.View', nameAr: 'عرض الوارد', module: 'الوارد', description: 'عرض مستندات الوارد' },
  { code: 'Inbound.Create', nameAr: 'إنشاء وارد', module: 'الوارد', description: 'إنشاء مستند وارد كمسودة' },
  { code: 'Inbound.Approve', nameAr: 'اعتماد وارد', module: 'الوارد', description: 'اعتماد مستند وارد وتحديث المخزون' },
  { code: 'Inbound.Cancel', nameAr: 'إلغاء وارد', module: 'الوارد', description: 'إلغاء مستند وارد وفق قواعد النظام' },
  { code: 'Outbound.View', nameAr: 'عرض الصادر', module: 'الصادر', description: 'عرض مستندات الصادر' },
  { code: 'Outbound.Create', nameAr: 'إنشاء صادر', module: 'الصادر', description: 'إنشاء مستند صادر كمسودة' },
  { code: 'Outbound.Approve', nameAr: 'اعتماد صادر', module: 'الصادر', description: 'اعتماد مستند صادر بعد التحقق من الكمية' },
  { code: 'Outbound.Cancel', nameAr: 'إلغاء صادر', module: 'الصادر', description: 'إلغاء مستند صادر وفق قواعد النظام' },
  { code: 'Transfer.View', nameAr: 'عرض التحويلات', module: 'التحويلات', description: 'عرض تحويلات المستودعات' },
  { code: 'Transfer.Create', nameAr: 'إنشاء تحويل', module: 'التحويلات', description: 'إنشاء تحويل بين المستودعات' },
  { code: 'Transfer.Approve', nameAr: 'اعتماد تحويل', module: 'التحويلات', description: 'اعتماد التحويل وتوليد حركتي مخزون' },
  { code: 'Transfer.Cancel', nameAr: 'إلغاء تحويل', module: 'التحويلات', description: 'إلغاء التحويل وفق الصلاحيات' },
  { code: 'InventoryCount.View', nameAr: 'عرض الجرد', module: 'الجرد', description: 'عرض عمليات الجرد' },
  { code: 'InventoryCount.Create', nameAr: 'إنشاء جرد', module: 'الجرد', description: 'إنشاء جلسة جرد' },
  { code: 'InventoryCount.Approve', nameAr: 'اعتماد جرد', module: 'الجرد', description: 'اعتماد فروقات الجرد وتحديث المخزون' },
  { code: 'Barcode.View', nameAr: 'عرض الباركود', module: 'الباركود', description: 'عرض وطباعة ملصقات الباركود' },
  { code: 'Barcode.Manage', nameAr: 'إدارة الباركود', module: 'الباركود', description: 'إنشاء وطباعة ملصقات' },
  { code: 'Reports.View', nameAr: 'عرض التقارير', module: 'التقارير', description: 'عرض وطباعة وتصدير التقارير' },
  { code: 'Users.Manage', nameAr: 'إدارة المستخدمين', module: 'الإدارة', description: 'إضافة وتعطيل المستخدمين وتغيير أدوارهم' },
  { code: 'Permissions.Manage', nameAr: 'إدارة الصلاحيات', module: 'الإدارة', description: 'تعديل صلاحيات الأدوار' },
  { code: 'AuditLog.View', nameAr: 'عرض سجل النشاط', module: 'الإدارة', description: 'عرض سجل النشاط والتتبع' },
  { code: 'Settings.Manage', nameAr: 'إدارة الإعدادات', module: 'الإعدادات', description: 'تعديل إعدادات النظام' },
  { code: 'Backup.Manage', nameAr: 'إدارة النسخ الاحتياطي', module: 'الإعدادات', description: 'إنشاء واستعادة النسخ الاحتياطية' },
];

const adminAll = permissionDefinitions.map((p) => p.code);
const viewOnly = permissionDefinitions.filter((p) => p.code.endsWith('.View')).map((p) => p.code);

export const defaultRolePermissions: Record<RoleKey, string[]> = {
  admin: adminAll,
  manager: [
    ...viewOnly,
    'Inbound.Create', 'Inbound.Approve', 'Inbound.Cancel',
    'Outbound.Create', 'Outbound.Approve', 'Outbound.Cancel',
    'Transfer.Create', 'Transfer.Approve', 'Transfer.Cancel',
    'InventoryCount.Create', 'InventoryCount.Approve',
    'Barcode.Manage', 'AuditLog.View', 'Backup.Manage',
  ],
  storekeeper: [
    ...viewOnly,
    'Inbound.Create', 'Outbound.Create', 'Transfer.Create', 'InventoryCount.Create', 'Barcode.Manage',
  ],
  data_entry: [
    ...viewOnly,
    'Items.Create', 'Items.Edit', 'MasterData.Manage', 'Inbound.Create', 'Outbound.Create',
  ],
  readonly: viewOnly,
};

function hashPassword(password: string) {
  let hash = 5381;
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash * 33) ^ password.charCodeAt(i);
  }
  return `wms_${(hash >>> 0).toString(16)}`;
}

function roleName(role: RoleKey) {
  return roleDefinitions.find((r) => r.key === role)?.name ?? role;
}

function seedUsers(): AuthUser[] {
  const now = new Date().toISOString();
  return [
    { id: 1, full_name: 'مدير النظام', username: 'admin', role: 'admin', role_name: 'مدير النظام', status: 'active', password_hash: hashPassword('admin123'), last_login_at: now, created_at: now },
    { id: 2, full_name: 'أحمد المدير', username: 'warehouse.manager', role: 'manager', role_name: 'مدير المستودع', status: 'active', password_hash: hashPassword('manager123'), last_login_at: now, created_at: now },
    { id: 3, full_name: 'أمين المستودع', username: 'storekeeper', role: 'storekeeper', role_name: 'أمين المستودع', status: 'active', password_hash: hashPassword('store123'), last_login_at: now, created_at: now },
    { id: 4, full_name: 'موظف إدخال', username: 'data.entry', role: 'data_entry', role_name: 'موظف إدخال', status: 'active', password_hash: hashPassword('data123'), last_login_at: now, created_at: now },
    { id: 5, full_name: 'مستخدم قراءة', username: 'readonly', role: 'readonly', role_name: 'قراءة فقط', status: 'active', password_hash: hashPassword('read123'), last_login_at: now, created_at: now },
  ];
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getRoles() {
  return roleDefinitions;
}

export function getRolePermissions(): Record<RoleKey, string[]> {
  return readJson(ROLE_PERMISSIONS_KEY, defaultRolePermissions);
}

export function saveRolePermissions(value: Record<RoleKey, string[]>) {
  writeJson(ROLE_PERMISSIONS_KEY, value);
}

export function toggleRolePermission(role: RoleKey, permissionCode: string, enabled: boolean) {
  const permissions = getRolePermissions();
  const current = new Set(permissions[role] ?? []);
  if (enabled) current.add(permissionCode);
  else current.delete(permissionCode);
  permissions[role] = Array.from(current);
  saveRolePermissions(permissions);
  return permissions;
}

export function getAuthUsers(): AuthUser[] {
  const users = readJson<AuthUser[] | null>(USERS_KEY, null);
  if (users?.length) return users;
  const seeded = seedUsers();
  writeJson(USERS_KEY, seeded);
  return seeded;
}

export function saveAuthUsers(users: AuthUser[]) {
  writeJson(USERS_KEY, users);
}

export function createAuthUser(input: { full_name: string; username: string; password: string; role: RoleKey }) {
  const users = getAuthUsers();
  const username = input.username.trim().toLowerCase();
  if (!input.full_name.trim()) throw new Error('الاسم الكامل مطلوب');
  if (!username) throw new Error('اسم المستخدم مطلوب');
  if (users.some((u) => u.username.toLowerCase() === username)) throw new Error('اسم المستخدم موجود مسبقًا');
  if (input.password.length < 4) throw new Error('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
  const nextId = users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const user: AuthUser = {
    id: nextId,
    full_name: input.full_name.trim(),
    username,
    role: input.role,
    role_name: roleName(input.role),
    status: 'active',
    password_hash: hashPassword(input.password),
    created_at: new Date().toISOString(),
  };
  users.push(user);
  saveAuthUsers(users);
  return user;
}

export function updateAuthUser(id: number, patch: Partial<Pick<AuthUser, 'full_name' | 'role' | 'status'>>) {
  const users = getAuthUsers();
  const updated = users.map((user) => {
    if (user.id !== id) return user;
    const role = patch.role ?? user.role;
    return { ...user, ...patch, role, role_name: roleName(role) };
  });
  saveAuthUsers(updated);
  return updated.find((u) => u.id === id);
}

export function disableAuthUser(id: number) {
  return updateAuthUser(id, { status: 'inactive' });
}

export function deleteAuthUser(id: number) {
  const users = getAuthUsers();
  const next = users.filter((user) => user.id !== id);
  if (next.length === users.length) throw new Error('المستخدم غير موجود');
  saveAuthUsers(next);
  return true;
}

export function validateLogin(username: string, password: string) {
  const users = getAuthUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  if (!user) throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  if (user.status !== 'active') throw new Error('هذا الحساب غير فعال');
  if (user.password_hash !== hashPassword(password)) throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
  const now = new Date().toISOString();
  const updated = users.map((u) => u.id === user.id ? { ...u, last_login_at: now } : u);
  saveAuthUsers(updated);
  return { ...user, last_login_at: now };
}

export function hasRolePermission(role: RoleKey, permissionCode: string) {
  if (role === 'admin') return true;
  return (getRolePermissions()[role] ?? []).includes(permissionCode);
}

export const routePermissions: Record<string, string> = {
  '/': 'Dashboard.View',
  '/items': 'Items.View',
  '/categories': 'MasterData.View',
  '/units': 'MasterData.View',
  '/brands': 'MasterData.View',
  '/manufacturers': 'MasterData.View',
  '/suppliers': 'MasterData.View',
  '/recipients': 'MasterData.View',
  '/warehouses': 'Warehouses.View',
  '/locations': 'Locations.View',
  '/stock': 'Stock.View',
  '/movements': 'StockMovements.View',
  '/movement': 'StockMovements.View',
  '/low-stock': 'LowStock.View',
  '/incoming': 'Inbound.View',
  '/outgoing': 'Outbound.View',
  '/transfer': 'Transfer.View',
  '/inventory': 'InventoryCount.View',
  '/barcode': 'Barcode.View',
  '/reports': 'Reports.View',
  '/users': 'Users.Manage',
  '/permissions': 'Permissions.Manage',
  '/activity': 'AuditLog.View',
  '/settings': 'Settings.Manage',
  '/backup': 'Backup.Manage',
};

export function getCurrentUserFromStorage() {
  return readJson<AuthUser | null>(CURRENT_USER_KEY, null);
}

export function setCurrentUserInStorage(user: AuthUser | null) {
  if (!user) localStorage.removeItem(CURRENT_USER_KEY);
  else writeJson(CURRENT_USER_KEY, user);
}
