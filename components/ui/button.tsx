import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-teal-700 text-white hover:bg-teal-800',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  outline: 'border border-teal-700 text-teal-700 hover:bg-teal-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  )
)

Button.displayName = 'Button'
