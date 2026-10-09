import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  enableDropCap?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, enableDropCap = true }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse inline formatting (bold, italic, code, link)
  const renderInline = (text: string): React.ReactNode => {
    // Regex for inline code: `code`
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded text-[13px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-white/95">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} className="italic text-stone-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const titleMatch = part.match(/\[([^\]]+)\]/);
        const urlMatch = part.match(/\(([^)]+)\)/);
        if (titleMatch && urlMatch) {
          return (
            <a
              key={idx}
              href={urlMatch[1]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 font-medium transition-colors"
            >
              {titleMatch[1]}
            </a>
          );
        }
      }
      return part;
    });
  };

  // Block parser
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let codeBlockCount = 0;
  let firstParagraphRendered = false;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced Code Block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const fullCode = codeLines.join('\n');
      const currentCodeIndex = codeBlockCount++;
      const isCopied = copiedIndex === currentCodeIndex;

      elements.push(
        <div key={`code-${i}`} className="my-6 rounded-xl overflow-hidden border border-white/10 bg-[#141417]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.03] text-xs font-mono text-stone-400">
            <span>{lang || 'code'}</span>
            <button
              onClick={() => copyCode(fullCode, currentCodeIndex)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
              title="Copy code"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-100 leading-relaxed">
            <code>{fullCode}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Horizontal Rule
    if (/^(\-{3,}|\*{3,})$/.test(line.trim())) {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-t border-white/10" />);
      i++;
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableRows.push(lines[i].trim());
        i++;
      }
      if (tableRows.length >= 2) {
        const headerCols = tableRows[0].split('|').slice(1, -1).map((s) => s.trim());
        const dataRows = tableRows.slice(2); // Skip separator row

        elements.push(
          <div key={`table-${i}`} className="my-6 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-stone-300">
                <tr>
                  {headerCols.map((h, hIdx) => (
                    <th key={hIdx} className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-stone-300">
                {dataRows.map((r, rIdx) => {
                  const cols = r.split('|').slice(1, -1).map((s) => s.trim());
                  return (
                    <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                      {cols.map((c, cIdx) => (
                        <td key={cIdx} className="px-4 py-3">
                          {renderInline(c)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="font-editorial text-3xl md:text-4xl font-bold text-white mt-10 mb-4 tracking-tight">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-editorial text-2xl md:text-3xl font-semibold text-white mt-8 mb-3 tracking-tight">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-editorial text-xl md:text-2xl font-semibold text-white mt-6 mb-2">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="my-6 pl-4 border-l-2 border-emerald-400 bg-emerald-500/[0.04] py-3 pr-4 text-stone-300 italic text-base leading-relaxed"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className={qIdx > 0 ? 'mt-2' : ''}>
              {renderInline(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered List
    if (/^[-*]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 pl-6 space-y-2 list-disc list-outside text-stone-300">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 pl-6 space-y-2 list-decimal list-outside text-stone-300">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Regular Paragraph
    const isFirst = !firstParagraphRendered && enableDropCap;
    firstParagraphRendered = true;

    elements.push(
      <p
        key={`p-${i}`}
        className={`my-4 text-stone-300 text-base md:text-lg leading-[1.8] ${
          isFirst ? 'drop-cap' : ''
        }`}
      >
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="reading-column prose-invert max-w-none">{elements}</div>;
};
