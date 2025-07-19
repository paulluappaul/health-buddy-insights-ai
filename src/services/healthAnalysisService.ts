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

interface AnalysisData {
  healthData: HealthData[];
  foodEntries: FoodEntry[];
  medications: MedicationEntry[];
}

interface DayData {
  healthData: HealthData[];
  foodEntries: FoodEntry[];
  medications: MedicationEntry[];
}

interface DataSummary {
  dataByDay: Record<string, DayData>;
  analysisType: 'daily' | 'weekly' | 'monthly';
  totalDays: number;
  totalEntries: number;
}

export class HealthAnalysisService {
  private apiKey: string;
  private maxRetries: number = 3;
  private baseDelay: number = 1000;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeApiCall(payload: any, retryCount: number = 0): Promise<any> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error details:', errorData);
        
        if (response.status === 429 || (errorData.error?.message && errorData.error.message.includes('overloaded'))) {
          if (retryCount < this.maxRetries) {
            const delayTime = this.baseDelay * Math.pow(2, retryCount);
            console.log(`Gemini API overloaded, retrying in ${delayTime}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
            await this.delay(delayTime);
            return this.makeApiCall(payload, retryCount + 1);
          } else {
            throw new Error('Gemini API is currently overloaded. Please try again in a few minutes.');
          }
        }
        
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < this.maxRetries && (error as Error).message.includes('fetch')) {
        const delayTime = this.baseDelay * Math.pow(2, retryCount);
        console.log(`Network error, retrying in ${delayTime}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
        await this.delay(delayTime);
        return this.makeApiCall(payload, retryCount + 1);
      }
      throw error;
    }
  }

  public generateDataSummary(data: AnalysisData, analysisType: 'daily' | 'weekly' | 'monthly' = 'daily'): DataSummary {
    let timeRange = 7; // Default to last 7 days for daily
    if (analysisType === 'weekly') timeRange = 30; // Last 30 days for weekly analysis
    if (analysisType === 'monthly') timeRange = 90; // Last 90 days for monthly analysis

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange);

    console.log(`Generating ${analysisType} data summary for last ${timeRange} days`);

    // Filter and group data by day
    const dataByDay: Record<string, DayData> = {};

