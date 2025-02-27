"use client";

import React from "react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { DollarSign, History, House, User } from "lucide-react";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function DockDemo() {
  return (
    <div className="relative mb-4">
      <Dock direction="middle">
        <DockIcon>
          <House className="size-6" />
        </DockIcon>
        <DockIcon>
          <DollarSign className="size-6" />
        </DockIcon>
        <DockIcon>
          <History className="size-6" />
        </DockIcon>
        <DockIcon>
          <User className="size-6" />
        </DockIcon>
      </Dock>
    </div>
  );
}
