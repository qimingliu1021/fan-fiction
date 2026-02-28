import React from "react";

type AccordionProps = React.HTMLAttributes<HTMLDivElement>;

export function Accordion({
  children,
  className = "",
  ...props
}: AccordionProps) {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

type AccordionItemProps = React.DetailsHTMLAttributes<HTMLDetailsElement>;

export function AccordionItem({
  children,
  className = "",
  ...props
}: AccordionItemProps) {
  return (
    <details
      className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </details>
  );
}

type AccordionTriggerProps = React.HTMLAttributes<HTMLMapElement>;

export function AccordionTrigger({
  children,
  className = "",
  ...props
}: AccordionTriggerProps) {
  return (
    <summary
      className={`cursor-pointer select-none px-4 py-3 bg-gray-100 hover:bg-gray-200 font-medium ${className}`}
      {...props}
    >
      {children}
    </summary>
  );
}

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export function AccordionContent({
  children,
  className = "",
  ...props
}: AccordionContentProps) {
  return (
    <div className={`px-4 py-3 bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}
