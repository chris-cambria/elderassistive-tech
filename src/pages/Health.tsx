
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
    { name: "Lisinopril", dosage: "10mg", schedule: "Daily", morning: true, evening: false, taken: false },
    { name: "Metformin", dosage: "500mg", schedule: "Twice daily", morning: true, evening: true, taken: false },
    { name: "Atorvastatin", dosage: "20mg", schedule: "Evening", morning: false, evening: true, taken: false },
    { name: "Vitamin D", dosage: "1000 IU", schedule: "Daily", morning: true, evening: false, taken: true }
  ]);

  const announcePageLoad = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Health dashboard loaded. You can view your vital signs, medications, and health trends.");
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
      const utterance = new SpeechSynthesisUtterance(`Showing ${value} information.`);
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
      title: med.taken ? "Medication Skipped" : "Medication Taken",
      description: `${med.name} ${med.dosage} marked as ${med.taken ? "not taken" : "taken"}`,
      variant: med.taken ? "default" : "default",
    });
  };

  return (
    <div className="animate-fade-in space-y-8 max-w-5xl mx-auto pb-12">
      <section className="text-center md:text-left">
        <h1 className="text-4xl-accessible font-bold tracking-tight">Health Dashboard</h1>
        <p className="text-2xl-accessible text-muted-foreground mt-2">
          Monitor your health metrics and medications
        </p>
      </section>

      <Tabs defaultValue="vitals" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 h-auto p-1">
          <TabsTrigger value="vitals" className="text-xl py-3">
            <HeartPulse className="mr-2 h-5 w-5" />
            Vital Signs
          </TabsTrigger>
          <TabsTrigger value="medications" className="text-xl py-3">
            <Utensils className="mr-2 h-5 w-5" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-xl py-3">
            <LineChart className="mr-2 h-5 w-5" />
            Trends
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <HeartPulse className="mr-2 text-primary" size={28} />
                  Heart Rate
                </CardTitle>
                <CardDescription className="text-xl">Current BPM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-4xl-accessible font-bold">{healthData.heartRate.current}</p>
                  <p className="text-xl text-muted-foreground">beats per minute</p>
                </div>
                <p className="text-xl mt-2">
                  {healthData.heartRate.current < 60 ? "Lower than normal" : 
                   healthData.heartRate.current > 100 ? "Higher than normal" : 
                   "Within normal range"}
                </p>
              </CardContent>
            </Card>

            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <Activity className="mr-2 text-primary" size={28} />
                  Blood Pressure
                </CardTitle>
                <CardDescription className="text-xl">Systolic/Diastolic</CardDescription>
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
                    ? "Higher than normal" 
                    : "Within normal range"}
                </p>
              </CardContent>
            </Card>

            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <Droplets className="mr-2 text-primary" size={28} />
                  Blood Sugar
                </CardTitle>
                <CardDescription className="text-xl">Fasting glucose</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-4xl-accessible font-bold">{healthData.bloodSugar.current}</p>
                  <p className="text-xl text-muted-foreground">mg/dL</p>
                </div>
                <p className="text-xl mt-2">
                  {healthData.bloodSugar.current > 125 ? "Higher than normal" : 
                   healthData.bloodSugar.current < 70 ? "Lower than normal" : 
                   "Within normal range"}
                </p>
              </CardContent>
            </Card>

            <Card className="accessible-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl-accessible flex items-center">
                  <Thermometer className="mr-2 text-primary" size={28} />
                  Temperature
                </CardTitle>
                <CardDescription className="text-xl">Body temperature</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-4xl-accessible font-bold">{healthData.temperature.current}</p>
                  <p className="text-xl text-muted-foreground">°F</p>
                </div>
                <p className="text-xl mt-2">
                  {healthData.temperature.current > 99.5 ? "Higher than normal" : 
                   healthData.temperature.current < 97.8 ? "Lower than normal" : 
                   "Within normal range"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="medications" className="mt-6">
          <Card className="accessible-card">
            <CardHeader>
              <CardTitle className="text-2xl-accessible">Today's Medications</CardTitle>
              <CardDescription className="text-xl">
                Track your medication schedule
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
                        {medication.morning && " Morning"}
                        {medication.morning && medication.evening && " &"}
                        {medication.evening && " Evening"}
                      </p>
                    </div>
                    <Button
                      variant={medication.taken ? "outline" : "default"}
                      size="lg"
                      className="text-lg"
                      onClick={() => toggleMedicationStatus(index)}
                    >
                      {medication.taken ? "Taken ✓" : "Mark as Taken"}
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
              <CardTitle className="text-2xl-accessible">7-Day Health Trends</CardTitle>
              <CardDescription className="text-xl">
                View your health metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-2">Heart Rate (BPM)</h3>
                  <div className="h-24 flex items-end space-x-2">
                    {healthData.heartRate.trend.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-primary rounded-t-sm" 
                          style={{ height: `${(day.value / 100) * 100}%` }}
                        ></div>
                        <span className="text-sm mt-1">Day {day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Blood Pressure (Systolic)</h3>
                  <div className="h-24 flex items-end space-x-2">
                    {healthData.bloodPressure.trend.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-primary rounded-t-sm" 
                          style={{ height: `${(day.value / 160) * 100}%` }}
                        ></div>
                        <span className="text-sm mt-1">Day {day.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2">Blood Sugar (mg/dL)</h3>
                  <div className="h-24 flex items-end space-x-2">
                    {healthData.bloodSugar.trend.map((day, i) => (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-primary rounded-t-sm" 
                          style={{ height: `${(day.value / 150) * 100}%` }}
                        ></div>
                        <span className="text-sm mt-1">Day {day.day}</span>
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
