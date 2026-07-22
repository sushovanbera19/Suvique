import { createContext, useContext, useState, useEffect, useCallback } from "react";

const UISettingsContext = createContext();
const API = "http://localhost:5000";

export const UISettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/ui-settings`);
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
        injectCSSVariables(data.data);
      }
    } catch (err) {
      console.error("Failed to load UI settings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const injectCSSVariables = (data) => {
    const root = document.documentElement;
    const mapping = {
      button: {
        primary: {
          "--btn-primary-bg": "bg_color",
          "--btn-primary-color": "text_color",
          "--btn-primary-hover": "hover_bg",
          "--btn-primary-radius": "border_radius",
          "--btn-primary-size": "font_size",
          "--btn-primary-padding": "padding",
          "--btn-primary-shadow": "shadow",
        },
        secondary: {
          "--btn-secondary-bg": "bg_color",
          "--btn-secondary-color": "text_color",
          "--btn-secondary-hover": "hover_bg",
          "--btn-secondary-radius": "border_radius",
        },
        success: {
          "--btn-success-bg": "bg_color",
          "--btn-success-color": "text_color",
          "--btn-success-hover": "hover_bg",
        },
        danger: {
          "--btn-danger-bg": "bg_color",
          "--btn-danger-color": "text_color",
          "--btn-danger-hover": "hover_bg",
        },
        warning: {
          "--btn-warning-bg": "bg_color",
          "--btn-warning-color": "text_color",
          "--btn-warning-hover": "hover_bg",
        },
        gradient: {
          "--btn-gradient-bg": "bg_color",
          "--btn-gradient-color": "text_color",
          "--btn-gradient-hover": "hover_bg",
          "--btn-gradient-radius": "border_radius",
          "--btn-gradient-shadow": "shadow",
        },
      },
      card: {
        stat: {
          "--card-stat-bg": "bg_color",
          "--card-stat-border": "border",
          "--card-stat-radius": "border_radius",
          "--card-stat-shadow": "shadow",
          "--card-stat-hover": "hover_shadow",
          "--card-stat-accent": "header_color",
        },
        product: {
          "--card-product-bg": "bg_color",
          "--card-product-border": "border",
          "--card-product-radius": "border_radius",
          "--card-product-shadow": "shadow",
          "--card-product-hover-shadow": "hover_shadow",
          "--card-product-hover-transform": "hover_transform",
        },
        notification: {
          "--card-notification-bg": "bg_color",
          "--card-notification-border": "border",
          "--card-notification-radius": "border_radius",
          "--card-notification-accent": "accent_color",
        },
        pricing: {
          "--card-pricing-bg": "bg_color",
          "--card-pricing-border": "border",
          "--card-pricing-radius": "border_radius",
          "--card-pricing-shadow": "shadow",
          "--card-pricing-header-bg": "header_bg",
          "--card-pricing-header-text": "header_text",
        },
      },
      modal: {
        standard: {
          "--modal-overlay": "overlay_color",
          "--modal-bg": "bg_color",
          "--modal-radius": "border_radius",
          "--modal-shadow": "shadow",
          "--modal-width": "width",
          "--modal-animation": "animation",
        },
        confirm: {
          "--modal-confirm-bg": "bg_color",
          "--modal-confirm-radius": "border_radius",
          "--modal-confirm-width": "width",
          "--modal-confirm-accent": "accent_color",
        },
        drawer: {
          "--drawer-bg": "bg_color",
          "--drawer-width": "width",
          "--drawer-shadow": "shadow",
          "--drawer-animation": "animation",
        },
        fullscreen: {
          "--modal-fs-bg": "bg_color",
          "--modal-fs-width": "width",
          "--modal-fs-height": "height",
          "--modal-fs-radius": "border_radius",
        },
        alert: {
          "--modal-alert-bg": "bg_color",
          "--modal-alert-radius": "border_radius",
          "--modal-alert-width": "width",
          "--modal-alert-accent": "accent_color",
        },
      },
      chart: {
        bar: {
          "--chart-bar-primary": "primary_color",
          "--chart-bar-secondary": "secondary_color",
          "--chart-bar-grid": "grid_color",
          "--chart-bar-tooltip-bg": "tooltip_bg",
          "--chart-bar-tooltip-color": "tooltip_text",
        },
        line: {
          "--chart-line-primary": "primary_color",
          "--chart-line-secondary": "secondary_color",
          "--chart-line-grid": "grid_color",
          "--chart-line-tooltip-bg": "tooltip_bg",
          "--chart-line-tooltip-color": "tooltip_text",
        },
        area: {
          "--chart-area-primary": "primary_color",
          "--chart-area-secondary": "secondary_color",
          "--chart-area-grid": "grid_color",
          "--chart-area-tooltip-bg": "tooltip_bg",
          "--chart-area-tooltip-color": "tooltip_text",
        },
        pie: {
          "--chart-pie-c1": "color_1",
          "--chart-pie-c2": "color_2",
          "--chart-pie-c3": "color_3",
          "--chart-pie-c4": "color_4",
          "--chart-pie-c5": "color_5",
          "--chart-pie-tooltip-bg": "tooltip_bg",
          "--chart-pie-tooltip-color": "tooltip_text",
        },
      },
      form: {
        text_input: {
          "--input-bg": "bg_color",
          "--input-border": "border_color",
          "--input-focus-border": "focus_border",
          "--input-radius": "border_radius",
          "--input-size": "font_size",
          "--input-padding": "padding",
          "--input-color": "text_color",
          "--input-placeholder": "placeholder_color",
          "--input-label-color": "label_color",
          "--input-label-size": "label_size",
          "--input-shadow": "shadow",
        },
        select: {
          "--select-bg": "bg_color",
          "--select-border": "border_color",
          "--select-focus-border": "focus_border",
          "--select-radius": "border_radius",
          "--select-size": "font_size",
          "--select-padding": "padding",
          "--select-color": "text_color",
          "--select-arrow": "arrow_color",
        },
        textarea: {
          "--textarea-bg": "bg_color",
          "--textarea-border": "border_color",
          "--textarea-focus-border": "focus_border",
          "--textarea-radius": "border_radius",
          "--textarea-size": "font_size",
          "--textarea-padding": "padding",
          "--textarea-min-height": "min_height",
        },
        checkbox: {
          "--check-color": "check_color",
          "--check-border": "border_color",
          "--check-radius": "border_radius",
          "--check-size": "size",
        },
        radio: {
          "--radio-color": "check_color",
          "--radio-border": "border_color",
          "--radio-size": "size",
        },
        toggle: {
          "--toggle-active-bg": "active_bg",
          "--toggle-inactive-bg": "inactive_bg",
          "--toggle-knob": "knob_color",
          "--toggle-width": "width",
          "--toggle-height": "height",
        },
        range_slider: {
          "--range-track": "track_color",
          "--range-fill": "fill_color",
          "--range-thumb": "thumb_color",
          "--range-thumb-size": "thumb_size",
          "--range-height": "height",
        },
        file_upload: {
          "--upload-border": "border_color",
          "--upload-style": "border_style",
          "--upload-radius": "border_radius",
          "--upload-bg": "bg_color",
          "--upload-color": "text_color",
          "--upload-icon": "icon_color",
          "--upload-hover": "hover_bg",
        },
      },
      validation: {
        error: {
          "--val-error-text": "text_color",
          "--val-error-size": "font_size",
          "--val-error-border": "border_color",
          "--val-error-bg": "bg_color",
        },
        success: {
          "--val-success-text": "text_color",
          "--val-success-size": "font_size",
          "--val-success-border": "border_color",
          "--val-success-bg": "bg_color",
        },
        warning: {
          "--val-warning-text": "text_color",
          "--val-warning-size": "font_size",
          "--val-warning-border": "border_color",
          "--val-warning-bg": "bg_color",
        },
      },
    };

    Object.entries(mapping).forEach(([type, components]) => {
      Object.entries(components).forEach(([name, varMap]) => {
        const comp = data[type]?.[name];
        if (!comp) return;
        Object.entries(varMap).forEach(([cssVar, settingKey]) => {
          if (comp[settingKey] !== undefined) {
            root.style.setProperty(cssVar, comp[settingKey]);
          }
        });
      });
    });
  };

  const getStyle = (type, name, key) => {
    return settings[type]?.[name]?.[key] || "";
  };

  const getComponent = (type, name) => {
    return settings[type]?.[name] || {};
  };

  const getByType = (type) => {
    return settings[type] || {};
  };

  const isEnabled = (type, name) => {
    return settings[type]?.[name]?.enabled !== "false";
  };

  const saveSettings = async (rows) => {
    try {
      const res = await fetch(`${API}/api/ui-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: rows }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchSettings();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetType = async (type) => {
    try {
      await fetch(`${API}/api/ui-settings/reset/${type}`, { method: "POST" });
      await fetchSettings();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <UISettingsContext.Provider
      value={{
        settings,
        loading,
        getStyle,
        getComponent,
        getByType,
        isEnabled,
        saveSettings,
        resetType,
        refresh: fetchSettings,
      }}
    >
      {children}
    </UISettingsContext.Provider>
  );
};

export const useUISettings = () => {
  const ctx = useContext(UISettingsContext);
  if (!ctx) throw new Error("useUISettings must be used within UISettingsProvider");
  return ctx;
};
