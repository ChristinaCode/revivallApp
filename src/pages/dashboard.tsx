function Dashboard() {
  return (
    <div>
      <h1>MissionPrep Dashboard</h1>

      <h2>Welcome, Christina!</h2>

      <p>🇧🇬 Destination: Sofia, Bulgaria</p>

      <section>
        <h3>Fundraising</h3>
        <p>$8,450 / $13,000</p>
        <progress value={8450} max={13000}></progress>
      </section>

      <section>
        <h3>Preparation Checklist</h3>
        <ul>
          <li>✅ Passport</li>
          <li>✅ Support Letters</li>
          <li>⬜ Visa</li>
          <li>⬜ Purchase Flight</li>
        </ul>
      </section>

      <section>
        <h3>Announcements</h3>
        <p>📢 Team Zoom meeting on Thursday at 7:00 PM.</p>
      </section>
    </div>
  );
}

export default Dashboard;