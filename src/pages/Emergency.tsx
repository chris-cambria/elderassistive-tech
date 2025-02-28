
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Phone, Heart, MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Emergency = () => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [emergencyContacts] = useState([
    { name: "Emergency Services", number: "911", primary: true },
    { name: "Dr. Johnson", number: "555-123-4567", primary: false },
    { name: "Mary (Daughter)", number: "555-987-6543", primary: false },
    { name: "John (Son)", number: "555-876-5432", primary: false },
  ]);
  
  // Simulating GPS location
  const [location] = useState({
    address: "123 Main Street, Anytown, USA",
    coordinates: "37.7749° N, 122.4194° W"
  });
  
  // Simulating medical info
  const [medicalInfo] = useState({
    conditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin", "Shellfish"],
    medications: ["Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg"],
    bloodType: "A+"
  });

  const announceEmergencyPage = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "Emergency page loaded. Press the red emergency button to call for help, or select a contact from below."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Announce the emergency page with a slight delay
    const timer = setTimeout(() => {
      announceEmergencyPage();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle the countdown timer for emergency call
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown <= 0) {
      // Simulate emergency call
      toast({
        title: "Emergency Services Contacted",
        description: "Your location and medical information have been shared.",
        variant: "default",
      });
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(
          "Emergency services have been contacted. Help is on the way. Your location and medical information have been shared."
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
      
      setCountdown(null);
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(`${countdown}`);
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, toast]);

  const initiateEmergencyCall = () => {
    if (countdown !== null) return; // Already in countdown
    
    setCountdown(5);
    
    toast({
      title: "Emergency Call Initiated",
      description: "Contacting emergency services in 5 seconds. Tap to cancel.",
      variant: "destructive",
    });
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(
        "Emergency call initiated. Contacting emergency services in 5 seconds. Press cancel to stop."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const cancelEmergencyCall = () => {
    if (countdown === null) return;
    
    setCountdown(null);
    
    toast({
      title: "Emergency Call Cancelled",
      description: "The emergency call has been cancelled.",
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(
        "Emergency call has been cancelled."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const callContact = (name: string, number: string) => {
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${number}...`,
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Calling ${name} at ${number.split('').join(' ')}`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center">
        <h1 className="text-4xl-accessible font-bold tracking-tight text-destructive">
          Emergency Assistance
        </h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          Get help quickly in case of emergency
        </p>
      </section>

      <section className="flex justify-center my-8">
        {countdown === null ? (
          <Button 
            className="accessible-button bg-destructive hover:bg-destructive/90 text-white h-24 w-80 text-2xl-accessible rounded-2xl"
            onClick={initiateEmergencyCall}
          >
            <AlertCircle className="mr-4" size={32} />
            Emergency Call
          </Button>
        ) : (
          <Card className="w-80 h-24 bg-destructive text-white flex items-center justify-center rounded-2xl shadow-lg animate-pulse">
            <CardContent className="flex items-center justify-between p-6 w-full">
              <div className="text-3xl-accessible font-bold">{countdown}</div>
              <div className="text-2xl-accessible">Calling...</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
                onClick={cancelEmergencyCall}
              >
                <X size={32} />
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="accessible-card">
          <CardContent className="p-6">
            <h2 className="text-2xl-accessible font-semibold mb-4 flex items-center">
              <Phone className="mr-2" size={24} />
              Emergency Contacts
            </h2>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <Button
                  key={index}
                  variant={contact.primary ? "default" : "outline"}
                  className="w-full justify-start text-xl p-4 h-auto"
                  onClick={() => callContact(contact.name, contact.number)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{contact.name}</span>
                    <span className={contact.primary ? "text-primary-foreground/80" : "text-muted-foreground"}>
                      {contact.number}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="accessible-card">
            <CardContent className="p-6">
              <h2 className="text-2xl-accessible font-semibold mb-4 flex items-center">
                <MapPin className="mr-2" size={24} />
                Your Location
              </h2>
              <div className="space-y-2">
                <p className="text-xl">{location.address}</p>
                <p className="text-lg text-muted-foreground">{location.coordinates}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="accessible-card">
            <CardContent className="p-6">
              <h2 className="text-2xl-accessible font-semibold mb-4 flex items-center">
                <Heart className="mr-2" size={24} />
                Medical Information
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-medium">Conditions</h3>
                  <p className="text-lg">{medicalInfo.conditions.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Allergies</h3>
                  <p className="text-lg">{medicalInfo.allergies.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Medications</h3>
                  <p className="text-lg">{medicalInfo.medications.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">Blood Type</h3>
                  <p className="text-lg">{medicalInfo.bloodType}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Emergency;
