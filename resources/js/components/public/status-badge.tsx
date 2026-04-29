import { cn } from '@/lib/utils';

type StatusTone =
    | 'pending'
    | 'unverified'
    | 'community'
    | 'evidence'
    | 'confirmed';

type StatusBadgeProps = {
    tone: StatusTone;
    children: React.ReactNode;
    className?: string;
};

const toneClasses: Record<StatusTone, string> = {
    pending: 'bg-[#fff3d8] text-[#9a6700]',
    unverified: 'bg-slate-100 text-slate-600',
    community: 'bg-[#dbe8ff] text-[#2563eb]',
    evidence: 'bg-[#dcfce7] text-[#15803d]',
    confirmed: 'bg-[#d8f6df] text-[#166534]',
};

export default function StatusBadge({
    tone,
    children,
    className,
}: StatusBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold',
                toneClasses[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}
