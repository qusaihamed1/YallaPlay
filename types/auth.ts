export type ForgotPasswordFormProps = {
    email: string;
    error?: string;
    loading: boolean;
    onChangeEmail: (value: string) => void;
    onSubmit: () => void;
    onBackToLogin: () => void;
  };
  
  export type SignupErrors = {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  
  export type SignupFormProps = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    errors: SignupErrors;
    loading: boolean;
    onChangeFullName: (value: string) => void;
    onChangeEmail: (value: string) => void;
    onChangePassword: (value: string) => void;
    onChangeConfirmPassword: (value: string) => void;
    onSubmit: () => void;
    onGoToLogin: () => void;
  };
  
  export type LoginErrors = {
    email?: string;
    password?: string;
  };
  
  export type LoginFormProps = {
    email: string;
    password: string;
    errors: LoginErrors;
    loading: boolean;
    onChangeEmail: (value: string) => void;
    onChangePassword: (value: string) => void;
    onSubmit: () => void;
    onForgotPassword: () => void;
    onGoToSignup: () => void;
  };