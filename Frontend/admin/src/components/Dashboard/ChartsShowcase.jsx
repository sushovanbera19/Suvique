import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useUISettings } from "../../context/UISettingsContext";
import { FiSave, FiRotateCcw, FiX } from "react-icons/fi";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "../../assets/style/UIShowcase.css";

const sampleData = [
  { name: "Jan", revenue: 4000, orders: 240, profit: 2400 },
  { name: "Feb", revenue: 3000, orders: 139, profit: 1390 },
  { name: "Mar", revenue: 5000, orders: 380, profit: 3800 },
  { name: "Apr", revenue: 2780, orders: 390, profit: 2700 },
  { name: "May", revenue: 1890, orders: 480, profit: 1900 },
  { name: "Jun", revenue: 2390, orders: 380, profit: 2400 },
];
const pieData = [{ name: "Direct", value: 400 }, { name: "Referral", value: 300 }, { name: "Organic", value: 300 }, { name: "Social", value: 200 }, { name: "Email", value: 180 }];
const radarData = [{ subject: "Sales", A: 120, B: 110 }, { subject: "Revenue", A: 98, B: 130 }, { subject: "Orders", A: 86, B: 130 }, { subject: "Customers", A: 99, B: 100 }, { subject: "Growth", A: 85, B: 90 }];

