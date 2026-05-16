import React from 'react';
import '../assets/style/AccountHeader.css';

function AccountHeader() {
  return (
    <div className="account-header-container">
      <div className="table-visual">
        <div className="table-top">
          <h1 className="page-title">My Account</h1>
        </div>
        <div className="breadcrumb">
          Home → Create account
        </div>
      </div>
    </div>
  );
}

export default AccountHeader;
