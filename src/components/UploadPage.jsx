import React from "react";
import UploadUFDR from "../components/UploadUFDR";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Upload UFDR Report
        </h1>

        <div className="bg-card p-6 rounded-xl shadow-md">
          <UploadUFDR />
        </div>
      </div>
    </div>
  );
}
