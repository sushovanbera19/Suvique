import React from 'react';
import '../assets/style/AccountHeader.css';
import { useTranslation } from '../context/LanguageContext';

function AccountHeader({ title, breadcrumb }) {
  const { t } = useTranslation();
  const displayTitle = title || t("account.myAccount");
  const displayBreadcrumb = breadcrumb || `${t("account.home")} → ${t("account.myAccount")}`;

  return (
    <div className="account-header-container">
      <div className="table-visual">
        <div className="table-top">
          <h1 className="page-title">{displayTitle}</h1>
        </div>
        <div className="breadcrumb">
          {displayBreadcrumb}
        </div>
      </div>
    </div>
  );
}

export default AccountHeader;
