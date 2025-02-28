
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartPulse, Thermometer, Droplets, Activity, Utensils, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// For demonstration, we're simulating health data trends
const generateHealthData = (days: number, baseline: number, variance: number) => {
  return Array.from({ length: days }).map((_, i) => ({
    day: i + 1,
    value: Math.round((baseline + (Math.random() * variance * 2 - variance)) * 10) / 10
  }));
};

const Health = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("vitals");
  
  // Simulated health data
  const [healthData, setHealthData] = useState({
    heartRate: { current: 72, trend: generateHealthData(7, 72, 5) },
    bloodPressure: { systolic: 120, diastolic: 80, trend: generateHealthData(7, 120, 8) },
    bloodSugar: { current: 98, trend: generateHealthData(7, 98, 10) },
    temperature: { current: 98.6, trend: generateHealthData(7, 98.6, 0.5) },
    weight: { current: 165, trend: generateHealthData(7, 165, 2) },
    oxygenLevel: { current: 97, trend: generateHealthData(7, 97, 1) }
  });

  // Simulated medication data
  const [medications, setMedications] = useState([
    { name: "லிசினோப்ரில்", dosage: "10mg", schedule: "தினமும்", morning: true, evening: false, taken: false },
    { name: "மெட்ஃபார்மின்", dosage: "500mg", schedule: "தினமும் இருமுறை", morning: true, evening: true, taken: false },
    { name: "அடோர்வாஸ்டாடின்", dosage: "20mg", schedule: "மாலை", morning: false, evening: true, taken: false },
    { name: "வைட்டமின் டி", dosage: "1000 IU", schedule: "தினமும்", morning: true, evening: false, taken: true }
  ]);

  const announcePageLoad = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("ஆரோக்கிய டாஷ்போர்ட் ஏற்றப்பட்டது. உங்கள் உடல்நிலை, மருந்துகள் மற்றும் ஆரோக்கிய போக்குகளைப் பார்க்கலாம்.");
      utterance.rate = 0.9; // Slightly slower for better comprehension
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if ('speechSynthesis' in window) {
      let tabName = "வைட்டல்ஸ்";
      if (value === "medications") tabName = "மருந்துகள்";
      if (value === "trends") tabName = "போக்குகள்";
      
      const utterance = new SpeechSynthesisUtterance(`${tabName} தகவலைக் காட்டுகிறது.`);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMedicationStatus = (index: number) => {
    const updatedMedications = [...medications];
    updatedMedications[index].taken = !updatedMedications[index].taken;
    setMedications(updatedMedications);
    
    const med = medications[index];
    toast({
      title: med.taken ? "மருந்து தவிர்க்கப்பட்டது" : "மருந்து எடுக்கப்பட்டது",
      description: `${med.name} ${med.dosage} ${med.taken ? "எடுக்கப்படவில்லை" : "எடுக்கப்பட்டது"} என குறிக்கப்பட்டுள்ளது`,
      variant: med.taken ? "default" : "default",
    });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center md:text-left">
        <h1 className="text-4xl-accessible font-bold tracking-tight">ஆரோக்கிய டாஷ்போர்ட்</h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          உங்கள் ஆரோக்கிய அளவீடுகளையும் மருந்துகளையும் கண்காணிக்கவும்
        </p>
      </section>

      <Tabs defaultValue="vitals" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="vitals" className="text-xl py-3">
            <HeartPulse className="mr-2 h-5 w-5" />
            உடல்நிலை அளவீடுகள்
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-xl py-3">
            <Utensils className="mr-2 h-5 w-5" />
            மருந்துகள்
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xl py-3">
            <LineChart className="mr-2 h-5 w-5" />
            போக்குகள்
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <HeartPulse className="mr-2 text-primary" size={28} />
                  இதய துடிப்பு
                </CardTitle>
                <CardDescription className="text-xl">தற்போதைய BPM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-4xl-accessible font-bold">{healthData.heartRate.current}</p>
                  <p className="text-xl text-muted-foreground">துடிப்புகள் / நிமிடம்</p>
                </div>
                <p className="text-xl mt-2">
                  {healthData.heartRate.current < 60 ? "சாதாரணத்தை விட குறைவு" : 
                   healthData.heartRate.current > 100 ? "சாதாரணத்தை விட அதிகம்" : 
                   "சாதாரண வரம்பிற்குள்"}
                </p>
              </CardContent>
            </Card>

            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <Activity className="mr-2 text-primary" size={28} />
                  இரத்த அழுத்தம்
                </CardTitle>
                <CardDescription className="text-xl">சிஸ்டோலிக்/டயஸ்டோலிக்</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-4xl-accessible font-bold">
                    {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
                  </p>
                  <p className="text-xl text-muted-foreground">mmHg</p>
                </div>
                <p className="text-xl mt-2">
                  {healthData.bloodPressure.systolic > 130 || healthData.bloodPressure.diastolic > 80 
                    ? "சாதாரணத்தை விட அதிகம்" 
                    : "சாதாரண வரம்பிற்குள்"}
                </p>
              </CardContent>
            </Card>

            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <Droplets className="mr-2 text-primary" size={28} />
                  இரத்த சர்க்கரை
                </CardTitle>
                <CardDescription className="text-xl">உணவுக்கு முந்தைய குளுக்கோஸ்</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-4xl-accessible font-bold">{healthData.bloodSugar.current}</p>
                  <p className="text-xl text-muted-foreground">mg/dL</p>
                </div>
                <p className="text-xl mt-2">
                  {healthData.bloodSugar.current > 125 ? "சாதாரணத்தை விட அதிகம்" : 
                   healthData.bloodSugar.current < 70 ? "சாதாரணத்தை விட குறைவு" : 
                   "சாதாரண வரம்பிற்குள்"}
                </p>
              </CardContent>
            </Card>

            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <Thermometer className="mr-2 text-primary" size={28} />
                  உடல் வெப்பநிலை
                </CardTitle>
                <CardDescription className="text-xl">உடல் வெப்பநிலை</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-4xl-accessible font-bold">{healthData.temperature.current}</p>
                  <p className="text-xl text-muted-foreground">°F</p>
                </div>
                <p className="text-xl mt-2">
                  {healthData.temperature.current > 99.5 ? "சாதாரணத்தை விட அதிகம்" : 
                   healthData.temperature.current < 97.8 ? "சாதாரணத்தை விட குறைவு" : 
                   "சாதாரண வரம்பிற்குள்"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="medications" className="mt-6">
          <Card className="accessible-card">
            <CardHeader>
              <CardTitle className="text-2xl-accessible">இன்றைய மருந்துகள்</CardTitle>
              <CardDescription className="text-xl">
                உங்கள் மருந்து அட்டவணையைக் கண்காணிக்கவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div 
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-secondary rounded-xl"
                  >
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-xl font-medium">{medication.name} ({medication.dosage})</h3>
                      <p className="text-lg text-muted-foreground">
                        {medication.schedule} - 
                        {medication.morning && " காலை"}
                        {medication.morning && medication.evening && " &"}
                        {medication.evening && " மாலை"}
                      </p>
                    </div>
                    <Button
                      variant={medication.taken ? "outline" : "default"}
                      size="lg"
                      className="text-lg"
                      onClick={() => toggleMedicationStatus(index)}
                    >
                      {medication.taken ? "எடுக்கப்பட்டது ✓" : "எடுத்ததாக குறிக்கவும்"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-6">
          <Card className="accessible-card">
            <CardHeader>
              <CardTitle className="text-2xl-accessible">7-நாள் ஆரோக்கிய போக்குகள்</CardTitle>
              <CardDescription className="text-xl">
                உங்கள் ஆரோக்கிய அளவீடுகளை காலப்போக்கில் பார்க்கவும்
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-2">இதய துடிப்பு (BPM)</h3>
                  <div className="h-24 flex items-end space-x-2">
                    {healthData.heartRate.trend.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-primary rounded-t-sm" 
                          style={{ height: `${(day.value / 100) * 100}%` }}
                        ></div>
                        <span className="text-sm mt-1">நாள் {day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">இரத்த அழுத்தம் (சிஸ்டோலிக்)</h3>
                  <div className="h-24 flex items-end space-x-2">
                    {healthData.bloodPressure.trend.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-primary rounded-t-sm" 
                          style={{ height: `${(day.value / 160) * 100}%` }}
                        ></div>
                        <span className="text-sm mt-1">நாள் {day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">இரத்த சர்க்கரை (mg/dL)</h3>
                  <div className="h-24 flex items-end space-x-2">
                    {healthData.bloodSugar.trend.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-primary rounded-t-sm" 
                          style={{ height: `${(day.value / 150) * 100}%` }}
                        ></div>
                        <span className="text-sm mt-1">நாள் {day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Health;
