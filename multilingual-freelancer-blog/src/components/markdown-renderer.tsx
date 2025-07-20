import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn('prose prose-slate dark:prose-invert max-w-none', className)}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}