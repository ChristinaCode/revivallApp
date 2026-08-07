function Dashboard() {
  return (
    <div>
      <h1>MissionPrep Dashboard</h1>

      <h2>Welcome, Christina!</h2>

      <p>🇧🇬 Destination: Sofia, Bulgaria</p>

      <section>
        <h3>Fundraising</h3>
        <p>$11,000 / $16,900</p>
        <progress value={11000} max={16900}></progress>
      </section>

      <section>
        <h3>Preparation Checklist</h3>
        <ul>
          <li>✅ Passport</li>
          <li>✅ Support Letters</li>
          <li>⬜ Visa</li>
          <li>✅ Purchase Flight</li>
        </ul>
      </section>

      <section>
        <h3>Announcements</h3>
        <p>📢 Team Zoom meeting on Saturday at 9:00 AM.</p>
      </section>
    </div>
  );
}

export default Dashboard;