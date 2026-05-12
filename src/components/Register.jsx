import React, {
  useState,
} from "react";

import axios from "axios";
import API_BASE from "../api";

import { toast }
from "react-toastify";


const Register = ({
  goToLogin,
  goToDashboard,
}) => {

  const [form, setForm] =
    useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: "",
      profilePhoto: null,
      phone: "",
      emailOtp: "",
      phoneOtp: "",
    });

  const [step, setStep] =
    useState("register");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);
  const [loadingMessage,
    setLoadingMessage] =
    useState("");

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === "email") {
      setEmailVerified(false);
    }

    if (name === "phone") {
      setPhoneVerified(false);
    }
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      profilePhoto: e.target.files[0],
    });
  };


  const handleRegister =
    async () => {

      if (
        form.password !==
        form.confirmPassword
      ) {
        return toast.error(
          "Passwords do not match"
        );
      }

      if (!form.username || !form.email || !form.age || !form.profilePhoto || !form.phone) {
        return toast.error(
          "Fill all fields and select a profile photo"
        );
      }

      if (!emailVerified) {
        return toast.error(
          "Please verify your email before registering"
        );
      }

      if (!phoneVerified) {
        return toast.error(
          "Please verify your phone number before registering"
        );
      }

      try {
        setLoadingMessage("Registering user...");
        setLoading(true);

        const data = new FormData();
        data.append("username", form.username);
        data.append("email", form.email);
        data.append("password", form.password);
        data.append("age", form.age);
        data.append("phone", form.phone);
        data.append("profilePhoto", form.profilePhoto);

        const res = await axios.post(
          `${API_BASE}/api/auth/register`,
          data
        );

        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data.user
          )
        );

        toast.success(
          "Registration completed successfully"
        );
        goToDashboard();
      } catch (err) {
        toast.error(
          err.response?.data?.msg ||
          "Registration failed"
        );
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
    };

  const handleSendEmailOTP = async () => {
    if (!form.email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoadingMessage("Sending email OTP...");
      setLoading(true);

      await axios.post(
        `${API_BASE}/api/email/send-otp`,
        {
          email: form.email,
          isRegistration: true,
        }
      );

      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };


  const handleVerifyEmailOTP = async () => {
    if (!form.emailOtp) {
      return toast.error("Please enter the email OTP");
    }

    try {
      setLoadingMessage("Verifying email OTP...");
      setLoading(true);

      await axios.post(
        `${API_BASE}/api/email/verify-otp`,
        {
          email: form.email,
          otp: form.emailOtp,
          isRegistration: true,
        }
      );

      setEmailVerified(true);
      toast.success("Email verified successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Email OTP verification failed"
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleSendPhoneOTP = async () => {
    if (!form.email || !form.phone) {
      return toast.error("Please enter both email and phone number before sending phone OTP");
    }

    try {
      setLoadingMessage("Sending phone OTP...");
      setLoading(true);

      await axios.post(
        `${API_BASE}/api/sms/send-otp`,
        {
          email: form.email,
          phone: form.phone,
          isRegistration: true,
        }
      );

      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to send SMS OTP"
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleVerifyPhoneOTP = async () => {
    if (!form.phoneOtp) {
      return toast.error("Please enter the phone OTP");
    }

    try {
      setLoadingMessage("Verifying phone OTP...");
      setLoading(true);

      await axios.post(
        `${API_BASE}/api/sms/verify-otp`,
        {
          email: form.email,
          phone: form.phone,
          otp: form.phoneOtp,
          isRegistration: true,
        }
      );

      setPhoneVerified(true);
      toast.success("Phone verified successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Phone OTP verification failed"
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };



  const handleBack = () => {
    setStep("register");
    setForm({ ...form, emailOtp: "", phoneOtp: "" });
    setEmailVerified(false);
    setPhoneVerified(false);
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

        <>
          <h2>Register</h2>

            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
            />

            <div className="input-with-action">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleSendEmailOTP}
                disabled={loading || emailVerified || !form.email}
                className="small-button"
              >
                {emailVerified ? "✓ Email Verified" : "Send Email OTP"}
              </button>
            </div>

            {!emailVerified && (
              <div className="otp-field-group">
                <input
                  type="text"
                  name="emailOtp"
                  placeholder="Enter email OTP"
                  value={form.emailOtp}
                  onChange={handleChange}
                  maxLength="6"
                />
                <button
                  type="button"
                  onClick={handleVerifyEmailOTP}
                  disabled={loading}
                  className="small-button"
                >
                  Verify
                </button>
              </div>
            )}

            <div className="input-with-action">
              <input
                type="tel"
                name="phone"
                placeholder="Phone number (+1234567890)"
                value={form.phone}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={handleSendPhoneOTP}
                disabled={loading || phoneVerified || !form.phone || !form.email}
                className="small-button"
              >
                {phoneVerified ? "✓ Phone Verified" : "Send Phone OTP"}
              </button>
            </div>

            {!phoneVerified && (
              <div className="otp-field-group">
                <input
                  type="text"
                  name="phoneOtp"
                  placeholder="Enter phone OTP"
                  value={form.phoneOtp}
                  onChange={handleChange}
                  maxLength="6"
                />
                <button
                  type="button"
                  onClick={handleVerifyPhoneOTP}
                  disabled={loading}
                  className="small-button"
                >
                  Verify
                </button>
              </div>
            )}

            <input
              type="file"
              name="profilePhoto"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                name="password"

                placeholder="Password"

                value={form.password}
                onChange={handleChange}
              />

              <span
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                👁️
              </span>

            </div>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              name="confirmPassword"

              placeholder="Confirm Password"

              value={form.confirmPassword}
              onChange={handleChange}
            />

            <input
              type="number"

              name="age"

              placeholder="Age"

              value={form.age}
              onChange={handleChange}
            />

            <button
              onClick={handleRegister}
              disabled={loading || !emailVerified}
            >
              {loading
                ? "Registering..."
                : "Complete Registration"}
            </button>

            <button
              className="secondary-button"

              onClick={goToLogin}
            >
              Already have account?
            </button>
          </>
      </div>
    </div>
  );
};

export default Register;
