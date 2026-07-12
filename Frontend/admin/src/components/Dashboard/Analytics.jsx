import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import "../../assets/style/Analytics.css";

const Analytics = () => {

  /* TOP STATS */
  const statsData = [
    {
      id: 1,
      title: "Total Users",
      value: "9,789",
      growth: "+0.89%",
      color: "green",
    },
    {
      id: 2,
      title: "Live Visitors",
      value: "12,240",
      growth: "-0.59%",
      color: "red",
    },
    {
      id: 3,
      title: "Bounce Rate",
      value: "77.3%",
      growth: "+0.59%",
      color: "orange",
    },
  ];

  /* COUNTRY DATA */
  const countries = [
    {
      id: 1,
      name: "United States",
      value: "32,190",
      flag: "🇺🇸",
    },
    {
      id: 2,
      name: "Germany",
      value: "8,278",
      flag: "🇩🇪",
    },
    {
      id: 3,
      name: "Mexico",
      value: "16,885",
      flag: "🇲🇽",
    },
    {
      id: 4,
      name: "UAE",
      value: "14,885",
      flag: "🇦🇪",
    },
    {
      id: 5,
      name: "Argentina",
      value: "17,578",
      flag: "🇦🇷",
    },
  ];

  /* CHANNEL TABLE */
  const channelData = [
    {
      id: 1,
      channel: "Organic Search",
      sessions: 782,
      bounce: "32.09%",
      duration: "0 hrs : 0 mins : 32 secs",
      goal: 278,
      pages: 2.9,
    },
    {
      id: 2,
      channel: "Direct",
      sessions: 882,
      bounce: "39.38%",
      duration: "0 hrs : 2 mins : 45 secs",
      goal: 782,
      pages: 1.5,
    },
    {
      id: 3,
      channel: "Referral",
      sessions: 322,
      bounce: "22.67%",
      duration: "0 hrs : 38 mins : 28 secs",
      goal: 622,
      pages: 3.2,
    },
  ];

  return (
   <div className="analytics-page">

  {/* ======================================================
      PAGE HEADER
  ====================================================== */}
  <div className="analytics-page-header">

    <div className="analytics-page-top">

      <h1 className="analytics-page-title">
        Analytics
      </h1>

      <Breadcrumb />

    </div>

  </div>

  {/* ======================================================
      MAIN TOP WRAPPER
  ====================================================== */}
  <div className="analytics-top-wrapper">

    {/* ======================================================
        LEFT SIDE
    ====================================================== */}
    <div className="analytics-left-side">

      {/* ======================================================
          TOP STATS GRID
      ====================================================== */}
      <div className="analytics-top-cards">

        {statsData.map((item) => (
          <Card
            key={item.id}
            className="analytics-top-stat-card"
          >

            <div className="analytics-stat-card">

              <div className="analytics-stat-content">

                <h4 className="analytics-stat-title">
                  {item.title}
                </h4>

                <h2 className="analytics-stat-value">
                  {item.value}
                </h2>

                <span
                  className={`analytics-growth ${item.color}`}
                >
                  {item.growth}
                </span>

              </div>

            </div>

          </Card>
        ))}

        {/* PROMO */}
        <Card className="analytics-promo-wrapper">

          <div className="analytics-promo-card">

            <div className="analytics-promo-content">

              <h3 className="analytics-promo-title">
                Plan is expiring!
              </h3>

              <p className="analytics-promo-text">
                Upgrade to premium
              </p>

              <button className="analytics-promo-btn">
                Upgrade Now
              </button>

            </div>

          </div>

        </Card>

      </div>

      {/* ======================================================
          AUDIENCE SECTION
      ====================================================== */}
      <Card
        title="Audience Report"
        className="analytics-audience-card"
      >

        <div className="analytics-audience-wrapper">

          <div className="analytics-audience-top">

            <div className="analytics-chart-legends">

              <div className="analytics-legend-item">

                <span className="legend-dot purple"></span>

                <span>Views</span>

              </div>

              <div className="analytics-legend-item">

                <span className="legend-dot blue"></span>

                <span>Followers</span>

              </div>

            </div>

            <button className="analytics-export-btn">
              Export
            </button>

          </div>

          <div className="analytics-audience-chart">

            <div className="analytics-chart-placeholder">
              Audience Chart
            </div>

          </div>

        </div>

      </Card>

    </div>

    {/* ======================================================
        RIGHT SIDE
    ====================================================== */}
    <div className="analytics-right-side">

      {/* ======================================================
          DEVICE CARD
      ====================================================== */}
      <Card className="analytics-device-wrapper">

        <div className="analytics-device-card">

          <div className="analytics-device-header">

            <h4 className="analytics-device-title">
              Sessions By Device
            </h4>

            <span className="analytics-view-all">
              View All
            </span>

          </div>

          <div className="analytics-donut-chart">

            <div className="analytics-donut-inner">

              <h3>Total</h3>

              <p>4136</p>

            </div>

          </div>

          <div className="analytics-device-stats">

            <div className="analytics-device-item">

              <strong>68.3%</strong>

              <span>Mobile</span>

            </div>

            <div className="analytics-device-item">

              <strong>17.68%</strong>

              <span>Tablet</span>

            </div>

            <div className="analytics-device-item">

              <strong>10.5%</strong>

              <span>Desktop</span>

            </div>

          </div>

        </div>

      </Card>

      {/* ======================================================
          SMALL STATS
      ====================================================== */}
      <div className="analytics-small-cards">

        <Card className="analytics-small-wrapper">

          <div className="analytics-small-card">

            <div className="analytics-progress-circle blue">

              <span>48%</span>

            </div>

            <div className="analytics-small-info">

              <p>Impressions</p>

              <h3>9,903</h3>

            </div>

          </div>

        </Card>

        <Card className="analytics-small-wrapper">

          <div className="analytics-small-card">

            <div className="analytics-progress-circle orange">

              <span>65%</span>

            </div>

            <div className="analytics-small-info">

              <p>Clicks</p>

              <h3>16,789</h3>

            </div>

          </div>

        </Card>

      </div>

    </div>

  </div>

  {/* ======================================================
      LOWER SECTION
  ====================================================== */}
  <div className="analytics-lower-section">

    {/* COUNTRY REPORT */}
    <Card
      title="Top Countries Sessions Vs Bounce Rate"
      className="analytics-country-report-card"
    >

      <div className="analytics-country-chart">

        <div className="analytics-chart-placeholder">
          Country Chart
        </div>

      </div>

    </Card>

    {/* TRAFFIC SOURCES */}
    <Card
      title="Traffic Sources"
      className="analytics-traffic-card"
    >

      <table className="analytics-table">

        <thead>

          <tr>

            <th>Browser</th>

            <th>Sessions</th>

            <th>Traffic</th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>Google</td>

            <td>23,379</td>

            <td>
              <div className="analytics-traffic-bar purple"></div>
            </td>

          </tr>

          <tr>

            <td>Safari</td>

            <td>78,973</td>

            <td>
              <div className="analytics-traffic-bar blue"></div>
            </td>

          </tr>

          <tr>

            <td>Opera</td>

            <td>12,457</td>

            <td>
              <div className="analytics-traffic-bar green"></div>
            </td>

          </tr>

        </tbody>

      </table>

    </Card>

    {/* SESSION CHART */}
    <Card
      title="Sessions Duration By New Users"
      className="analytics-session-card"
    >

      <div className="analytics-session-chart">

        <div className="analytics-chart-placeholder">
          Session Chart
        </div>

      </div>

    </Card>

  </div>

  {/* ======================================================
      BOTTOM SECTION
  ====================================================== */}
  <div className="analytics-bottom-section">

    {/* CHANNEL TABLE */}
    <Card
      title="Visitors By Channel Report"
      className="analytics-channel-card"
    >

      <div className="analytics-channel-table-wrapper">

        <table className="analytics-table">

          <thead>

            <tr>

              <th>S.No</th>

              <th>Channel</th>

              <th>Sessions</th>

              <th>Bounce Rate</th>

              <th>Avg Session Duration</th>

              <th>Goal Completed</th>

              <th>Pages Per Session</th>

            </tr>

          </thead>

          <tbody>

            {channelData.map((item, index) => (

              <tr key={item.id}>

                <td>{index + 1}</td>

                <td>{item.channel}</td>

                <td>{item.sessions}</td>

                <td>{item.bounce}</td>

                <td>{item.duration}</td>

                <td>{item.goal}</td>

                <td>{item.pages}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </Card>

    {/* COUNTRY LIST */}
    <Card
      title="Visitors By Countries"
      className="analytics-country-card"
    >

      <div className="analytics-country-list">

        {countries.map((country) => (

          <div
            key={country.id}
            className="analytics-country-item"
          >

            <div className="analytics-country-left">

              <span className="analytics-flag">
                {country.flag}
              </span>

              <span className="analytics-country-name">
                {country.name}
              </span>

            </div>

            <strong className="analytics-country-value">
              {country.value}
            </strong>

          </div>

        ))}

      </div>

    </Card>

  </div>

</div>
  );
};

export default Analytics;