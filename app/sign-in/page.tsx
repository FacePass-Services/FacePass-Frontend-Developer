// App.tsx
"use client";
import React from "react";
import SignInForm from "@/components/SignInForm";

const App = () => {
  return (
    <section className="VStack  h-full text-center items-center pt-12 md:pt-0 w-10/12  md:w-7/12 md:justify-center gap-5 min-h-screen">
      <p className="font-semibold text-3xl">
        {" "}
        Sign In to FacePass Developer Account
      </p>
      <p>Manage your FacePass account</p> <SignInForm isDeveloperPage={true} />
    </section>
  );
};

export default App;
