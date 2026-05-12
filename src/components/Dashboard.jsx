import Profile from "./Profile";

const Dashboard = ({
  goToLogin,
}) => {

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    goToLogin();
  };

  return (
    <div className="page">
      <div className="card">

        <h2>Dashboard</h2>

        <p>
          Welcome 🎉
        </p>

        <Profile />

        <button onClick={logout}>
          Logout
        </button>

      </div>
    </div>
  );
};

export default Dashboard;