const ChartsShowcase = () => {
  const { getByType, saveSettings, resetType } = useUISettings();
  const charts = getByType("chart");
  const [editPanel, setEditPanel] = useState(null);
  const [draft, setDraft] = useState({});
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const openEdit = (name) => { setEditPanel(name); setDraft({ ...charts[name] }); };
  const updateDraft = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const saveComponent = async () => {
    const rows = Object.entries(draft)
      .filter(([k]) => !["component_type", "component_name", "id"].includes(k))
      .map(([k, v]) => ({ component_type: "chart", component_name: editPanel, setting_key: k, setting_value: String(v) }));
    const ok = await saveSettings(rows);
    showToast(ok ? "Saved!" : "Failed");
    if (ok) setEditPanel(null);
  };

  const handleReset = async () => { await resetType("chart"); showToast("Reset to defaults"); };

  const chartNames = { bar: "Bar Chart", line: "Line Chart", area: "Area Chart", pie: "Pie / Donut", radar: "Radar Chart", radialBar: "Radial Bar" };

  const TT = ({ active, payload, label, bg, color }) => {
    if (!active || !payload?.length) return null;
    return <div style={{ background: bg, color, padding: "8px 12px", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}><p style={{ margin: 0, fontWeight: 600 }}>{label}</p>{payload.map((p, i) => <p key={i} style={{ margin: "2px 0 0", opacity: 0.85 }}>{p.name}: {p.value}</p>)}</div>;
  };

  const renderChart = (name, s) => {
    if (s.enabled === "false") return <div className="ui-chart-disabled">Disabled</div>;
    if (name === "bar") return (<ResponsiveContainer width="100%" height={260}><BarChart data={sampleData}>{s.show_grid !== "false" && <CartesianGrid strokeDasharray="3 3" stroke={s.grid_color} />}<XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip content={<TT bg={s.tooltip_bg} color={s.tooltip_text} />} />{s.show_legend !== "false" && <Legend />}<Bar dataKey="revenue" fill={s.primary_color} radius={[Number(s.bar_radius) || 4, Number(s.bar_radius) || 4, 0, 0]} /><Bar dataKey="profit" fill={s.secondary_color} radius={[Number(s.bar_radius) || 4, Number(s.bar_radius) || 4, 0, 0]} /></BarChart></ResponsiveContainer>);
    if (name === "line") return (<ResponsiveContainer width="100%" height={260}><LineChart data={sampleData}>{s.show_grid !== "false" && <CartesianGrid strokeDasharray="3 3" stroke={s.grid_color} />}<XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip content={<TT bg={s.tooltip_bg} color={s.tooltip_text} />} />{s.show_legend !== "false" && <Legend />}<Line type="monotone" dataKey="revenue" stroke={s.primary_color} strokeWidth={Number(s.stroke_width) || 3} dot={{ r: Number(s.dot_radius) || 5 }} /><Line type="monotone" dataKey="profit" stroke={s.secondary_color} strokeWidth={Number(s.stroke_width) || 3} dot={{ r: Number(s.dot_radius) || 5 }} /></LineChart></ResponsiveContainer>);
    if (name === "area") return (<ResponsiveContainer width="100%" height={260}><AreaChart data={sampleData}>{s.show_grid !== "false" && <CartesianGrid strokeDasharray="3 3" stroke={s.grid_color} />}<XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip content={<TT bg={s.tooltip_bg} color={s.tooltip_text} />} />{s.show_legend !== "false" && <Legend />}<Area type="monotone" dataKey="revenue" stroke={s.primary_color} fill={s.primary_color} fillOpacity={Number(s.fill_opacity) || 0.3} strokeWidth={Number(s.stroke_width) || 2} /><Area type="monotone" dataKey="profit" stroke={s.secondary_color} fill={s.secondary_color} fillOpacity={Number(s.fill_opacity) || 0.3} strokeWidth={Number(s.stroke_width) || 2} /></AreaChart></ResponsiveContainer>);
    if (name === "pie") { const colors = [s.color_1, s.color_2, s.color_3, s.color_4, s.color_5]; return (<ResponsiveContainer width="100%" height={260}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={Number(s.inner_radius) || 60} outerRadius={Number(s.outer_radius) || 120} paddingAngle={3} dataKey="value">{pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>); }
    if (name === "radar") return (<ResponsiveContainer width="100%" height={260}><RadarChart data={radarData}><PolarGrid stroke={s.grid_color} /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} /><PolarRadiusAxis tick={{ fontSize: 10 }} /><Radar name="This Year" dataKey="A" stroke={s.primary_color} fill={s.primary_color} fillOpacity={Number(s.fill_opacity) || 0.3} /><Radar name="Last Year" dataKey="B" stroke={s.secondary_color} fill={s.secondary_color} fillOpacity={0.15} /><Legend /><Tooltip /></RadarChart></ResponsiveContainer>);
    if (name === "radialBar") { const data = [{ name: "Sales", value: 78, fill: s.color_1 }, { name: "Revenue", value: 62, fill: s.color_2 }, { name: "Orders", value: 91, fill: s.color_3 }]; return (<ResponsiveContainer width="100%" height={260}><RadialBarChart cx="50%" cy="50%" innerRadius={Number(s.inner_radius) || 70} outerRadius={Number(s.outer_radius) || 100} barSize={14} data={data}><RadialBar background dataKey="value" /><Legend /><Tooltip /></RadialBarChart></ResponsiveContainer>); }
    return null;
  };

  return (
    <div className="ui-page-wrap">
      {toast && <div className="ui-toast">{toast}</div>}
      <div className="settings-page-top">
        <h1 className="settings-page-title">Charts</h1>
        <Breadcrumb />
      </div>
      <div className="ui-showcase-header">
        <p>Chart components using Recharts. Customize colors, grid, tooltip, legend.</p>
        <button className="ui-reset-btn" onClick={handleReset}><FiRotateCcw /> Reset</button>
      </div>

      <div className={`ui-page-body ${editPanel ? "with-panel" : ""}`}>
        <div className="ui-showcase-grid ui-charts-grid">
          {Object.entries(charts).map(([name, s]) => (
            <div className="ui-showcase-card" key={name}>
              <div className="ui-showcase-card-header">
                <h3>{chartNames[name]}</h3>
                <button className="ui-action-btn" onClick={() => openEdit(name)}>✎</button>
              </div>
              <div className="ui-showcase-preview ui-chart-preview">{renderChart(name, s)}</div>
              <div className="ui-showcase-meta">
                <span>Grid: {s.show_grid || "true"}</span>
                <span className={`ui-enabled-badge ${s.enabled === "false" ? "disabled" : "active"}`}>{s.enabled === "false" ? "Disabled" : "Active"}</span>
              </div>
            </div>
          ))}
        </div>

        {editPanel && (
          <div className="ui-side-panel">
            <div className="ui-side-panel-header">
              <h3>Edit: {chartNames[editPanel]}</h3>
              <button className="ui-side-close" onClick={() => setEditPanel(null)}><FiX /></button>
            </div>
            <div className="ui-side-panel-body">
              <div className="ui-edit-grid">
                {Object.entries(draft).map(([key, val]) => {
                  if (["component_type", "component_name", "id"].includes(key)) return null;
                  if (key === "enabled" || key === "show_grid" || key === "show_legend") {
                    return <label key={key}>{key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}<select value={val || "true"} onChange={(e) => updateDraft(key, e.target.value)}><option value="true">{key === "enabled" ? "Active" : "Yes"}</option><option value="false">{key === "enabled" ? "Disabled" : "No"}</option></select></label>;
                  }
                  if (key.includes("color") || key.includes("primary") || key.includes("secondary") || key.includes("grid") || key.includes("tooltip") || key.startsWith("color_") || key === "fill_opacity") {
                    return <label key={key}>{key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}<div className="ui-color-input"><input type="color" value={(val || "#667eea").startsWith("#") ? val : "#667eea"} onChange={(e) => updateDraft(key, e.target.value)} /><input type="text" value={val || ""} onChange={(e) => updateDraft(key, e.target.value)} /></div></label>;
                  }
                  return <label key={key}>{key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}<input type="text" value={val || ""} onChange={(e) => updateDraft(key, e.target.value)} /></label>;
                })}
              </div>
            </div>
            <div className="ui-side-panel-footer">
              <button className="ui-cancel-btn" onClick={() => setEditPanel(null)}>Cancel</button>
              <button className="ui-save-btn" onClick={saveComponent}><FiSave /> Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsShowcase;
