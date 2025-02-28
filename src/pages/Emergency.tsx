
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Phone, Heart, MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Emergency = () => {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [emergencyContacts] = useState([
    { name: "அவசர சேவைகள்", number: "911", primary: true },
    { name: "டாக்டர் ஜான்சன்", number: "555-123-4567", primary: false },
    { name: "மேரி (மகள்)", number: "555-987-6543", primary: false },
    { name: "ஜான் (மகன்)", number: "555-876-5432", primary: false },
  ]);
  
  // Simulating GPS location
  const [location] = useState({
    address: "123 மெயின் ஸ்ட்ரீட், ஏனிடவுன், அமெரிக்கா",
    coordinates: "37.7749° N, 122.4194° W"
  });
  
  // Simulating medical info
  const [medicalInfo] = useState({
    conditions: ["உயர் இரத்த அழுத்தம்", "வகை 2 நீரிழிவு"],
    allergies: ["பென்சிலின்", "கடல் உணவு"],
    medications: ["லிசினோப்ரில் 10mg", "மெட்ஃபார்மின் 500mg", "அடோர்வாஸ்டாடின் 20mg"],
    bloodType: "A+"
  });

  const announceEmergencyPage = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "அவசர பக்கம் ஏற்றப்பட்டது. உதவி அழைக்க சிவப்பு அவசர பொத்தானை அழுத்தவும், அல்லது கீழே உள்ள தொடர்புகளிலிருந்து ஒன்றைத் தேர்ந்தெடுக்கவும்."
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
        title: "அவசர சேவைகள் தொடர்பு கொள்ளப்பட்டன",
        description: "உங்கள் இருப்பிடம் மற்றும் மருத்துவ தகவல்கள் பகிரப்பட்டுள்ளன.",
        variant: "default",
      });
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(
          "அவசர சேவைகள் தொடர்பு கொள்ளப்பட்டன. உதவி வழியில் உள்ளது. உங்கள் இருப்பிடம் மற்றும் மருத்துவ தகவல்கள் பகிரப்பட்டுள்ளன."
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
      title: "அவசர அழைப்பு தொடங்கப்பட்டது",
      description: "5 வினாடிகளில் அவசர சேவைகளைத் தொடர்பு கொள்கிறது. ரத்து செய்ய தட்டவும்.",
      variant: "destructive",
    });
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(
        "அவசர அழைப்பு தொடங்கப்பட்டது. 5 வினாடிகளில் அவசர சேவைகளைத் தொடர்பு கொள்கிறது. நிறுத்த ரத்து செய்யவும் பொத்தானை அழுத்தவும்."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const cancelEmergencyCall = () => {
    if (countdown === null) return;
    
    setCountdown(null);
    
    toast({
      title: "அவசர அழைப்பு ரத்து செய்யப்பட்டது",
      description: "அவசர அழைப்பு ரத்து செய்யப்பட்டது.",
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(
        "அவசர அழைப்பு ரத்து செய்யப்பட்டது."
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const callContact = (name: string, number: string) => {
    toast({
      title: `${name} அழைக்கிறது`,
      description: `${number} டயல் செய்கிறது...`,
      variant: "default",
    });
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${name} அழைக்கிறது, ${number.split('').join(' ')}`
      );
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center">
        <h1 className="text-4xl-accessible font-bold tracking-tight text-destructive">
          அவசர உதவி
        </h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          அவசர நிலையில் விரைவாக உதவி பெறுங்கள்
        </p>
      </section>

      <section className="flex justify-center my-8">
        {countdown === null ? (
          <Button 
            className="accessible-button bg-destructive hover:bg-destructive/90 text-white h-24 w-80 text-2xl-accessible rounded-2xl"
            onClick={initiateEmergencyCall}
          >
            <AlertCircle className="mr-4" size={32} />
            அவசர அழைப்பு
          </Button>
        ) : (
          <Card className="w-80 h-24 bg-destructive text-white flex items-center justify-center rounded-2xl shadow-lg animate-pulse">
            <CardContent className="flex items-center justify-between p-6 w-full">
              <div className="text-3xl-accessible font-bold">{countdown}</div>
              <div className="text-2xl-accessible">அழைக்கிறது...</div>
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
              அவசர தொடர்புகள்
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
                உங்கள் இருப்பிடம்
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
                மருத்துவ தகவல்
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-medium">நோய்கள்</h3>
                  <p className="text-lg">{medicalInfo.conditions.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">ஒவ்வாமைகள்</h3>
                  <p className="text-lg">{medicalInfo.allergies.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">மருந்துகள்</h3>
                  <p className="text-lg">{medicalInfo.medications.join(", ")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-medium">இரத்த வகை</h3>
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
