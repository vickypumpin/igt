import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Country {
  id: number;
  name: string;
  code: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

export function CountrySelect({ value, onChange, placeholder = "Select country…", className, "data-testid": testId }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/geo/countries")
      .then(r => r.json())
      .then((data: Country[]) => setCountries(data))
      .catch(() => setCountries([]))
      .finally(() => setLoading(false));
  }, []);

  const selected = countries.find(c => String(c.id) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-10 rounded-xl font-normal", className)}
          disabled={loading}
          data-testid={testId}
        >
          <span className={selected ? "text-foreground" : "text-muted-foreground"}>
            {loading ? "Loading…" : selected ? selected.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country…" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map(country => (
                <CommandItem
                  key={country.id}
                  value={country.name}
                  onSelect={() => {
                    onChange(String(country.id));
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", String(country.id) === value ? "opacity-100" : "opacity-0")} />
                  {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
