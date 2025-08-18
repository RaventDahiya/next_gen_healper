import React from "react";
import Provider from "./provider";
import Header from "./_components/Header";
function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <Provider>{children}</Provider>
    </div>
  );
}

export default WorkspaceLayout;
