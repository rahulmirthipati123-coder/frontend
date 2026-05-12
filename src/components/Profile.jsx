import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import API_BASE from "../api";

const Profile = () => {

  const [user, setUser] =
    useState(null);
  const [zoomed, setZoomed] =
    useState(false);

  useEffect(() => {

    const fetchProfile =
      async () => {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            `${API_BASE}/api/user/profile`,
            {
              headers: {
                authorization:
                  token,
              },
            }
          );

        setUser(res.data);
      };

    fetchProfile();

  }, []);

  return (
    <div className="profile-info">
      <h3>Profile</h3>

      {user && (
        <>
          {user.profilePhoto && (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="profile-photo"
                  style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setZoomed(true)}
                />
              </div>

              {zoomed && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                    padding: "16px",
                  }}
                  onClick={() => setZoomed(false)}
                >
                  <div
                    style={{
                      position: "relative",
                      maxWidth: "90%",
                      maxHeight: "90%",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={user.profilePhoto}
                      alt="Profile Zoom"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "90vh",
                        borderRadius: "12px",
                        objectFit: "contain",
                      }}
                    />
                    <button
                      onClick={() => setZoomed(false)}
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        border: "none",
                        borderRadius: "999px",
                        width: "36px",
                        height: "36px",
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <p>
            <strong>Username:</strong> {user.username}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Phone:</strong> {user.phone}
          </p>

          <p>
            <strong>Age:</strong> {user.age}
          </p>
        </>
      )}
    </div>
  );
};

export default Profile;