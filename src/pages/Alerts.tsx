
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, Pills, Check, X, Plus, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Alerts = () => {
  const { toast } = useToast();
  // Sample reminder data
  const [reminders, setReminders] = useState([
    { 
      id: 1, 
      title: "Morning Medication", 
      time: "8:00 AM", 
      type: "medication", 
      details: "Take Lisinopril 10mg with water",
      active: true,
      completed: false
    },
    { 
      id: 2, 
      title: "Doctor Appointment", 
      time: "10:30 AM", 
      type: "appointment", 
      details: "Dr. Johnson - Blood pressure check",
      active: true,
      completed: false
    },
    { 
      id: 3, 
      title: "Afternoon Walk", 
      time: "2:00 PM", 
      type: "activity", 
      details: "30 minute walk in the neighborhood",
      active: true,
      completed: false
    },
    { 
      id: 4, 
      title: "Evening Medication", 
      time: "7:00 PM", 
      type: "medication", 
      details: "Take Metformin 500mg after dinner",
      active: true,
      completed: false
    },
    { 
      id: 5, 
      title: "Call Family", 
      time: "5:00 PM", 
      type: "social", 
      details: "Video call with daughter",
      active: true,
      completed: true
    }
  ]);
  
  const [voiceRemindersEnabled, setVoiceRemindersEnabled] = useState(true);

  const announcePageLoad = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Alerts and Reminders page. You have reminders for today. Voice reminders are enabled.");
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Small delay to ensure screen reader doesn't conflict
    const timer = setTimeout(() => {
      announcePageLoad();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleVoiceRemindersToggle = () => {
    setVoiceRemindersEnabled(!voiceRemindersEnabled);
    
    toast({
      title: voiceRemindersEnabled ? "Voice Reminders Disabled" : "Voice Reminders Enabled",
      description: voiceRemindersEnabled 
        ? "You will no longer receive voice announcements for reminders." 
        : "You will now receive voice announcements for reminders.",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        voiceRemindersEnabled 
          ? "Voice reminders have been turned off." 
          : "Voice reminders have been turned on."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleReminderActive = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, active: !reminder.active }
        : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast({
        title: reminder.active ? "Reminder Disabled" : "Reminder Enabled",
        description: `"${reminder.title}" has been ${reminder.active ? "disabled" : "enabled"}.`,
      });
    }
  };

  const toggleReminderCompleted = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      const newStatus = !reminder.completed;
      toast({
        title: newStatus ? "Reminder Completed" : "Reminder Reopened",
        description: `"${reminder.title}" has been marked as ${newStatus ? "completed" : "not completed"}.`,
        variant: "default",
      });
      
      if ('speechSynthesis' in window && voiceRemindersEnabled) {
        const utterance = new SpeechSynthesisUtterance(
          newStatus 
            ? `${reminder.title} marked as completed.` 
            : `${reminder.title} marked as not completed.`
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const addDemoReminder = () => {
    const newReminder = {
      id: Math.max(...reminders.map(r => r.id)) + 1,
      title: "Water Plants", 
      time: "4:30 PM", 
      type: "activity", 
      details: "Water the indoor plants",
      active: true,
      completed: false
    };
    
    setReminders([...reminders, newReminder]);
    
    toast({
      title: "New Reminder Added",
      description: `"${newReminder.title}" has been added to your reminders.`,
      variant: "default",
    });
    
    if ('speechSynthesis' in window && voiceRemindersEnabled) {
      const utterance = new SpeechSynthesisUtterance(
        `New reminder added: ${newReminder.title} at ${newReminder.time}.`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper function to get icon for reminder type
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "medication": return <Pills className="h-6 w-6 text-blue-500" />;
      case "appointment": return <Calendar className="h-6 w-6 text-violet-500" />;
      case "activity": return <Clock className="h-6 w-6 text-green-500" />;
      case "social": return <Volume2 className="h-6 w-6 text-amber-500" />;
      default: return <Bell className="h-6 w-6 text-primary" />;
    }
  };

  const getTypeBadge = (type: string) => {
    let className = "";
    switch(type) {
      case "medication": className = "bg-blue-100 text-blue-800"; break;
      case "appointment": className = "bg-violet-100 text-violet-800"; break;
      case "activity": className = "bg-green-100 text-green-800"; break;
      case "social": className = "bg-amber-100 text-amber-800"; break;
      default: className = "bg-primary/20 text-primary-foreground";
    }
    
    return (
      <Badge variant="outline" className={`text-lg px-3 py-1 ${className}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center md:text-left">
        <h1 className="text-4xl-accessible font-bold tracking-tight">Alerts & Reminders</h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          Manage your daily schedule and reminders
        </p>
      </section>

      <Card className="accessible-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <CardTitle className="text-2xl-accessible">Voice Reminders</CardTitle>
              <CardDescription className="text-xl mt-1">
                Enable or disable voice announcements
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Switch 
                id="voice-mode" 
                checked={voiceRemindersEnabled}
                onCheckedChange={handleVoiceRemindersToggle}
              />
              <label htmlFor="voice-mode" className="text-xl">
                {voiceRemindersEnabled ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl-accessible font-semibold">Today's Reminders</h2>
          <Button 
            onClick={addDemoReminder}
            className="text-lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Reminder
          </Button>
        </div>
        
        <div className="space-y-4">
          {reminders.map(reminder => (
            <Card 
              key={reminder.id} 
              className={`accessible-card transition-all ${
                !reminder.active ? 'opacity-60' : 
                reminder.completed ? 'border-green-300 bg-green-50' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getTypeIcon(reminder.type)}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-medium ${reminder.completed ? 'line-through' : ''}`}>
                        {reminder.title}
                      </h3>
                      <div className="flex flex-wrap items-center space-x-3 mt-1">
                        <span className="text-xl text-muted-foreground">{reminder.time}</span>
                        {getTypeBadge(reminder.type)}
                      </div>
                      <p className="text-xl mt-2">{reminder.details}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <Button
                      variant={reminder.completed ? "outline" : "default"}
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => toggleReminderCompleted(reminder.id)}
                      title={reminder.completed ? "Mark as not completed" : "Mark as completed"}
                    >
                      <Check className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12"
                      onClick={() => toggleReminderActive(reminder.id)}
                      title={reminder.active ? "Disable reminder" : "Enable reminder"}
                    >
                      {reminder.active ? <Bell className="h-6 w-6" /> : <X className="h-6 w-6" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Alerts;
