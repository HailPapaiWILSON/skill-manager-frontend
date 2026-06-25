import * as React from "react";

export function Tabs({ defaultValue, className, children, ...props }: any) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            setValue,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ className, children, ...props }: any) {
  return (
    <div
      className={`flex gap-1 p-1 bg-muted rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  setValue,
  className,
  children,
  ...props
}: any) {
  const isActive = value === props.value;
  return (
    <button
      onClick={() => setValue(props.value)}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
        isActive ? "bg-background shadow-sm" : "hover:bg-background/50"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, ...props }: any) {
  if (value !== props.value) return null;
  return <div {...props}>{children}</div>;
}
