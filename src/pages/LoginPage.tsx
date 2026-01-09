import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Calendar, Hash, AlertCircle } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { login } from '@/store/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [applicationNumber, setApplicationNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errors, setErrors] = useState<{ application?: string; dob?: string }>({});

  const validateForm = () => {
    const newErrors: { application?: string; dob?: string } = {};
    
    if (!applicationNumber.trim()) {
      newErrors.application = 'Application number is required';
    }
    
    if (!dateOfBirth) {
      newErrors.dob = 'Date of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Mock login - accept any valid input
    dispatch(login({
      applicationNumber,
      dateOfBirth,
      name: 'Candidate Name', // Mock name
    }));
    
    navigate('/instructions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-panel-bg to-background flex flex-col">
      {/* Header */}
      <header className="bg-exam-header text-exam-header-foreground py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-md">
            <span className="text-primary font-bold text-2xl">NTA</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">JEE Main 2024</h1>
            <p className="text-white/80">National Testing Agency</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
            {/* Form Header */}
            <div className="bg-primary/5 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <LogIn className="h-5 w-5 text-primary" />
                Candidate Login
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your credentials to start the examination
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Application Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Application Number / Hall Ticket Number
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={applicationNumber}
                    onChange={(e) => setApplicationNumber(e.target.value)}
                    placeholder="Enter your application number"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.application ? 'border-destructive' : 'border-input'
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
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                      errors.dob ? 'border-destructive' : 'border-input'
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
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              >
                Login to Exam
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 bg-secondary/50 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                For any technical issues, please contact the examination center supervisor.
              </p>
            </div>
          </div>

          {/* Demo Note */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Demo Mode: Enter any valid credentials to proceed
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-3 px-6">
        <p className="text-center text-sm text-muted-foreground">
          © 2024 National Testing Agency. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
