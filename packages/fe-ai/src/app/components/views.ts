import React from "react";
import CoreWelcome from "@frontend-ai/app/components/core/welcome";

export type ViewRegistry = {[valueObjectName: string]: React.FunctionComponent<any>}

export const views: ViewRegistry = {
  "Core.Welcome": CoreWelcome,
};
