import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'link';
  className?: string;
}

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  let base = 'px-4 py-2 rounded-lg font-semibold transition focus:outline-none'
  let styles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-white text-white hover:bg-white hover:text-blue-600',
    link: 'bg-transparent text-white underline-offset-4 hover:underline'
  }[variant]

  return (
    <button className={`${base} ${styles} ${className}`} {...props} />
  )
}