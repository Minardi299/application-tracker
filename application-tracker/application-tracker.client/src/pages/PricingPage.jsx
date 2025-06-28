import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { HoverCardDemo } from "@/components/hover-card";
export function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10">
      
      <h1 className="text-balance text-5xl font-semibold leading-none tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
      It&apos;s{" "}
        <LineShadowText className="italic font-bold" shadowColor={"var(--primary)"}>
            Free
        </LineShadowText>{" "}
      
      in perpetuity throughout the universe.
    </h1>
      <h3 className="text-lg">The code for it can be found in my</h3>
      <a
        href="https://github.com/Minardi299/application-tracker"
        target="_blank"
        rel="noopener noreferrer"
      >
        <HoverCardDemo />
        </a>
        <h3 className="text-lg">in case you want to host it yourself</h3>
    </div>
  );
}
