import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function Mentorship() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      console.log("Fetching mentors...");
      const { data: mentorData, error } = await supabase
        .from("mentor_profiles")
        .select(`
          *,
          profiles!mentor_profiles_user_id_fkey (
            name,
            profile_image_url
          )
        `);

      if (error) {
        console.error("Error fetching mentors:", error);
        throw error;
      }

      console.log("Fetched mentors:", mentorData);
      setMentors(mentorData || []);
    } catch (error) {
      console.error("Error in fetchMentors:", error);
      toast({
        title: "Error",
        description: "Failed to load mentors",
        variant: "destructive",
      });
    }
  };

  const handleBookSession = async () => {
    if (!user || !selectedMentor || !selectedDate || !selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select all required booking details",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("mentor_bookings").insert({
        mentor_id: selectedMentor.id,
        student_id: user.id,
        booking_date: selectedDate.toISOString().split("T")[0],
        start_time: selectedTimeSlot,
        end_time: new Date(new Date(`2000-01-01T${selectedTimeSlot}`).getTime() + 60 * 60 * 1000)
          .toTimeString()
          .split(" ")[0],
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session booked successfully",
      });

      // Reset selection
      setSelectedMentor(null);
      setSelectedTimeSlot("");
    } catch (error) {
      console.error("Error booking session:", error);
      toast({
        title: "Error",
        description: "Failed to book session",
        variant: "destructive",
      });
    }
  };

  const timeSlots = [
    "09:00:00",
    "10:00:00",
    "11:00:00",
    "14:00:00",
    "15:00:00",
    "16:00:00",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <Card key={mentor.id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <img
                src={mentor.profiles?.profile_image_url || "/placeholder.svg"}
                alt={mentor.profiles?.name || "Mentor"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <CardTitle className="text-lg">{mentor.profiles?.name || "Anonymous Mentor"}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  ${mentor.hourly_rate}/hour
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{mentor.bio}</p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedMentor(mentor)}
                  >
                    Book Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book a Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <h4 className="font-medium mb-2">Select Date</h4>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) =>
                          date < new Date() || date > new Date(Date.now() + 12096e5)
                        }
                      />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Select Time Slot</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTimeSlot === slot ? "default" : "outline"}
                            onClick={() => setSelectedTimeSlot(slot)}
                          >
                            {new Date(`2000-01-01T${slot}`).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleBookSession}
                      disabled={!selectedDate || !selectedTimeSlot}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Mentorship;