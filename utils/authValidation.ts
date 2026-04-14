import { LoginErrors, SignupErrors } from "../types/auth";

export const validateForgotPasswordEmail = (email: string) => {
  if (!email.trim()) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Invalid email";

  return "";
};

export const validateSignupForm = ({
  fullName,
  email,
  password,
  confirmPassword,
}: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const errors: SignupErrors = {};

  if (!fullName.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = "Invalid email";
    }
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Minimum 6 characters";
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Confirm your password";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export const validateLoginForm = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = "Invalid email";
    }
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Minimum 6 characters";
  }

  return errors;
};