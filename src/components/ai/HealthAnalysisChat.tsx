import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Brain, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GeminiService } from '@/services/geminiService';

interface HealthData {
  id: string;
  date: Date;
  bloodPressure?: { systolic: number; diastolic: number };
  pulse?: number;
  mood?: string;
  weight?: number;
  temperature?: number;
  temperatureUnit?: string;
  smoked?: boolean;
  cigaretteCount?: number;
  painLevel?: number;
  painNotes?: string;
  movementLevel?: string;
  sport?: boolean;
}

interface FoodEntry {
  id: string;
  text: string;
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    foods: string[];
  };
  timestamp: Date;
}

interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  taken: boolean;
  timestamp: Date;
  notes?: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface HealthAnalysisChatProps {
  healthData: HealthData[];
  foodEntries: FoodEntry[];
  medications: MedicationEntry[];
  apiKey: string;
}

const HealthAnalysisChat = ({ healthData, foodEntries, medications, apiKey }: HealthAnalysisChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiKey) {
      setGeminiService(new GeminiService(apiKey));
    }
  }, [apiKey]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateDataSummary = () => {
    const recentData = healthData.slice(-30); // Last 30 entries
    const recentFood = foodEntries.slice(-20); // Last 20 entries
    const recentMeds = medications.slice(-20); // Last 20 entries

    return {
      healthSummary: `Recent health data (${recentData.length} entries): 
        - Blood Pressure readings: ${recentData.filter(d => d.bloodPressure).length} entries
        - Weight measurements: ${recentData.filter(d => d.weight).length} entries  
        - Mood tracking: ${recentData.filter(d => d.mood).length} entries
        - Pain levels: ${recentData.filter(d => d.painLevel).length} entries
        - Movement data: ${recentData.filter(d => d.movementLevel).length} entries
        - Smoking data: ${recentData.filter(d => d.smoked !== undefined).length} entries`,
      
      foodSummary: `Recent nutrition (${recentFood.length} entries): 
        Total calories tracked: ${recentFood.reduce((sum, f) => sum + f.nutrition.calories, 0)}
        Common foods: ${[...new Set(recentFood.flatMap(f => f.nutrition.foods))].slice(0, 10).join(', ')}`,
      
      medicationSummary: `Medications (${recentMeds.length} entries):
        Unique medications: ${[...new Set(recentMeds.map(m => m.name))].join(', ')}
        Adherence rate: ${Math.round((recentMeds.filter(m => m.taken).length / recentMeds.length) * 100)}%`
    };
  };

  const handleFullAnalysis = async () => {
    if (!geminiService) {
      toast({
        title: "Error",
        description: "Please set your Gemini API key first.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const summary = generateDataSummary();
    
    const analysisPrompt = `You are an experienced doctor reviewing a patient's health data. Please provide a comprehensive but accessible health analysis.

PATIENT DATA SUMMARY:
${summary.healthSummary}

${summary.foodSummary}

${summary.medicationSummary}

DETAILED RECENT DATA:
Health Metrics: ${JSON.stringify(healthData.slice(-10), null, 2)}
Food Entries: ${JSON.stringify(foodEntries.slice(-10), null, 2)}
Medications: ${JSON.stringify(medications.slice(-10), null, 2)}

Please provide:
1. Overall health assessment
2. Notable patterns or trends
3. Areas of concern (if any)
4. Lifestyle recommendations
5. Suggestions for tracking or medical follow-up

Keep your response clear, encouraging, and practical. Avoid alarming language but be honest about any concerning patterns.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: analysisPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;

      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: analysisText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      toast({
        title: "Analysis Complete",
        description: "Your health data has been analyzed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your health data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !geminiService) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const summary = generateDataSummary();
      const contextPrompt = `You are a helpful health assistant. The user has the following health data context:

${summary.healthSummary}
${summary.foodSummary}
${summary.medicationSummary}

User question: ${inputMessage}

Please provide a helpful, accurate response based on their health data. If the question requires medical advice, remind them to consult with their healthcare provider.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: contextPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!apiKey) {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Gemini API Key Required</h3>
          <p className="text-amber-700">Please set your Gemini API key in the Food tab to use AI health analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Brain className="h-5 w-5" />
            AI Health Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleFullAnalysis}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze My Health Data'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Bot className="h-5 w-5" />
            Health Assistant Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full border rounded-lg p-3 mb-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Start a conversation by asking about your health data or click "Analyze My Health Data" above.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your health data..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthAnalysisChat;