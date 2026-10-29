import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MyBookingCard from "@/components/booking/MyBookingCard";
import { IBooking } from "@/lib/types/booking";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  // If user is not logged in, redirect them to login page
  if (!user || !user.email) {
    redirect("/login");
  }

  const token = await getTokenFromServer();
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in your environment variables.");
  }

  const res = await fetch(`${apiUrl}/my-bookings/${user.email}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch bookings: ${res.statusText}`);
  }

  const bookings: IBooking[] = await res.json();

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4 md:px-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-normal tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Manage and view your upcoming travel plans
        </p>
      </div>

      {/* Bookings List */}
      <div className="flex flex-col gap-6">
        {Array.isArray(bookings) && bookings.length > 0 ? (
          bookings.map((booking) => {
            return (
              <MyBookingCard booking={booking} key={booking._id} />
            );
          })
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            You don't have any bookings yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;