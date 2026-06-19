import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface TagMultiSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

function parseValue(v: string): string[] {
  if (!v || !v.trim()) return [];
  return v.split(",").map(s => s.trim()).filter(Boolean);
}

function serializeValue(tags: string[]): string {
  return tags.join(", ");
}

export function TagMultiSelect({ options, value, onChange, placeholder = "Select tags…", className, "data-testid": testId }: TagMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = parseValue(value);
  const triggerRef = useRef<HTMLDivElement>(null);

  const toggle = (tag: string) => {
    const current = parseValue(value);
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onChange(serializeValue(next));
  };

  const remove = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = parseValue(value).filter(t => t !== tag);
    onChange(serializeValue(next));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          tabIndex={0}
          data-testid={testId}
          className={cn(
            "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-xl border border-input bg-background px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring",
            className
          )}
          onClick={() => setOpen(o => !o)}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(o => !o); } }}
        >
          {selected.length === 0 ? (
            <span className="text-muted-foreground flex-1">{placeholder}</span>
          ) : (
            selected.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium">
                {tag}
                <button
                  type="button"
                  className="ml-0.5 rounded-full hover:bg-muted p-0.5"
                  onClick={(e) => remove(tag, e)}
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => toggle(option)}
                >
                  <Check className={cn("mr-2 h-4 w-4", selected.includes(option) ? "opacity-100" : "opacity-0")} />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
