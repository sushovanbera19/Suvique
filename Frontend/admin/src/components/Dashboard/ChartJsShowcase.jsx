import { useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import { useUISettings } from "../../context/UISettingsContext";
import { FiSave, FiRotateCcw, FiX } from "react-icons/fi";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Area, ScatterChart, Scatter, Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "../../assets/style/UIShowcase.css";

const monthlyData = [
  { month: "Jan", users: 186, sessions: 800, revenue: 5000 },
  { month: "Feb", users: 305, sessions: 900, revenue: 6200 },
  { month: "Mar", users: 237, sessions: 1100, revenue: 7500 },
  { month: "Apr", users: 273, sessions: 950, revenue: 5800 },
  { month: "May", users: 189, sessions: 1200, revenue: 8100 },
  { month: "Jun", users: 289, sessions: 1050, revenue: 7200 },
  { month: "Jul", users: 349, sessions: 1300, revenue: 9400 },
];

const pieData = [
  { name: "Desktop", value: 540 },
  { name: "Mobile", value: 320 },
  { name: "Tablet", value: 180 },
];

const scatterData = Array.from({ length: 30 }, (_, i) => ({
  x: Math.round(Math.random() * 100),
  y: Math.round(Math.random() * 100),
}));

const treemapData = [
  { name: "Electronics", size: 3400 },
  { name: "Clothing", size: 2800 },
  { name: "Home", size: 2200 },
  { name: "Sports", size: 1600 },
  { name: "Books", size: 1200 },
  { name: "Toys", size: 900 },
  { name: "Food", size: 750 },
  { name: "Auto", size: 600 },
];

const COLORS = ["#667eea", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const CustomTreemapContent = ({ x, y, width, height, name, colors, index }) => {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill: COLORS[index % COLORS.length], stroke: "#fff", strokeWidth: 2, rx: 4 }} />
      {width > 60 && height > 30 && (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={12} fontWeight={600}>
          {name}
        </text>
      )}
    </g>
  );
};

const ChartJsShowcase = () => {
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

  const chartConfigs = {
    bar: { label: "Vertical Bar Chart", icon: "📊" },
    line: { label: "Multi-Line Chart", icon: "📈" },
    pie: { label: "Pie Chart", icon: "🥧" },
    area: { label: "Stacked Area", icon: "🌊" },
    radar: { label: "Radar Chart", icon: "🎯" },
    radialBar: { label: "Mixed Composed", icon: "📉" },
  };

  const TT = ({ active, payload, label, bg, color }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: bg, color, padding: "8px 12px", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: "2px 0 0", opacity: 0.85 }}>{p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}</p>
        ))}
      </div>
    );
  };

  const renderChart = (name, s) => {
    if (s.enabled === "false") return <div className="ui-chart-disabled">Disabled</div>;

    if (name === "bar") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyData} barGap={4}>
            {s.show_grid !== "false" && <CartesianGrid strokeDasharray="3 3" stroke={s.grid_color} />}
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<TT bg={s.tooltip_bg} color={s.tooltip_text} />} />
            {s.show_legend !== "false" && <Legend />}
            <Bar dataKey="users" fill={s.primary_color} radius={[6, 6, 0, 0]} />
            <Bar dataKey="sessions" fill={s.secondary_color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (name === "line") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthlyData}>
            {s.show_grid !== "false" && <CartesianGrid strokeDasharray="3 3" stroke={s.grid_color} />}
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<TT bg={s.tooltip_bg} color={s.tooltip_text} />} />
            {s.show_legend !== "false" && <Legend />}
            <Line type="monotone" dataKey="revenue" stroke={s.primary_color} strokeWidth={Number(s.stroke_width) || 3} dot={{ r: Number(s.dot_radius) || 5, fill: s.primary_color }} activeDot={{ r: 7 }} />
            <Line type="monotone" dataKey="sessions" stroke={s.secondary_color} strokeWidth={Number(s.stroke_width) || 3} dot={{ r: Number(s.dot_radius) || 5, fill: s.secondary_color }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (name === "pie") {
      const colors = [s.color_1, s.color_2, s.color_3];
      return (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={Number(s.outer_radius) || 110} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (name === "area") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={monthlyData}>
            {s.show_grid !== "false" && <CartesianGrid strokeDasharray="3 3" stroke={s.grid_color} />}
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<TT bg={s.tooltip_bg} color={s.tooltip_text} />} />
            {s.show_legend !== "false" && <Legend />}
            <Area type="monotone" dataKey="revenue" stackId="1" stroke={s.primary_color} fill={s.primary_color} fillOpacity={Number(s.fill_opacity) || 0.3} />
            <Area type="monotone" dataKey="sessions" stackId="1" stroke={s.secondary_color} fill={s.secondary_color} fillOpacity={Number(s.fill_opacity) || 0.3} />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    if (name === "radar") {
      const radarData = monthlyData.map((d) => ({ subject: d.month, A: d.users, B: Math.round(d.sessions / 10) }));
      return (
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke={s.grid_color} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} />
            <Radar name="Users" dataKey="A" stroke={s.primary_color} fill={s.primary_color} fillOpacity={Number(s.fill_opacity) || 0.3} />
            <Radar name="Sessions" dataKey="B" stroke={s.secondary_color} fill={s.secondary_color} fillOpacity={0.15} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      );
    }

    if (name === "radialBar") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={monthlyData}>
            {s.show_grid !== "false" && <CartesianGrid strokeDasharray="3 3" stroke={s.grid_color} />}
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<TT bg={s.tooltip_bg} color={s.tooltip_text} />} />
            {s.show_legend !== "false" && <Legend />}
            <Bar dataKey="revenue" fill={s.primary_color} radius={[4, 4, 0, 0]} barSize={20} />
            <Line type="monotone" dataKey="users" stroke={s.secondary_color} strokeWidth={Number(s.stroke_width) || 3} dot={{ r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="ui-page-wrap">
      {toast && <div className="ui-toast">{toast}</div>}
      <div className="settings-page-top">
        <h1 className="settings-page-title">Chart.js Charts</h1>
        <Breadcrumb />
      </div>
      <div className="ui-showcase-header">
        <p>Chart.js-style chart configurations. Vertical bars, multi-line, pie, stacked area, radar, and mixed composed charts.</p>
        <button className="ui-reset-btn" onClick={handleReset}><FiRotateCcw /> Reset</button>
      </div>

      <div className={`ui-page-body ${editPanel ? "with-panel" : ""}`}>
        <div className="ui-showcase-grid ui-charts-grid">
          {Object.entries(charts).map(([name, s]) => (
            <div className="ui-showcase-card" key={name}>
              <div className="ui-showcase-card-header">
                <h3>{chartConfigs[name]?.label || name}</h3>
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
              <h3>Edit: {chartConfigs[editPanel]?.label || editPanel}</h3>
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

export default ChartJsShowcase;
