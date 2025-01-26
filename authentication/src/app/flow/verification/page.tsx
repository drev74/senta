"use client";

import type { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client";
import type { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flow, HandleError, kratos } from "@/ory";

export default function Verification() {
  const [flow, setFlow] = useState<VerificationFlow>();

  const router = useRouter();
  const params = useSearchParams();

  const flowId = params.get("flow") ?? undefined;
  const returnTo = params.get("return_to") ?? undefined;

  const getFlow = useCallback((flowId: string) => {
    return kratos
      .getVerificationFlow({ id: String(flowId) })
      .then(({ data }) => setFlow(data))
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 410:
          case 403:
            return router.push("/flow/verification");
        }
        throw err;
      });
  }, []);

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(
        getFlow,
        setFlow,
        "/flow/verification",
        true,
        router
      );
      return handle(error);
    },
    [getFlow]
  );

  const createFlow = useCallback(
    (returnTo: string | undefined) => {
      kratos
        .createBrowserVerificationFlow({ returnTo })
        .then(({ data }) => {
          setFlow(data);
          router.push(`?flow=${data.id}`);
        })
        .catch(handleError);
    },
    [handleError]
  );

  const updateFlow = async (body: UpdateVerificationFlowBody) => {
    kratos
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: body,
      })
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleError);
  };

  useEffect(() => {
    if (flow) {
      return;
    }

    if (flowId) {
      getFlow(flowId);
      return;
    }

    createFlow(returnTo);
  }, [flowId, router, returnTo, flow]);

  return (
    <Card className="flex w-full max-w-sm flex-col items-center p-4">
      <Image
        className="mb-4 mt-10"
        width="64"
        height="64"
        src="/mt-logo-orange.png"
        alt="Markus Thielker Intranet"
      />
      <CardHeader className="flex flex-col items-center space-y-4 text-center">
        <CardTitle>Verify your account</CardTitle>
        <CardDescription className="max-w-xs">
          {flow?.ui.messages?.map((it) => {
            return <span key={it.id}>{it.text}</span>;
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        {flow ? (
          <Flow flow={flow} onSubmit={updateFlow} hideGlobalMessages />
        ) : (
          <div className="mt-3 flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-3 w-[80px] rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
            <Button disabled>
              <Skeleton className="h-4 w-[80px] rounded-md" />
            </Button>
          </div>
        )}
      </CardContent>
      {flow ? (
        <Button variant="link" asChild disabled={!flow}>
          <Link
            href={{
              pathname: "/flow/login",
              query: { return_to: flow.return_to },
            }}
            className="inline-flex space-x-2"
            passHref
          >
            Back to login
          </Link>
        </Button>
      ) : (
        <Skeleton className="my-3.5 h-3 w-[180px] rounded-md" />
      )}
    </Card>
  );
}
