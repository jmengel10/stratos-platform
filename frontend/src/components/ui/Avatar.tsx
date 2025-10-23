import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const colors = [
  'bg-primary',
  'bg-navy', 
  'bg-purple-600',
  'bg-green-600',
  'bg-orange-600',
  'bg-pink-600',
  'bg-blue-600',
  'bg-indigo-600'
];

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colorIndex = name.length % colors.length;
  const bgColor = colors[colorIndex];

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center text-white font-medium',
        bgColor,
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
