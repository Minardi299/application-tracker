
import { defaultPresets } from "@/lib/theme-preset" 
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-provider"

export function ThemeSelector() {
  const { setPreset } = useTheme();
  const resetTheme = () => {
    const root = document.documentElement;
    // Remove all inline custom properties
    [...root.style].forEach((key) => {
      if (key.startsWith("--")) {
        root.style.removeProperty(key);
      }
    });
    // Set preset to null if you're tracking it
    setPreset(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(defaultPresets).map(([key, preset]) => {
        const lightTheme = preset.styles.light;
        return (
          <Button
            key={key}
            onClick={() => setPreset(preset)}
            className="flex flex-col items-start gap-2 p-4 border border-muted hover:border-primary transition-colors"
            variant="outline"
          >
            <div className="font-medium text-base">{preset.label}</div>
            <div className="flex gap-1">
              <span className="h-4 w-4 rounded-sm" style={{ backgroundColor: lightTheme.primary }} />
              <span className="h-4 w-4 rounded-sm" style={{ backgroundColor: lightTheme.accent }} />
              <span className="h-4 w-4 rounded-sm" style={{ backgroundColor: lightTheme.background }} />
              <span className="h-4 w-4 rounded-sm" style={{ backgroundColor: lightTheme.secondary }} />
            </div>
          </Button>
        );
      })}
      <Button
        variant="destructive"
        className="w-fit self-start"
        onClick={resetTheme}
      >
        Reset to Default Theme
      </Button>
    </div>
  );
}