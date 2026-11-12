import { Slot } from '@radix-ui/react-slot'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/src/lib/utils'
export function Button({ asChild, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
 const Comp = asChild ? Slot : 'button'
 return <Comp className={cn('button', className)} {...props}/>
}
