import React, {
  useState,
} from "react";

import axios from "axios";
import API_BASE from "../api";

import { toast }
from "react-toastify";



const Login = ({
  goToRegister,
  goToDashboard,
}) => {

  const [loginMethod, setLoginMethod] = useState("email");

  const [form, setForm] = useState({
      email: "",
      password: "",
      phone: "",
      otp: "",
    });

  const [step, setStep] = useState("credentials"); // "credentials" or "otp"
  const [loading,
    setLoading] =
    useState(false);
  const [loadingMessage,
    setLoadingMessage] =
    useState("");



  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSendOTP = async () => {
    try {
      const trimmedEmail = form.email.trim();
      const trimmedPhone = form.phone.trim();

      if (loginMethod === "email") {
        if (!trimmedEmail || !form.password) {
          return toast.error("Please enter email and password");
        }

        setLoadingMessage("Verifying credentials...");
        setLoading(true);

        await axios.post(
          `${API_BASE}/api/auth/login`,
          {
            email: trimmedEmail,
            password: form.password,
          }
        );

        setLoadingMessage("Sending OTP to email...");
        await axios.post(
          `${API_BASE}/api/email/send-otp`,
          {
            email: trimmedEmail,
          }
        );

        toast.success("OTP sent to your email");
      } else {
        if (!trimmedPhone) {
          return toast.error("Please enter your phone number");
        }

        setLoadingMessage("Sending OTP to phone...");
        setLoading(true);

        await axios.post(
          `${API_BASE}/api/sms/send-otp`,
          {
            phone: trimmedPhone,
            isRegistration: false,
          }
        );

        toast.success("OTP sent to your phone");
      }

      setStep("otp");
    } catch (err) {
      console.error("OTP Send Error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.msg || "Failed to send OTP";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleVerifyOTP = async () => {
    const trimmedOtp = form.otp.trim();
    if (!trimmedOtp) {
      return toast.error("Please enter the OTP");
    }

    try {
      setLoadingMessage("Verifying OTP...");
      setLoading(true);
      let res;
      const trimmedEmail = form.email.trim();
      const trimmedPhone = form.phone.trim();

      if (loginMethod === "email") {
        res = await axios.post(
          `${API_BASE}/api/email/verify-otp`,
          {
            email: trimmedEmail,
            otp: trimmedOtp,
            isRegistration: false,
          }
        );
      } else {
        res = await axios.post(
          `${API_BASE}/api/sms/verify-otp`,
          {
            phone: trimmedPhone,
            otp: trimmedOtp,
            isRegistration: false,
          }
        );
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful");
      goToDashboard();
    } catch (err) {
      console.error("OTP Verify Error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.msg || "OTP verification failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };



  const handleBackToCredentials = () => {
    setStep("credentials");
    setForm({ ...form, otp: "" });
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    if (step === "credentials") {
      return;
    } else {
      handleVerifyOTP();
    }
  };

  return (
    <div className="page">
      {loading && (
        <div className="page-loading-overlay">
          <div className="loading-panel">
            <div className="spinner" />
            <p>{loadingMessage || "Processing request..."}</p>
          </div>
        </div>
      )}

      <div className="card">

        <div className="method-toggle">
        <button
          type="button"
          className={loginMethod === "email" ? "active" : ""}
          onClick={() => {
            setLoginMethod("email");
            setStep("credentials");
            setForm({ ...form, otp: "" });
          }}
        >
          Email Login
        </button>
        <button
          type="button"
          className={loginMethod === "phone" ? "active" : ""}
          onClick={() => {
            setLoginMethod("phone");
            setStep("credentials");
            setForm({ ...form, otp: "" });
          }}
        >
          Phone Login
        </button>
      </div>

      {step === "credentials" ? (
          <>
            <h2>Login</h2>

            {loginMethod === "email" ? (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />

                <div className="password-box">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </>
            ) : (
              <input
                type="tel"
                name="phone"
                placeholder="Phone number (+1234567890)"
                value={form.phone}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            )}

            <div className="auth-buttons">
              <button
                onClick={handleSendOTP}
                disabled={loading || (loginMethod === "email" ? !form.email || !form.password : !form.phone)}
                className="email-button"
                style={{ width: "100%" }}
              >
                {loading ? "Sending..." : loginMethod === "email" ? "Send Email OTP" : "Send Phone OTP"}
              </button>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={goToRegister}
            >
              Create Account
            </button>
          </>
        ) : (
          <>
            <h2>Verify OTP</h2>
            <p>
              OTP sent to {loginMethod === "email" ? form.email : form.phone}
            </p>

            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength="6"
            />

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleBackToCredentials}
            >
              Back
            </button>
          </>
        )}


      </div>
    </div>
  );
};

export default Login;