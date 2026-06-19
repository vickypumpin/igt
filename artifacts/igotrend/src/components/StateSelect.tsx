import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface StateItem {
  id: number;
  countryId: number;
  name: string;
}

interface StateSelectProps {
  value: string;
  onChange: (value: string) => void;
  countryId: string;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

export function StateSelect({ value, onChange, countryId, placeholder = "Select state…", className, "data-testid": testId }: StateSelectProps) {
  const [open, setOpen] = useState(false);
  const [states, setStates] = useState<StateItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryId) {
      setStates([]);
      return;
    }
    setLoading(true);
    fetch(`/api/geo/states?countryId=${countryId}`)
      .then(r => r.json())
      .then((data: StateItem[]) => setStates(data))
      .catch(() => setStates([]))
      .finally(() => setLoading(false));
  }, [countryId]);

  const selected = states.find(s => String(s.id) === value);
  const disabled = !countryId || loading;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-10 rounded-xl font-normal", className)}
          disabled={disabled}
          data-testid={testId}
        >
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {!countryId
              ? "Select a country first"
              : loading
              ? "Loading…"
              : selected
              ? selected.name
              : states.length === 0
              ? "No states available"
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search state…" />
          <CommandList>
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup>
              {states.map(state => (
                <CommandItem
                  key={state.id}
                  value={state.name}
                  onSelect={() => {
                    onChange(String(state.id));
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", String(state.id) === value ? "opacity-100" : "opacity-0")} />
                  {state.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
