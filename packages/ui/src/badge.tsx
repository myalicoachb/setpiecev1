import { forwardRef, type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-gray-800 text-gray-200': variant === 'default',
            'bg-emerald-900/50 text-emerald-400': variant === 'success',
            'bg-yellow-900/50 text-yellow-400': variant === 'warning',
            'bg-red-900/50 text-red-400': variant === 'danger',
            'bg-blue-900/50 text-blue-400': variant === 'info',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
