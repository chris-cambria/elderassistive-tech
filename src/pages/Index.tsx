
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Bell, Settings, UserRound, Activity, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("Good day");
  const [userName, setUserName] = useState("User");
  const [todayActivities, setTodayActivities] = useState([
    { time: "9:00 AM", activity: "Take morning medication" },
    { time: "10:30 AM", activity: "Video call with family" },
    { time: "12:00 PM", activity: "Lunch time" },
    { time: "3:00 PM", activity: "Afternoon walk" },
    { time: "6:00 PM", activity: "Evening medication" }
  ]);
  
  // Set appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    
    // In a real app, this would come from user authentication
    setUserName("Thomas");
  }, []);

  const announceWelcome = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${greeting}, ${userName}. Welcome to your ElderAssist dashboard.`);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      window.speechSynthesis.speak(utterance);
    }
  };

  // Announce welcome message on page load
  useEffect(() => {
    // Small delay to ensure screen reader doesn't conflict
    const timer = setTimeout(() => {
      announceWelcome();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [greeting, userName]);

  const navigateWithAnnouncement = (path: string, title: string) => {
    toast({
      title: `Opening ${title}`,
      description: `Navigating to the ${title} page for you.`,
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Opening ${title} page.`);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    
    navigate(path);
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center md:text-left">
        <h1 className="text-4xl-accessible font-bold tracking-tight">{greeting}, {userName}</h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          Welcome to your personal dashboard
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="accessible-card" onClick={() => navigateWithAnnouncement("/health", "Health Dashboard")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl-accessible flex items-center">
              <HeartPulse className="mr-2 text-primary" size={28} />
              Health
            </CardTitle>
            <CardDescription className="text-xl">Monitor your vital signs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-xl">Heart Rate</p>
                <p className="text-3xl-accessible font-semibold">72 BPM</p>
              </div>
              <Activity size={48} className="text-primary/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="accessible-card" onClick={() => navigateWithAnnouncement("/alerts", "Alerts & Reminders")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl-accessible flex items-center">
              <Bell className="mr-2 text-primary" size={28} />
              Reminders
            </CardTitle>
            <CardDescription className="text-xl">Today's schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayActivities.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-xl font-medium">{item.time}</span>
                  <span className="text-xl text-right">{item.activity}</span>
                </div>
              ))}
              <p className="text-lg text-muted-foreground italic">+3 more activities</p>
            </div>
          </CardContent>
        </Card>

        <Card className="accessible-card" onClick={() => navigateWithAnnouncement("/settings", "Settings")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl-accessible flex items-center">
              <UserRound className="mr-2 text-primary" size={28} />
              Profile
            </CardTitle>
            <CardDescription className="text-xl">Your information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <span className="text-xl font-medium">Next Appointment</span>
                <span className="text-xl">May 15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xl font-medium">Doctor</span>
                <span className="text-xl">Dr. Johnson</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="accessible-card">
          <CardHeader>
            <CardTitle className="text-2xl-accessible flex items-center">
              <Calendar className="mr-2 text-primary" size={28} />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayActivities.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 bg-secondary rounded-xl"
                >
                  <span className="text-xl font-semibold">{item.time}</span>
                  <span className="text-xl">{item.activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex justify-center mt-12">
        <Button 
          size="lg" 
          className="accessible-button bg-destructive hover:bg-destructive/90 text-white" 
          onClick={() => navigateWithAnnouncement("/emergency", "Emergency Assistance")}
        >
          <Bell className="mr-2" size={24} />
          Emergency Assistance
        </Button>
      </section>
    </div>
  );
};

export default Index;
