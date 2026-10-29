"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Calendar, Eye, Ticket, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { IBooking } from "@/lib/types/booking";
import { useRouter } from "next/navigation";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const MyBookingCard = ({ booking }: { booking: IBooking }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setLoading(true);

    try {
      const token = await getTokenFromClient();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${apiUrl}/my-bookings/${booking._id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete booking");
      }

      const data = await res.json();
      console.log("Deleted:", data);
      router.refresh(); // Refresh server component data seamlessly
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-75 h-50 shrink-0 relative">
          <Image
            height={400}
            width={400}
            src={booking.imageUrl}
            alt={booking.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-medium text-slate-900">
              {booking.name}
            </h2>

            <div className="mt-3 space-y-1.5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Departure: {booking.departureDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span>Booking ID: {booking._id}</span>
              </div>
            </div>

            <div className="mt-4 text-2xl font-medium text-blue-500">
              ${booking.price}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={handleCancelBooking}
              disabled={loading}
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 gap-2"
            >
              <XCircle className="w-4 h-4" />
              {loading ? "Canceling..." : "Cancel"}
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MyBookingCard;