const SettingsSaveButton = ({ text = "Save Changes", onClick }) => {
  return (
    <div className="settings-section-actions">
      <button
        type="button"
        className="settings-page-btn-save"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default SettingsSaveButton;