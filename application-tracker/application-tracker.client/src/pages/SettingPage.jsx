import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@/components/theme-provider'; //
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
  const { theme, setTheme } = useTheme(); // For Light/Dark mode
  const [customSettings, setCustomSettings] = useState(DEFAULT_SETTINGS);

  // Load settings from localStorage on initial mount (client-side only)
  useEffect(() => {
    if (!isClient) return; // Ensure localStorage is accessed only on the client

    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Merge saved settings with defaults to handle potential missing keys
        setCustomSettings(prev => ({
          colors: { ...prev.colors, ...parsedSettings.colors },
          typography: { ...prev.typography, ...parsedSettings.typography },
          radius: parsedSettings.radius !== undefined ? parsedSettings.radius : prev.radius,
        }));
      } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
        // Use default settings if parsing fails
         setCustomSettings(DEFAULT_SETTINGS);
      }
    } else {
       // Use default settings if nothing is saved
       setCustomSettings(DEFAULT_SETTINGS);
    }
  }, []);

  // Apply settings whenever they change
  useEffect(() => {
    if (!isClient) return; // Ensure document is accessed only on the client

    const root = document.documentElement;
    // Apply Colors
    Object.entries(customSettings.colors).forEach(([key, value]) => {
        // Convert camelCase key to kebab-case CSS variable name
        // e.g., primaryForeground -> --primary-foreground
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        //TODO THIS IS IMPORTANT AND THIS IS WHERE YOU CHANGE THE CSS
        if (value) {
            root.style.setProperty(cssVarName, value);
            // Note: index.css uses OKLCH. Setting hex directly overrides it.
            // For full consistency, you'd convert hex to OKLCH here.
        }
    });

    // Apply Typography (Basic: applying to body - Tailwind config is more robust)
    // Note: This is a simplified approach. Integrating fully with Tailwind's font config
    // would involve updating tailwind.config.js and potentially CSS variables.
    const body = document.body;
    body.style.fontFamily = customSettings.typography.sans; // Example: set body default
    // You might need more specific CSS variables or classes for serif/mono application

    // Apply Radius
    if (customSettings.radius !== undefined) {
        root.style.setProperty('--radius', `${customSettings.radius}rem`);
    }

  }, [customSettings]);

  const handleSettingChange = (category, key, value) => {
    setCustomSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleRadiusChange = (value) => {
    // Slider returns an array, we need the first value
    const newRadius = value[0];
     handleSettingChange('radius', null, newRadius); // Store radius directly under settings object
     // Correction: Update state correctly for radius (not nested)
      setCustomSettings(prev => ({ ...prev, radius: newRadius }));
  };




  const saveConfiguration = useCallback(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(customSettings));
      alert('Configuration saved!'); // Or use a Shadcn Toast component
    } catch (e) {
       console.error("Failed to save settings to localStorage", e);
       alert('Error saving configuration.');
    }
  }, [customSettings]);

  const handleFontChange = (fontType, value) => {
     handleSettingChange('typography', fontType, value);
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Mode Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Mode</h2>
        <div className="flex space-x-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
          >
            Dark
          </Button>
           <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            onClick={() => setTheme('system')}
          >
            System
          </Button>
          <Button variant='outline' onClick={() => setTheme('system')} title="Reset mode to system default">
            Reset
          </Button>
        </div>
      </section>

      {/* Themes Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Choose Your Theme</h2>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="radius">Radius</TabsTrigger> {/* Renamed from 'Others' */}
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ColorPicker
              label="Primary"
              color={customSettings.colors.primary}
              onChange={(value) => handleSettingChange('colors', 'primary', value)}
            />
            <ColorPicker
              label="Primary Foreground"
              color={customSettings.colors.primaryForeground}
              onChange={(value) => handleSettingChange('colors', 'primaryForeground', value)}
            />
            <ColorPicker
              label="Secondary"
              color={customSettings.colors.secondary}
              onChange={(value) => handleSettingChange('colors', 'secondary', value)}
            />
            <ColorPicker
              label="Secondary Foreground"
              color={customSettings.colors.secondaryForeground}
              onChange={(value) => handleSettingChange('colors', 'secondaryForeground', value)}
            />
            <ColorPicker
              label="Destructive"
              color={customSettings.colors.destructive}
              onChange={(value) => handleSettingChange('colors', 'destructive', value)}
            />
            <ColorPicker
              label="Destructive Foreground"
              color={customSettings.colors.destructiveForeground}
              onChange={(value) => handleSettingChange('colors', 'destructiveForeground', value)}
            />
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="mt-4 space-y-6">
             <div className="space-y-2">
                <Label htmlFor="font-sans">Sans Serif Font</Label>
                 <Select
                    value={customSettings.typography.sans}
                    onValueChange={(value) => handleFontChange('sans', value)}
                 >
                    <SelectTrigger id="font-sans">
                        <SelectValue placeholder="Select sans-serif font" />
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_OPTIONS.sans.map(font => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="font-serif">Serif Font</Label>
                 <Select
                    value={customSettings.typography.serif}
                    onValueChange={(value) => handleFontChange('serif', value)}
                 >
                    <SelectTrigger id="font-serif">
                        <SelectValue placeholder="Select serif font" />
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_OPTIONS.serif.map(font => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="font-mono">Monospace Font</Label>
                 <Select
                    value={customSettings.typography.mono}
                    onValueChange={(value) => handleFontChange('mono', value)}
                 >
                    <SelectTrigger id="font-mono">
                        <SelectValue placeholder="Select monospace font" />
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_OPTIONS.mono.map(font => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>{font}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
          </TabsContent>

          {/* Radius Tab */}
          <TabsContent value="radius" className="mt-4 space-y-4">
             <Label htmlFor="radius-slider">Component Radius</Label>
             <div className='flex items-center space-x-4'>
                <Slider
                    id="radius-slider"
                    min={0}
                    max={2}
                    step={0.125}
                    value={[customSettings.radius]} // Slider expects an array
                    onValueChange={handleRadiusChange}
                    className="flex-1"
                />
                 <span className='text-sm text-muted-foreground w-16 text-right'>{customSettings.radius.toFixed(3)} rem</span>
             </div>

          </TabsContent>
        </Tabs>
      </section>

       {/* Save Button */}
        <div className="flex justify-end pt-4">
            <Button onClick={saveConfiguration}>Save Configuration</Button>
        </div>
    </div>
  );
}