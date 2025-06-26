import React, { useState, useEffect, useCallback } from 'react';
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Slider } from "@/components/ui/slider";
const isClient = typeof window !== 'undefined';

// Font options based on common web-safe fonts
const FONT_OPTIONS = {
  sans: ['Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 'Gill Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'], // Added Tailwind default stack
  serif: ['Times New Roman', 'Georgia', 'Palatino', 'Garamond', 'Baskerville'],
  mono: ['Courier New', 'Lucida Console', 'Monaco', 'Consolas', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'], // Added Tailwind default stack
};

// Keys for localStorage
const SETTINGS_STORAGE_KEY = 'app-custom-settings';

// Default settings structure
const DEFAULT_SETTINGS = {
  colors: {
    primary: '#2160fd', // Example default, adjust as needed
    primaryForeground: '#ffffff',
    secondary: '#f7f7f8',
    secondaryForeground: '#383942',
    destructive: '#e5484d',
    destructiveForeground: '#ffffff',
  },
  typography: {
    sans: 'system-ui', // Default to system font stack
    serif: 'Georgia',
    mono: 'ui-monospace',
  },
  radius: 0.625, // Default from your index.css
};
function ColorPicker({ label, color, onChange }) {
    const handleHexChange = (e) => {
      onChange(e.target.value);
    };
  
    const handleColorInputChange = (e) => {
      onChange(e.target.value);
    };
  
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center space-x-2">
          <Input
                 type="color"
                 value={color}
                 onChange={handleColorInputChange}
                 className="w-10 h-10 p-0 border cursor-pointer" 
          />
          <Input
            type="text"
            value={color}
            onChange={handleHexChange}
            className="flex-1"
            aria-label={`${label} hex color code`}
          />
        </div>
      </div>
    );
  }
export  function SettingPage(){
  return(
    <>
    <ThemeSelector />
    
    </>
  )
  
}