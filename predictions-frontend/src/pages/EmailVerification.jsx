import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import authAPI from '../services/api/authAPI';
import Navbar from '../components/landingPage/Navbar';
import Button from '../components/ui/buttons/Button';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const OTP_LENGTH = 6;

export default function EmailVerification() {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [errors, setErrors] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const hasInitialized = useRef(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const reduceMotion = usePrefersReducedMotion();

  const flowType = searchParams.get('flow') || 'signup';
  const email = searchParams.get('email') || location.state?.email || '';
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const otp = digits.join('');

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (flowType === 'oauth') {
      navigate('/auth/finish-onboarding', { replace: true });
      return;
    }

    if (!email) {
      console.error('No email provided for verification');
      navigate('/signup', { replace: true });
      return;
    }

    setUserEmail(email);
    sendOtp();
  }, [email, navigate, flowType]);

  const sendOtp = async () => {
    try {
      setIsOtpSent(false);

      await authAPI.sendVerifyOtp({
        email: email,
        type: 'email_verification',
      });

      setIsOtpSent(true);
    } catch {
      setErrors({ submit: 'Failed to send verification code. Please try again.' });
    }
  };

  const applyDigits = (next) => {
    setDigits(next);
    if (errors.otp || errors.submit) {
      setErrors({});
    }
  };

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      applyDigits(next);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, OTP_LENGTH).split('');
      const next = Array(OTP_LENGTH).fill('');
      chars.forEach((char, i) => {
        next[i] = char;
      });
      applyDigits(next);
      inputRefs.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned.slice(-1);
    applyDigits(next);
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!text) return;
    const next = Array(OTP_LENGTH).fill('');
    text.split('').forEach((char, i) => {
      next[i] = char;
    });
    applyDigits(next);
    inputRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  };

  const validateOtp = () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = 'Verification code is required';
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'Please enter a valid 6-digit code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOtp()) return;

    setIsVerifying(true);

    try {
      await authAPI.verifyOtp({
        email: email,
        otp: otp,
        type: 'email_verification',
      });

      setIsVerifying(false);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('EmailVerification - Verify error:', error);
      setIsVerifying(false);
      setErrors({ otp: 'Invalid verification code. Please try again.' });
    }
  };

  const handleResendOtp = async () => {
    setDigits(Array(OTP_LENGTH).fill(''));
    setErrors((prev) => ({ ...prev, otp: null }));
    await sendOtp();
    inputRefs.current[0]?.focus();
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-dvh overflow-hidden bg-surface-app">
        <Container size="2" className="relative z-10 mt-20 pb-16 pt-32">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-md overflow-hidden rounded-lg border border-border-card bg-surface-card p-8 shadow-card"
          >
            <div className="mb-8 text-center">
              <h1 className="mb-2 font-dmSerif text-2xl font-bold text-text-primary">
                verify your email
              </h1>
              <div className="font-outfit text-sm text-text-muted">
                <p className="mb-1">we've sent a 6-digit verification code to</p>
                <p className="font-medium text-brand-teal-deep">{userEmail}</p>
              </div>
            </div>

            {(errors.submit || errors.otp) && (
              <div className="mb-6 rounded-lg border border-state-error/30 bg-state-error/10 px-4 py-3 font-outfit text-sm text-state-error">
                {errors.submit || errors.otp}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block font-outfit text-sm font-medium text-text-secondary">
                  verification code
                </label>
                <div className="flex justify-between gap-2">
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      pattern="[0-9]*"
                      maxLength={index === 0 ? OTP_LENGTH : 1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                      className={`h-12 w-10 rounded-md border bg-surface-elevated text-center font-dmSerif text-xl text-text-primary outline-none transition-colors sm:h-14 sm:w-12 sm:text-2xl ${
                        errors.otp
                          ? 'border-state-error focus:border-state-error'
                          : 'border-border-control focus:border-brand-teal'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" loading={isVerifying} disabled={!otp} className="w-full">
                {isVerifying ? 'verifying...' : 'verify email'}
              </Button>

              <div className="text-center">
                <p className="mb-2 font-outfit text-sm text-text-muted">
                  didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-outfit text-sm font-medium text-brand-teal-deep underline disabled:opacity-50"
                  disabled={!isOtpSent || isVerifying}
                >
                  resend code
                </button>
              </div>
            </form>
          </motion.div>
        </Container>
      </div>
    </>
  );
}
