import { ReactNode, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Archive,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BadgeCheck,
  Barcode,
  BarChart3,
  Bell,
  AlertTriangle,
  Building2,
  ChevronLeft,
  ClipboardCheck,
  DatabaseBackup,
  Factory,
  Home,
  LogOut,
  MapPin,
  Maximize2,
  Menu,
  Minimize2,
  Package,
  PackageSearch,
  Plus,
  Scale,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Tags,
  Truck,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { routePermissions } from "../auth/authData";
import { api } from "../lib/api";

interface Props {
  children: ReactNode;
}

type ModuleItem = {
  path: string;
  label: string;
  fullLabel: string;
  icon: typeof Home;
  group: string;
};

const allModules: ModuleItem[] = [
  { path: "/", label: "الرئيسية", fullLabel: "لوحة التحكم", icon: Home, group: "الرئيسية" },
  { path: "/items", label: "الأصناف", fullLabel: "الأصناف", icon: Package, group: "بيانات النظام" },
  { path: "/categories", label: "التصنيفات", fullLabel: "التصنيفات", icon: Tags, group: "بيانات النظام" },
  { path: "/units", label: "الوحدات", fullLabel: "الوحدات", icon: Scale, group: "بيانات النظام" },
  { path: "/brands", label: "العلامات", fullLabel: "العلامات التجارية", icon: BadgeCheck, group: "بيانات النظام" },
  { path: "/manufacturers", label: "المصنعون", fullLabel: "الشركات المصنعة", icon: Factory, group: "بيانات النظام" },
  { path: "/suppliers", label: "المورّدون", fullLabel: "المورّدون", icon: Truck, group: "بيانات النظام" },
  { path: "/recipients", label: "العملاء", fullLabel: "العملاء", icon: Users, group: "بيانات النظام" },
  { path: "/warehouses", label: "المستودعات", fullLabel: "المستودعات", icon: Warehouse, group: "المستودعات" },
  { path: "/locations", label: "المواقع", fullLabel: "مواقع التخزين", icon: MapPin, group: "المستودعات" },
  { path: "/stock", label: "الرصيد", fullLabel: "المخزون الحالي", icon: Archive, group: "المخزون" },
  { path: "/movements", label: "الحركات", fullLabel: "حركات المخزون", icon: PackageSearch, group: "المخزون" },
  { path: "/low-stock", label: "النقص", fullLabel: "تنبيهات الحد الأدنى", icon: AlertTriangle, group: "المخزون" },
  { path: "/incoming", label: "وارد", fullLabel: "مستند وارد", icon: ArrowDownLeft, group: "العمليات" },
  { path: "/outgoing", label: "صادر", fullLabel: "مستند صادر", icon: ArrowUpRight, group: "العمليات" },
  { path: "/transfer", label: "تحويل", fullLabel: "التحويل بين المستودعات", icon: ArrowLeftRight, group: "العمليات" },
  { path: "/inventory", label: "الجرد", fullLabel: "الجرد", icon: ClipboardCheck, group: "العمليات" },
  { path: "/barcode", label: "باركود", fullLabel: "الباركود و QR", icon: Barcode, group: "الأدوات" },
  { path: "/reports", label: "التقارير", fullLabel: "التقارير", icon: BarChart3, group: "التقارير" },
  { path: "/users", label: "المستخدمون", fullLabel: "المستخدمون", icon: UserCog, group: "الإدارة" },
  { path: "/permissions", label: "الصلاحيات", fullLabel: "الصلاحيات", icon: ShieldCheck, group: "الإدارة" },
  { path: "/activity", label: "النشاط", fullLabel: "سجل النشاط", icon: ScrollText, group: "الإدارة" },
  { path: "/settings", label: "الإعدادات", fullLabel: "الإعدادات", icon: Settings, group: "الإعدادات" },
  { path: "/backup", label: "النسخ", fullLabel: "النسخ الاحتياطي", icon: DatabaseBackup, group: "الإعدادات" },
];

const quickActions = [
  { path: "/incoming", label: "مستند وارد", icon: ArrowDownLeft },
  { path: "/outgoing", label: "مستند صادر", icon: ArrowUpRight },
  { path: "/transfer", label: "تحويل", icon: ArrowLeftRight },
  { path: "/inventory", label: "جرد", icon: ClipboardCheck },
];

function useVisibleModules(hasPermission: (permission?: string) => boolean) {
  return useMemo(
    () => allModules.filter((m) => hasPermission(routePermissions[m.path])),
    [hasPermission],
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "صباح الخير";
  if (hour < 18) return "مساء الخير";
  return "أهلاً بك";
}

export default function Layout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; level: "warning" | "danger" | "info" }[]
  >([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const visibleModules = useVisibleModules(hasPermission);
  const isHome = location.pathname === "/";
  const current =
    allModules.find((m) => location.pathname === m.path || (m.path !== "/" && location.pathname.startsWith(`${m.path}/`))) ?? allModules[0];
  const visibleQuickActions = quickActions.filter((action) => hasPermission(routePermissions[action.path]));

  useEffect(() => {
    const syncFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadNotifications() {
      try {
        const [items, currentStock, transfers] = await Promise.all([
          api.items(),
          api.currentStock(),
          api.transfers(),
        ]);
        const next: { id: string; title: string; message: string; level: "warning" | "danger" | "info" }[] = [];
        items
          .filter((item: any) => Number(item.current_qty || 0) <= Number(item.min_qty || 0))
          .slice(0, 5)
          .forEach((item: any) =>
            next.push({
              id: `low-${item.id}`,
              title: "تنبيه نقص مخزون",
              message: `${item.name}: الكمية ${item.current_qty} أقل من الحد الأدنى ${item.min_qty}`,
              level: Number(item.current_qty || 0) === 0 ? "danger" : "warning",
            }),
          );
        currentStock
          .filter((row: any) => row.expiry_date && new Date(row.expiry_date).getTime() <= Date.now() + 30 * 86400000)
          .slice(0, 5)
          .forEach((row: any) =>
            next.push({
              id: `expiry-${row.id}`,
              title: "تنبيه انتهاء",
              message: `${row.item_name} ينتهي بتاريخ ${row.expiry_date}`,
              level: "danger",
            }),
          );
        const pendingTransfers = transfers.filter((doc: any) => doc.status === "draft" || doc.status === "pending");
        if (pendingTransfers.length) {
          next.push({
            id: "pending-transfers",
            title: "تحويلات معلّقة",
            message: `${pendingTransfers.length} تحويلات بحاجة إلى متابعة`,
            level: "info",
          });
        }
        if (mounted) setNotifications(next);
      } catch {
        if (mounted) setNotifications([]);
      }
    }
    void loadNotifications();
    const timer = window.setInterval(loadNotifications, 60000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      window.alert("تعذر تفعيل وضع ملء الشاشة من المتصفح.");
    }
  };

  return (
    <div className={`saas-shell ${sidebarOpen ? "is-sidebar-open" : "is-sidebar-hidden"}`} dir="rtl">
      <aside className={`saas-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="القائمة الرئيسية">
        <div className="saas-sidebar-top">
          <div className="saas-sidebar-logo" title="نظام إدارة المخزون والمستودعات">
            <Building2 size={23} />
          </div>
          <button
            type="button"
            className="saas-sidebar-toggle in-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="إخفاء القائمة"
            title="إخفاء القائمة"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <nav className="saas-sidebar-nav">
          {visibleModules.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink
                key={m.path}
                to={m.path}
                title={m.fullLabel}
                className={({ isActive }) => `saas-nav-icon ${isActive ? "is-active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={21} />
                <span>{m.fullLabel}</span>
              </NavLink>
            );
          })}
        </nav>
        <button type="button" className="saas-nav-icon saas-logout-icon" title="تسجيل الخروج" onClick={handleLogout}>
          <LogOut size={21} />
          <span>خروج</span>
        </button>
      </aside>

      {!sidebarOpen && (
        <button
          type="button"
          className="saas-sidebar-open-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="فتح القائمة"
          title="فتح القائمة"
        >
          <Menu size={22} />
        </button>
      )}

      {mobileOpen && <button type="button" className="saas-backdrop" aria-label="إغلاق القائمة" onClick={() => setMobileOpen(false)} />}

      <div className={`saas-main ${isHome ? "has-home-header" : "has-no-topbar"}`}>
        {isHome && (
          <header className="saas-header is-home">
            <button type="button" className="saas-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="فتح القائمة">
              <Menu size={22} />
            </button>

            <div className="saas-heading-block">
              <span className="saas-page-kicker">{current.group}</span>
              <h1>
                {getGreeting()}، {user?.full_name ?? "مستخدم"} 👋
              </h1>
              <p>لوحة مراقبة المخزون والتنبيهات والحركات اليومية</p>
            </div>

            <div className="saas-header-actions">
              <div className="saas-search">
                <Search size={18} />
                <input placeholder="بحث سريع: صنف، SKU، Barcode، Batch، Serial أو رقم مستند..." />
              </div>
              <button
                type="button"
                className="saas-icon-button"
                onClick={handleFullscreen}
                title={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
                aria-label={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
              >
                {isFullscreen ? <Minimize2 size={19} /> : <Maximize2 size={19} />}
              </button>
              <div className="saas-notifications-wrap">
                <button
                  type="button"
                  className="saas-icon-button"
                  onClick={() => setNotificationsOpen((value) => !value)}
                  aria-label="الإشعارات"
                >
                  <Bell size={19} />
                  {notifications.length > 0 && <span className="saas-badge">{notifications.length}</span>}
                </button>
                {notificationsOpen && (
                  <div className="saas-notifications-dropdown">
                    <div className="saas-dropdown-title">الإشعارات</div>
                    {notifications.length === 0 ? (
                      <div className="saas-empty-note">لا توجد إشعارات حالية</div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className={`saas-notification-row notification-${notification.level}`}>
                          <strong>{notification.title}</strong>
                          <span>{notification.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="saas-user-pill">
                <span className="saas-avatar">{(user?.full_name ?? "U").charAt(0)}</span>
                <div>
                  <strong>{user?.full_name ?? "مستخدم"}</strong>
                  <span>{user?.role_name ?? ""}</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {isHome && (
          <section className="saas-quickbar">
            {visibleQuickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  type="button"
                  className={index === 0 ? "saas-quick-button is-primary" : "saas-quick-button"}
                  onClick={() => navigate(action.path)}
                >
                  <Icon size={18} />
                  <span>{action.label}</span>
                  {index === 0 && <Plus size={14} />}
                </button>
              );
            })}
            <div className="saas-powered">
              Powered by <strong>NexoraTeam</strong>
            </div>
          </section>
        )}

        <main className="saas-content-shell">
          <div className="saas-dashboard-container">{children}</div>
        </main>
      </div>
    </div>
  );
}
