
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // Função para personalizar o caption do calendário
  const CustomCaption = ({ displayMonth, onMonthChange }: any) => {
    // Meses em português
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    
    // Anos para seleção (de 1940 até o ano atual + 5)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1940 + 6 }, (_, i) => (currentYear + 5) - i).reverse();
    
    const handleMonthChange = (newMonthValue: string) => {
      const newMonth = months.findIndex(m => m === newMonthValue);
      if (newMonth !== -1) {
        const newDate = new Date(displayMonth);
        newDate.setMonth(newMonth);
        onMonthChange(newDate);
      }
    };
    
    const handleYearChange = (newYearValue: string) => {
      const newDate = new Date(displayMonth);
      newDate.setFullYear(parseInt(newYearValue));
      onMonthChange(newDate);
    };
    
    return (
      <div className="flex items-center justify-between gap-1 pt-1">
        <Select 
          value={months[displayMonth.getMonth()]} 
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="w-[110px] h-8 bg-black border-black text-white">
            <SelectValue placeholder={months[displayMonth.getMonth()]} />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>{month}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={displayMonth.getFullYear().toString()} 
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-[70px] h-8 bg-black border-black text-white">
            <SelectValue placeholder={displayMonth.getFullYear()} />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center", // Iremos substituir pelo CustomCaption
        caption_label: "text-sm font-medium hidden", // Escondido pois usaremos componente customizado
        nav: "space-x-1 flex items-center hidden", // Escondido pois a navegação será pelo selectbox
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
