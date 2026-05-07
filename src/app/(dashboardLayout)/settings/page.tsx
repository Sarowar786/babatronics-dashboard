"use client";
import { BasicForm } from "@/components/Settings/BasicForm";
import { PasswordForm } from "@/components/Settings/PasswordForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("basic");

  const menu = [
    { id: "basic", label: "Basic" },
    { id: "account", label: "Account" },
    // { id: "theme", label: "Change App Theme" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicForm />;
      case "account":
        return <PasswordForm />;
      default:
        return null;
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className=" bg-card p-4 rounded-xl space-y-4">
          {menu.map((item) => (
            <Button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full h-15 cursor-pointer px-4 py-3 rounded-lg flex justify-between items-center transition ${
                activeTab === item.id
                  ? ""
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {item.label}
              <span>›</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3 bg-card p-6 rounded-xl">
        {renderContent()}
      </div>
    </div>
  );
}
