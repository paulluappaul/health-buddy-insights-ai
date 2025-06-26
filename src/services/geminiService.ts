
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
    const prompt = `Analyze this food description and provide accurate nutritional information: "${description}"

Please provide a detailed breakdown in the following JSON format:
{
  "totalCalories": number,
  "totalCarbs": number (in grams),
  "totalProtein": number (in grams),
  "totalFat": number (in grams),
  "foods": ["list of detected foods"],
  "breakdown": [
    {
      "ingredient": "food name",
      "amount": "estimated amount (e.g., 100g, 1 cup)",
      "calories": number,
      "carbs": number,
      "protein": number,
      "fat": number
    }
  ]
}

Be as accurate as possible with standard nutritional values. If amounts aren't specified, estimate reasonable serving sizes.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

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
      console.error('Error analyzing food with Gemini:', error);
      throw error;
    }
  }

  async analyzeImage(imageFile: File): Promise<NutritionAnalysis> {
    // Convert image to base64
    const base64Image = await this.fileToBase64(imageFile);
    
    const prompt = `Analyze this food image and identify all visible foods with their estimated quantities. Provide accurate nutritional information in the following JSON format:
{
  "totalCalories": number,
  "totalCarbs": number (in grams),
  "totalProtein": number (in grams),
  "totalFat": number (in grams),
  "foods": ["list of detected foods"],
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

Be as accurate as possible with portion size estimation and standard nutritional values.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.apiKey}`, {
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
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini Vision API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

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
