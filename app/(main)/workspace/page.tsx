import React from "react";
import AssistantList from "./_components/AssistantList";
import ChatUi from "./_components/ChatUi";
import Settings from "./_components/Settings";

function workspace() {
  return (
    <div className="h-screen w-full pt-16">
      <div className="grid grid-cols-5 h-full">
        <div className="hidden md:block h-full overflow-y-auto">
          {/* assistant list */}
          <AssistantList />
        </div>
        <div className="md:col-span-4 lg:col-span-3 h-full overflow-y-auto">
          {/* chat ui */}
          <ChatUi />
        </div>
        <div className="hidden lg:block h-full overflow-y-auto">
          {/* settings */}
          <Settings />
        </div>
      </div>
    </div>
  );
}

export default workspace;
