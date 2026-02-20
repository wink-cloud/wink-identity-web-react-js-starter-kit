import { useWinkAuth } from "./hooks/useWinkAuth";

const App = () => {
  const {
    winkClient,
    userProfile,
    isAuthenticated,
    authState,
    isProfileLoading,
    authError,
    refreshUserProfile,
    login,
    logout,
  } = useWinkAuth();

  const isBusy = authState === "logging_in" || authState === "logging_out";

  return (
    <div className="container">
      <h2>Wink Identity Verification</h2>
      <p>Use this starter to complete an end-to-end Wink login flow.</p>
      <p className="status-line">
        <strong>Status:</strong> {authState}
      </p>

      {!isAuthenticated ? (
        <button
          id="loginBtn"
          onClick={login}
          disabled={!winkClient || isBusy}
        >
          Login with Wink
        </button>
      ) : (
        <div className="button-row">
          <button id="logoutBtn" onClick={logout} disabled={isBusy}>
            Logout
          </button>
          <button
            id="refreshProfileBtn"
            className="secondary-button"
            onClick={refreshUserProfile}
            disabled={isBusy}
          >
            Refresh Profile
          </button>
        </div>
      )}

      {isProfileLoading ? <p>Loading user profile...</p> : null}
      {authError ? (
        <p className="error-message">
          [{authError.step}] {authError.message}
        </p>
      ) : null}

      {isAuthenticated ? (
        <div id="userProfileCard" className="user-profile-card">
          <h3 className="user-profile-title">Authenticated User Profile</h3>
          {!userProfile ? (
            <p>User profile is not available yet. Click Refresh Profile.</p>
          ) : (
            <>
              <p>
                <strong>First Name:</strong> {userProfile.firstName ?? "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {userProfile.lastName ?? "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {userProfile.email ?? "N/A"}
              </p>
              <p>
                <strong>Contact Number:</strong> {userProfile.contactNo ?? "N/A"}
              </p>
              <p>
                <strong>Wink Tag:</strong> {userProfile.winkTag ?? "N/A"}
              </p>
              <p>
                <strong>Wink Token:</strong> {userProfile.winkToken ?? "N/A"}
              </p>
              <p>
                <strong>Profile Expiry Time:</strong> {userProfile.expiryTime ?? "N/A"}
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default App;
