import React from "react";
import { ForgotPasswordForm } from "./_components/forgot-password-form";


const RecoverPasswordPage = () => {
  
  return (
    <div className="min-h-[calc(100vh)] w-full flex justify-center bg-blue-50">
      <div className="container w-full flex items-center justify-center h-fit pt-10">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
