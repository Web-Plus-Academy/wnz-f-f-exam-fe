import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Calendar, Hash, AlertCircle } from "lucide-react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { login } from "@/store/authSlice";
import { EXAM_START_TIME, EXAM_END_TIME } from "@/data/questions";
import Loader from "@/components/ui/Loader";
// import { userData } from "@/data/userdata";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [applicationNumber, setApplicationNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    application?: string;
    dob?: string;
  }>({});

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const examNotStarted = now < EXAM_START_TIME;
  const examClosed = now > EXAM_END_TIME;

  const formatDateTime = (timestamp: number) =>
    new Date(timestamp).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const formatCountdown = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const remainingSeconds = examNotStarted
    ? Math.max(0, Math.floor((EXAM_START_TIME - now) / 1000))
    : Math.max(0, Math.floor((EXAM_END_TIME - now) / 1000));

  const validateForm = () => {
    const newErrors: { application?: string; dob?: string } = {};

    if (!applicationNumber.trim()) {
      newErrors.application = "Application number is required";
    }

    if (!dateOfBirth) {
      newErrors.dob = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (examNotStarted || examClosed) return;

    if (!validateForm()) return;

    setLoading(true); // 🔥 START LOADER

    try {
      const responsePromise = await axios.post(`${API_URL}/api/exam-users/login`, {
        applicationNumber: applicationNumber.trim(),
        dob: dateOfBirth,
      });

      // ⏳ 10 second delay promise
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 10000));

      // Wait for BOTH: API + 10 sec delay
      const [response] = await Promise.all([responsePromise, delayPromise]);

      const user = response.data.user;

      // 🚫 If already submitted
      if (user.isSubmitted) {
        setLoading(false);
        setErrors({
          application: "Exam Already Submitted for this Application Number",
        });
        return;
      }

      // 🚫 If terminated
      if (user.terminated) {
        setLoading(false);
        setErrors({
          application: "Your exam has been terminated. Contact support.",
        });
        return;
      }

      // ✅ SUCCESS LOGIN
      dispatch(
        login({
          applicationNumber: user.applicationNumber,
          dateOfBirth: user.dob,
          name: user.name,
        }),
      );

      localStorage.setItem("examUser", JSON.stringify(user));
      navigate("/instructions");
    } catch (error: any) {
      setLoading(false);
      setErrors({
        application:
          error.response?.data?.message ||
          "Invalid Application Number or Date of Birth",
      });
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-panel-bg to-background flex flex-col">
        {/* Header */}
        <header className="bg-exam-header text-exam-header-foreground border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 flex items-center justify-center shadow-md">
                <img
                  src="./public/favicon.ico"
                  alt="WebNexZ Foundation"
                  className="w-20 h-20 object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  SW-CET 2026
                </h1>
                <p className="text-sm md:text-base text-white/80">
                  Saredufy - WebNexZ Common Entrance Test
                </p>
                <p className="text-xs text-white/60 mt-0.5">
                  Powered by{" "}
                  <span className="font-semibold text-white">
                    Saredufy Web Plus Academy Pvt. Ltd.
                  </span>
                </p>
              </div>
            </div>

            {/* Right: CBT + Date */}
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-white">
                Computer Based Test (CBT)
              </span>
              <span className="text-sm text-white/80">January 28, 2026</span>
              <span className="text-xs text-green-400 font-medium mt-0.5">
                AI-Proctored • Secure Examination
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6 bg-panel-bg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="bg-card rounded-xl shadow-xl border border-border overflow-hidden">
              {/* Form Header */}
              <div className="bg-primary/5 px-6 py-5 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <LogIn className="h-5 w-5 text-primary" />
                  Candidate Login
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Login using your registered credentials to access the
                </p>
              </div>

              {(examNotStarted || !examClosed) && (
                <div className="mb-4 rounded-xl border border-warning/30 bg-warning/10 p-4 text-center">
                  {/* Header */}
                  <div className="flex items-center justify-center gap-2 mb-1 text-warning font-semibold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Exam Window</span>
                  </div>

                  {/* ✅ Dynamic Date Range */}
                  <p className="text-sm text-foreground font-medium">
                    {formatDateTime(EXAM_START_TIME)} –{" "}
                    {formatDateTime(EXAM_END_TIME)}
                  </p>

                  {/* Countdown */}
                  {!examClosed && (
                    <p className="mt-1 text-xs text-warning/90">
                      {examNotStarted
                        ? "Exam starts in"
                        : "Exam session will close in"}{" "}
                      <span className="font-mono font-semibold">
                        {formatCountdown(remainingSeconds)}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {examClosed && (
                <p className="mt-1 text-base text-center font-semibold text-red-500">
                  Exam session has ended
                </p>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Application Number */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Application Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={applicationNumber}
                      onChange={(e) => setApplicationNumber(e.target.value)}
                      placeholder="Enter Application Number"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                        errors.application
                          ? "border-destructive"
                          : "border-input"
                      }`}
                    />
                  </div>
                  {errors.application && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.application}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date of Birth (as per application)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                        errors.dob ? "border-destructive" : "border-input"
                      }`}
                    />
                  </div>
                  {errors.dob && (
                    <p className="mt-1.5 text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.dob}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={examNotStarted || examClosed}
                  className={`w-full py-3 rounded-lg font-semibold ${
                    examNotStarted || examClosed
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {examNotStarted && "Exam Not Started Yet"}
                  {examClosed && "Exam Time Over"}
                  {!examNotStarted && !examClosed && "Proceed to Examination"}
                </button>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 bg-secondary/50 border-t border-border">
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  Ensure a stable internet connection before proceeding.
                  <br />
                  For technical assistance, contact the Examination Support
                  Desk.
                </p>
              </div>
            </div>

            {/* Demo Note */}
            <p className="text-center text-xs text-muted-foreground mt-4">
              AI-Proctored • Secure Examination
            </p>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-secondary border-t border-border py-3 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Saredufy-WebNexZ Common Entrance Test.
              <span className="mx-1">|</span>
              Powered by{" "}
              <span className="font-medium text-foreground">
                Saredufy Web Plus Academy Pvt. Ltd.
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              All rights reserved. Unauthorized attempts or malpractice is
              strictly prohibited.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LoginPage;
