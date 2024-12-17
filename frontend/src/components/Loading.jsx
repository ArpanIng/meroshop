import React from "react";
import { Spinner } from "flowbite-react";

function Loading() {
  return (
    <div className="py-4 text-center">
      <Spinner size="lg" />
    </div>
  );
}

export default Loading;
