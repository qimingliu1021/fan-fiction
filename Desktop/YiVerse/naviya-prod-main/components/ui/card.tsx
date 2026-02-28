import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'elevated'
}

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const base = 'rounded-lg overflow-hidden bg-white'
  const style = {
    default: 'shadow',
    elevated: 'shadow-lg hover:shadow-xl transition-shadow',
  }[variant]

  return (
    <div className={`${base} ${style} ${className}`} {...props}>
      {children}
    </div>
  )
}

type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}