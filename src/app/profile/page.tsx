"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (err) {
        console.error("Failed to fetch session", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">You are not logged in.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  const { user } = session;

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Avatar className="size-24">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-light">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg border border-border p-4 text-sm bg-muted/30">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Email Verified:</span>
              <span>{user.emailVerified ? "Yes" : "No"}</span>
            </div>
          </div>

          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="w-full mt-4"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}