
import React from 'react';
import { Input } from '@/components/ui/input';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ApiKeyInput = ({ apiKey, onApiKeyChange }: ApiKeyInputProps) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        Gemini API Key (required for accurate analysis):
      </label>
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="Enter your Gemini Pro API key"
        className="mb-2"
      />
      <p className="text-xs text-gray-500">
        Get your API key from Google AI Studio. Your key is stored locally and not sent anywhere except Google's API.
      </p>
    </div>
  );
};

export default ApiKeyInput;
