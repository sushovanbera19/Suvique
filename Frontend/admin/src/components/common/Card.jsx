const Card = ({
  title,
  value,
  subtitle,
  icon,
  iconClass = "",
  children,
  className = "",
}) => {
  return (
    <div className={`dashboard-card ${className}`}>

      {(title || icon) && (
        <div className="card-header">

          {/* LEFT SIDE */}
          <div className="card-left">

            {icon && (
              <div className={`card-icon ${iconClass}`}>
                {icon}
              </div>
            )}

            <div>
              {title && (
                <h4 className="card-title">{title}</h4>
              )}

              {value && (
                <h2 className="card-value">{value}</h2>
              )}

              {subtitle && (
                <p className="card-subtitle">{subtitle}</p>
              )}
            </div>

          </div>

        </div>
      )}

      {children && (
        <div className="card-body">
          {children}
        </div>
      )}

    </div>
  );
};

export default Card;