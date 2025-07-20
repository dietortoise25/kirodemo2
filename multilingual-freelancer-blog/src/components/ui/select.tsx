import { forwardRef, useState } from "react";
import { cn } from "../../lib/utils";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value?: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

/**
 * 选择组件
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
    (
        { value, onValueChange, options, placeholder = "请选择", disabled = false, className },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedOption = options.find((option) => option.value === value);

        return (
            <div
                ref={ref}
                className={cn(
                    "relative inline-block w-full",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                <button
                    type="button"
                    className={cn(
                        "flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        disabled && "cursor-not-allowed"
                    )}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <ul className="absolute z-20 w-full mt-1 max-h-60 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    className={cn(
                                        "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        value === option.value && "bg-accent text-accent-foreground"
                                    )}
                                    onClick={() => {
                                        onValueChange(option.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    }
);