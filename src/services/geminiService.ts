
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

  constructor(apiKey: string) {
    this.apiKey = apiKey;
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

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error details:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
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

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini Vision API error details:', errorData);
        throw new Error(`Gemini Vision API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
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
