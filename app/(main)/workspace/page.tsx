import React from "react";
import AssistantList from "./_components/AssistantList";
import ChatUi from "./_components/ChatUi";
import Settings from "./_components/Settings";

function workspace() {
  return (
    <div className="h-screen fixed w-full">
      <div className="grid grid-cols-5">
        <div className="hidden md:block">
          {/* assistant list */}
          <AssistantList />
        </div>
        <div className="md:col-span-4 lg:col-span-3">
          {/* chat ui */}
          <ChatUi />
        </div>
        <div className="hidden lg:block">
          {/* settings */}
          <Settings />
        </div>
      </div>
    </div>
  );
}

export default workspace;
