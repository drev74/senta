"use client";

import type { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client";
import type { AxiosError } from "axios";
import { LogOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import AccountSessions from "@/components/accountSessions";
import AccountSettings from "@/components/accountSettings";
import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HandleError, kratos, LogoutLink } from "@/ory";

export default function Page() {
  const onLogout = LogoutLink();

  const [flow, setFlow] = useState<SettingsFlow>();

  const router = useRouter();
  const params = useSearchParams();

  const returnTo = params.get("return_to") ?? undefined;
  const flowId = params.get("flow") ?? undefined;

  const getFlow = useCallback((flowId: string) => {
    return kratos
      .getSettingsFlow({ id: String(flowId) })
      .then(({ data }) => setFlow(data))
      .catch(handleError);
  }, []);

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(
        getFlow,
        setFlow,
        "/flow/settings",
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
        .createBrowserSettingsFlow({ returnTo })
        .then(({ data }) => {
          setFlow(data);
          addQueryParam("flow", data.id);
        })
        .catch(handleError);
    },
    [handleError]
  );

  const updateFlow = async (body: UpdateSettingsFlowBody) => {
    kratos
      .updateSettingsFlow({
        flow: String(flow?.id),
        updateSettingsFlowBody: body,
      })
      .then(({ data }) => {
        // update flow object
        setFlow(data);

        // show toast for user feedback
        const message = data.ui.messages?.pop();
        if (message) {
          toast.success(message.text);
        }

        // check if verification is needed
        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case "show_verification_ui":
                router.push(`/verification?flow=${item.flow.id}`);
                return;
            }
          }
        }

        // check if custom return page was specified
        if (data.return_to) {
          window.location.href = data.return_to;
        }
      })
      .catch(handleError);
  };

  useEffect(() => {
    if (flow) {
      return;
    }

    if (flowId) {
      getFlow(flowId).then();
      return;
    }

    createFlow(returnTo);
  }, [flowId, router, returnTo, createFlow, getFlow]);

  const addQueryParam = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(params.toString());
      newParams.set(name, value);
      router.push(`?${newParams.toString()}`);
    },
    [params]
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center space-y-4 text-3xl">
      <div className="absolute right-4 top-4 flex w-fit flex-row items-center space-x-4">
        <ThemeToggle />
        <Button variant="outline" size="icon" onClick={onLogout}>
          <LogOut className="size-[1.2rem]" />
        </Button>
      </div>
      <Tabs
        defaultValue="account"
        value={params.get("tab") ?? undefined}
        className="w-full max-w-md"
        onValueChange={(value) => addQueryParam("tab", value)}
      >
        <TabsList className="mt-16 grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mb-16">
          <AccountSettings flow={flow} updateFlow={updateFlow} />
        </TabsContent>
        <TabsContent value="sessions" className="mb-16">
          <AccountSessions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
