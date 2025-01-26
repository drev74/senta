"use client";

import type { Session } from "@ory/client";
import React, { useEffect, useState } from "react";
import type { IResult } from "ua-parser-js";
import { UAParser } from "ua-parser-js";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SessionItemProps {
  session: Session;
  showInvalidate: boolean;
  invalidateSession: (id: string) => void;
}

export default function SessionItem({
  session,
  showInvalidate,
  invalidateSession,
}: SessionItemProps) {
  const [result, setResult] = useState<IResult | null>(null);

  useEffect(() => {
    if (!session.devices || session.devices.length < 1) {
      return;
    }

    const device = session.devices[0];

    const parser = new UAParser(device.user_agent);
    setResult(parser.getResult());
  }, [setResult, session]);

  return result ? (
    <Card className="relative w-full">
      <CardHeader>
        <CardTitle>{result.os.name}</CardTitle>
        <CardDescription>
          {result.browser.name}, version {result.browser.version} <br />
          Signed in since{" "}
          {new Date(session.authenticated_at!!).toLocaleString()}
        </CardDescription>
      </CardHeader>
      {showInvalidate ? (
        <Button
          className="absolute right-4 top-4"
          onClick={() => invalidateSession(session.id)}
        >
          Invalidate
        </Button>
      ) : (
        <Badge className="absolute right-4 top-4">This session</Badge>
      )}
    </Card>
  ) : (
    <div>Loading...</div>
  );
}
