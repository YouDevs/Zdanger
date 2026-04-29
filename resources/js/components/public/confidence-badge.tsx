import { cn } from '@/lib/utils';

type ConfidenceBadgeProps = {
    value: number;
    className?: string;
};

export default function ConfidenceBadge({
    value,
    className,
}: ConfidenceBadgeProps) {
    const label =
        value >= 80 ? 'Alta confianza' : value >= 50 ? 'Confianza media' : 'Baja confianza';

    const tone =
        value >= 80
            ? 'bg-primary-container text-on-primary-container'
            : value >= 50
              ? 'bg-surface-container-high text-on-surface-variant'
              : 'bg-error-container text-on-error-container';

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                tone,
                className,
            )}
        >
            {label}
        </span>
    );
}
