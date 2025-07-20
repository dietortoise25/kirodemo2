import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Label } from "./label";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        const id = props.id || props.name;

        return (
            <div className="w-full">
                {label && <Label htmlFor={id}>{label}</Label>}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-destructive",
                        className
                    )}
                    ref={ref}
                    {...props}
                    id={id}
                />
                {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };