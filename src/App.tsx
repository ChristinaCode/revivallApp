function App() {
  return (
    <div>
      <h1>RevivALL Prep</h1>

      <h2>Welcome, Christina!</h2>

      <section>
        <h3>Fundraising</h3>
        <p>$8,450 / $13,000 raised</p>
        <progress value="8450" max="13000"></progress>
      </section>

      <section>
        <h3>Upcoming Tasks</h3>
        <ul>
          <li>✅ Passport</li>
          <li>✅ Support Letter</li>
          <li>⬜ Visa Documents</li>
          <li>⬜ Packing List</li>
        </ul>
      </section>

      <section>
        <h3>Resources</h3>
        <button>Bible Studies</button>
        <button>Travel Documents</button>
        <button>Bulgarian Learning</button>
      </section>
    </div>
  );
}

export default App;