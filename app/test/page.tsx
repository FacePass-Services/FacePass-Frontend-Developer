"use client";
import React, { useState, useRef, useEffect } from "react";
import SideNavigation from "@/components/components/SideNavigation";
import { Code } from "@nextui-org/code";
import { Snippet } from "@nextui-org/snippet";
import ShortCut from "@/components/components/ShortCut";
import FaceLogin from "@/components/face";
export default function App() {
  return (
    <main className="VStack h-full items-center md:w-10/12 pt-12 md:pt-0 w-10/12 gap-5 min-h-screen">
      <FaceLogin />
    </main>
  );
}
