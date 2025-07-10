
interface NutritionAnalysis {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  foods: string[];
  breakdown: {
    ingredient: string;
    amount: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  }[];
}

export class GeminiService {
  private apiKey: string;
  private maxRetries: number = 3;
  private baseDelay: number = 1000; // 1 second

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
        
        // Handle specific error cases
        if (response.status === 429 || (errorData.error?.message && errorData.error.message.includes('overloaded'))) {
          if (retryCount < this.maxRetries) {
            const delayTime = this.baseDelay * Math.pow(2, retryCount); // Exponential backoff
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

  async analyzeFood(description: string): Promise<NutritionAnalysis> {
    const prompt = `You are a professional nutritionist. Analyze this food description and provide accurate nutritional information: "${description}"

IMPORTANT: Be as accurate as possible with standard USDA nutritional values. If amounts aren't specified, estimate reasonable serving sizes based on typical portions.

Respond with ONLY valid JSON in this exact format:
{
  "totalCalories": number,
  "totalCarbs": number,
  "totalProtein": number,
  "totalFat": number,
  "foods": ["array of detected food items"],
  "breakdown": [
    {
      "ingredient": "food name",
      "amount": "estimated amount (e.g., 100g, 1 medium apple, 1 cup)",
      "calories": number,
      "carbs": number,
      "protein": number,
      "fat": number
    }
  ]
}

Example for "apple and banana":
{
  "totalCalories": 185,
  "totalCarbs": 48.5,
  "totalProtein": 1.4,
  "totalFat": 0.6,
  "foods": ["apple", "banana"],
  "breakdown": [
    {
      "ingredient": "apple",
      "amount": "1 medium (180g)",
      "calories": 95,
      "carbs": 25.1,
      "protein": 0.5,
      "fat": 0.3
    },
    {
      "ingredient": "banana",
      "amount": "1 medium (118g)",
      "calories": 90,
      "carbs": 23.4,
      "protein": 0.9,
      "fat": 0.3
    }
  ]
}

Now analyze: "${description}"`;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    };

    try {
      const data = await this.makeApiCall(payload);
      console.log('Gemini raw response:', data);
      
      const text = data.candidates[0].content.parts[0].text;
      console.log('Gemini response text:', text);
      
      // Extract JSON from the response - try multiple patterns
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        // Try to find JSON within code blocks
        jsonMatch = text.match(/```json\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          jsonMatch[0] = jsonMatch[1];
        }
      }
      
      if (!jsonMatch) {
        console.error('No valid JSON found in response:', text);
        throw new Error('No valid JSON found in Gemini response');
      }

      console.log('Extracted JSON:', jsonMatch[0]);
      const nutritionData = JSON.parse(jsonMatch[0]);
      
      console.log('Parsed nutrition data:', nutritionData);
      
      return {
        calories: nutritionData.totalCalories || 0,
        carbs: nutritionData.totalCarbs || 0,
        protein: nutritionData.totalProtein || 0,
        fat: nutritionData.totalFat || 0,
        foods: nutritionData.foods || [],
        breakdown: nutritionData.breakdown || []
      };
    } catch (error) {
      console.error('Error analyzing food with Gemini:', error);
      throw error;
    }
  }

  async analyzeImage(imageFile: File): Promise<NutritionAnalysis> {
    // Convert image to base64
    const base64Image = await this.fileToBase64(imageFile);
    
    const prompt = `You are a professional nutritionist. Analyze this food image and identify all visible foods with their estimated quantities. 

IMPORTANT: 
- Carefully estimate portion sizes based on visual cues (plate size, utensil size, etc.)
- Use standard USDA nutritional values
- Be conservative with estimates if unsure

Respond with ONLY valid JSON in this exact format:
{
  "totalCalories": number,
  "totalCarbs": number,
  "totalProtein": number,
  "totalFat": number,
  "foods": ["array of detected food items"],
  "breakdown": [
    {
      "ingredient": "food name",
      "amount": "estimated amount based on visual assessment",
      "calories": number,
      "carbs": number,
      "protein": number,
      "fat": number
    }
  ]
}

Analyze the image now:`;

    const payload = {
      contents: [{
        parts: [
          {
            text: prompt
          },
          {
            inline_data: {
              mime_type: imageFile.type,
              data: base64Image.split(',')[1]
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.8,
        maxOutputTokens: 2048,
      }
    };

    try {
      const data = await this.makeApiCall(payload);
      console.log('Gemini Vision raw response:', data);
      
      const text = data.candidates[0].content.parts[0].text;
      console.log('Gemini Vision response text:', text);
      
      // Extract JSON from the response
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        // Try to find JSON within code blocks
        jsonMatch = text.match(/```json\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          jsonMatch[0] = jsonMatch[1];
        }
      }
      
      if (!jsonMatch) {
        console.error('No valid JSON found in vision response:', text);
        throw new Error('No valid JSON found in Gemini Vision response');
      }

      console.log('Extracted Vision JSON:', jsonMatch[0]);
      const nutritionData = JSON.parse(jsonMatch[0]);
      
      return {
        calories: nutritionData.totalCalories || 0,
        carbs: nutritionData.totalCarbs || 0,
        protein: nutritionData.totalProtein || 0,
        fat: nutritionData.totalFat || 0,
        foods: nutritionData.foods || [],
        breakdown: nutritionData.breakdown || []
      };
    } catch (error) {
      console.error('Error analyzing image with Gemini:', error);
      throw error;
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