    // Process health data
    const filteredHealthData = data.healthData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });

    filteredHealthData.forEach(entry => {
      const dayKey = new Date(entry.date).toISOString().split('T')[0];
      if (!dataByDay[dayKey]) {
        dataByDay[dayKey] = { healthData: [], foodEntries: [], medications: [] };
      }
      dataByDay[dayKey].healthData.push(entry);
    });

    // Process food data
    const filteredFoodEntries = data.foodEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= cutoffDate;
    });

    filteredFoodEntries.forEach(entry => {
      const dayKey = new Date(entry.timestamp).toISOString().split('T')[0];
      if (!dataByDay[dayKey]) {
        dataByDay[dayKey] = { healthData: [], foodEntries: [], medications: [] };
      }
      dataByDay[dayKey].foodEntries.push(entry);
    });

    // Process medication data
    const filteredMedications = data.medications.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= cutoffDate;
    });

    filteredMedications.forEach(entry => {
      const dayKey = new Date(entry.timestamp).toISOString().split('T')[0];
      if (!dataByDay[dayKey]) {
        dataByDay[dayKey] = { healthData: [], foodEntries: [], medications: [] };
      }
      dataByDay[dayKey].medications.push(entry);
    });

    console.log(`Data summary generated: ${Object.keys(dataByDay).length} days with data`);
    
    return {
      dataByDay,
      analysisType,
      totalDays: Object.keys(dataByDay).length,
      totalEntries: filteredHealthData.length + filteredFoodEntries.length + filteredMedications.length
    };
  }

  private formatHealthMetrics(healthData: HealthData[]): any[] {
    return healthData.map(h => {
      const metrics: any = {};
      
      // Fix blood pressure filtering - only include if both values are meaningful
      if (h.bloodPressure && h.bloodPressure.systolic > 0 && h.bloodPressure.diastolic > 0) {
        metrics.bloodPressure = `${h.bloodPressure.systolic}/${h.bloodPressure.diastolic} mmHg`;
      }
      
      if (h.pulse && h.pulse > 0) metrics.pulse = `${h.pulse} bpm`;
      if (h.weight && h.weight > 0) metrics.weight = `${h.weight} kg`;
      if (h.mood && h.mood.trim() !== '') metrics.mood = h.mood;
      if (h.temperature && h.temperature > 0) {
        metrics.temperature = `${h.temperature}°${h.temperatureUnit === 'fahrenheit' ? 'F' : 'C'}`;
      }
      if (h.smoked !== undefined) {
        metrics.smoking = h.smoked ? `${h.cigaretteCount || 0} cigarettes` : 'no smoking';
      }
      if (h.painLevel && h.painLevel > 0) {
        metrics.painLevel = `${h.painLevel}/10${h.painNotes ? ` (${h.painNotes})` : ''}`;
      }
      if (h.movementLevel && h.movementLevel.trim() !== '') metrics.movement = h.movementLevel;
      if (h.sport) metrics.exercise = 'engaged in sports/exercise';
      
      return metrics;
    });
  }

  private createComprehensivePrompt(summary: DataSummary): string {
    const timeFrameDescription = summary.analysisType === 'daily' 
      ? 'Last 7 days' 
      : summary.analysisType === 'weekly' 
        ? 'Last 30 days (4 weeks)' 
        : 'Last 90 days (3 months)';

    return `You are an experienced medical doctor conducting a comprehensive health analysis. Your patient has been diligently tracking their health data, and you need to provide a thorough, professional medical assessment.

ANALYSIS SCOPE: ${summary.analysisType.toUpperCase()} HEALTH ASSESSMENT
TIME PERIOD: ${timeFrameDescription}
DATA COVERAGE: ${summary.totalEntries} total health entries across ${summary.totalDays} active tracking days

DETAILED PATIENT DATA (Daily Breakdown):
${Object.entries(summary.dataByDay).map(([date, dayData]) => {
  const healthMetrics = this.formatHealthMetrics(dayData.healthData);
  const dailyCalories = dayData.foodEntries.reduce((sum, f) => sum + (f.nutrition?.calories || 0), 0);
  const foodItems = dayData.foodEntries.map(f => f.nutrition?.foods || []).flat();
  const dailyMeds = dayData.medications.map(m => ({ 
    name: m.name, 
    taken: m.taken, 
    dosage: m.dosage,
    adherence: m.taken ? 'compliant' : 'missed'
  }));
  
  return `
DATE: ${date}
• Vital Signs & Health Metrics: ${JSON.stringify(healthMetrics)}
• Nutritional Intake: ${dailyCalories} calories total${foodItems.length > 0 ? `, Foods consumed: ${foodItems.join(', ')}` : ', No food data recorded'}
• Medication Compliance: ${dailyMeds.length > 0 ? JSON.stringify(dailyMeds) : 'No medications recorded'}
• Pain/Symptom Assessment: ${dayData.healthData.some(h => h.painLevel && h.painLevel > 0) ? dayData.healthData.filter(h => h.painLevel && h.painLevel > 0).map(h => `Pain level ${h.painLevel}/10`).join(', ') : 'No pain reported'}
`;
}).join('\n')}

MEDICAL ASSESSMENT REQUIREMENTS:
As a practicing physician, please provide a comprehensive health analysis including:

1. **CLINICAL OVERVIEW** (${summary.analysisType} assessment):
   - Overall health pattern assessment across the ${timeFrameDescription}
   - Identification of any concerning trends or positive developments
   - Risk factor analysis based on the available data

2. **VITAL SIGNS ANALYSIS**:
   - Blood pressure patterns and cardiovascular risk assessment
   - Heart rate variability and rhythms
   - Weight trends and metabolic implications
   - Temperature patterns (if recorded)

3. **LIFESTYLE ASSESSMENT**:
   - Nutritional adequacy and dietary patterns
   - Physical activity levels and movement quality
   - Sleep patterns (if discernible from mood/energy data)
   - Substance use patterns (smoking, etc.)

4. **SYMPTOM CORRELATION ANALYSIS**:
   - Identify relationships between different health metrics
   - Connect lifestyle factors (diet, exercise, stress) with physiological markers
   - Assess mood patterns in relation to physical health indicators

5. **MEDICATION ADHERENCE EVALUATION**:
   - Review compliance patterns
   - Assess potential medication effectiveness based on health trends
   - Identify any concerning medication-related patterns

6. **CLINICAL RECOMMENDATIONS**:
   - Specific, actionable medical advice for ${summary.analysisType} health optimization
   - Preventive care recommendations
   - When to seek immediate medical attention
   - Lifestyle modifications with clinical rationale

7. **MONITORING PRIORITIES**:
   - Key metrics to focus on for the next ${summary.analysisType} period
   - Red flags to watch for
   - Frequency of monitoring recommendations

IMPORTANT MEDICAL GUIDELINES:
- Provide evidence-based assessments while acknowledging limitations of self-reported data
- Include appropriate disclaimers about the need for professional medical consultation
- Focus on patterns and trends rather than isolated data points
- Maintain professional medical terminology while ensuring patient comprehension
- Emphasize both positive findings and areas requiring attention
- Consider the holistic picture of the patient's health journey

Remember: You are conducting a comprehensive medical review, not just data analysis. Think like a physician reviewing a patient's chart before a consultation.`;
  }

  public async analyzeHealth(data: AnalysisData, analysisType: 'daily' | 'weekly' | 'monthly'): Promise<string> {
    const summary = this.generateDataSummary(data, analysisType);
    
    if (summary.totalEntries === 0) {
      throw new Error(`No health data found for ${analysisType} analysis. Please add some health entries first.`);
    }

    const analysisPrompt = this.createComprehensivePrompt(summary);

    const payload = {
      contents: [{
        parts: [{
          text: analysisPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent medical analysis
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 3000, // Increased for comprehensive analysis
      }
    };

    const data_response = await this.makeApiCall(payload);
    return data_response.candidates[0].content.parts[0].text;
  }

  public async chatWithHealthContext(data: AnalysisData, userMessage: string): Promise<string> {
    const summary = this.generateDataSummary(data, 'daily');
    
    const contextPrompt = `You are a knowledgeable health assistant with access to the patient's recent health data. Provide helpful, accurate responses while always recommending professional medical consultation for serious concerns.

PATIENT'S RECENT HEALTH DATA (Last 7 days):
${Object.entries(summary.dataByDay).slice(-7).map(([date, dayData]) => {
  const healthSummary = dayData.healthData.map(h => {
    const items = [];
    // Fixed blood pressure filtering
    if (h.bloodPressure && h.bloodPressure.systolic > 0 && h.bloodPressure.diastolic > 0) {
      items.push(`BP: ${h.bloodPressure.systolic}/${h.bloodPressure.diastolic}`);
    }
    if (h.pulse && h.pulse > 0) items.push(`Pulse: ${h.pulse}`);
    if (h.weight && h.weight > 0) items.push(`Weight: ${h.weight}kg`);
    if (h.mood && h.mood.trim() !== '') items.push(`Mood: ${h.mood}`);
    return items.join(', ');
  }).join('; ');
  
  const foodSummary = `${dayData.foodEntries.length} food entries (${dayData.foodEntries.reduce((sum, f) => sum + (f.nutrition?.calories || 0), 0)} cal)`;
  const medSummary = `${dayData.medications.length} medication entries`;
  
  return `${date}: ${healthSummary || 'No health metrics'}, ${foodSummary}, ${medSummary}`;
}).join('\n')}

Patient Question: ${userMessage}

Please provide a helpful, accurate response based on their health data. If the question requires medical diagnosis or treatment decisions, remind them to consult with their healthcare provider.`;

    const payload = {
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
    };

    const response = await this.makeApiCall(payload);
    return response.candidates[0].content.parts[0].text;
  }
}