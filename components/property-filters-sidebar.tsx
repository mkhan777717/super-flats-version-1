"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCcw } from "lucide-react";

const fmtIN = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export type SidebarFilterState = {
  bhkTypes: string[];
  rentRange: [number, number];
  availability: string; // available | occupied | maintenance | ""
};

export function PropertyFiltersSidebar({
  onApply, maxRent = 500000,
}: { onApply: (f: SidebarFilterState) => void; maxRent?: number; }) {
  const [f, setF] = useState<SidebarFilterState>({ bhkTypes: [], rentRange: [0, maxRent], availability: "" });
  const bhkOptions = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK+"];

  const reset = () => { const r = { bhkTypes: [], rentRange: [0, maxRent], availability: "" as const }; setF(r); onApply(r); };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Badge variant="secondary">{f.bhkTypes.length ? f.bhkTypes.join(", ") : "All BHK"}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={14} className="mr-1" />Reset</Button>
          <Button size="sm" onClick={() => onApply(f)}>Apply</Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 max-h-[28rem] overflow-y-auto">
        <section>
          <h3 className="font-medium text-gray-900 mb-3">BHK Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {bhkOptions.map(bhk => {
              const active = f.bhkTypes.includes(bhk);
              return (
                <Button key={bhk} variant={active ? "default" : "outline"} size="sm"
                  onClick={() => setF(s => ({ ...s, bhkTypes: active ? s.bhkTypes.filter(x => x !== bhk) : [...s.bhkTypes, bhk] }))}>
                  {bhk}
                </Button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="font-medium text-gray-900 mb-3">Rent Range</h3>
          <div className="px-2">
            <Slider value={f.rentRange} min={0} max={maxRent} step={1000}
              onValueChange={(val: [number, number]) => setF(s => ({ ...s, rentRange: val }))} />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹{fmtIN.format(f.rentRange[0])}</span>
              <span>₹{fmtIN.format(f.rentRange[1])}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
          <RadioGroup value={f.availability} onValueChange={(v) => setF(s => ({ ...s, availability: v }))} className="space-y-2">
            {[
              { value: "", label: "Anytime" },
              { value: "available", label: "Available now" },
              { value: "occupied", label: "Occupied" },
              { value: "maintenance", label: "Maintenance" },
            ].map(opt => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem id={`av-${opt.value || "any"}`} value={opt.value} />
                <Label htmlFor={`av-${opt.value || "any"}`} className="text-sm text-gray-700">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </section>
      </CardContent>
    </Card>
  );
}
