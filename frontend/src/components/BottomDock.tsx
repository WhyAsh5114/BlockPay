"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { DollarSign, History, House, User } from "lucide-react";
import Link from "next/link";
import React from "react";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function DockDemo() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 mb-4">
      <Dock direction="middle">
        <Link href="/dashboard">
          <DockIcon>
            <House className="size-6" />
          </DockIcon>
        </Link>
        <Link href="/pay">
          <DockIcon>
            <DollarSign className="size-6" />
          </DockIcon>
        </Link>
        <Link href="/payment-history">
          <DockIcon>
            <History className="size-6" />
          </DockIcon>
        </Link>
        <Link href="/contacts">
          <DockIcon>
            <User className="size-6" />
          </DockIcon>
        </Link>
      </Dock>
    </div>
  );
}
