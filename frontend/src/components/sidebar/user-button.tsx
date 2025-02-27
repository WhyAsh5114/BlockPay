"use client";

import { ChevronDown, LoaderCircle, User2, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function UserButton() {
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address: account.address });

  if (account.status === "connecting") {
    return (
      <Button disabled>
        <LoaderCircle className="animate-spin" /> Connecting
      </Button>
    );
  }

  if (!account.isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Wallet /> Connect wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width]"
        >
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.uid}
              onClick={() => connect({ connector })}
            >
              {connector.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-48 mx-auto">
          <User2 />{" "}
          <span className="truncate">{ensName ?? account.address}</span>
          <ChevronDown className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem onClick={() => disconnect()}>
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
