import React from 'react';

/**
 * Lightweight safe markdown renderer for exam questions, code snippets, and explanations.
 * Supports bold, inline code, fenced code blocks, bullet lists, and paragraphs.
 */
export function FormattedText({ content = '', className = '' }) {
  if (!content) return null;

  // Split by code blocks first
  const parts = [];
  const codeBlockRegex = /```([a-z0-9_-]*)\n([\s\S]*?)```/gi;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'codeblock',
      lang: match[1] || 'code',
      content: match[2].trim()
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }

  return (
    <div className={`space-y-3 leading-relaxed text-[#2d2f31] ${className}`}>
      {parts.map((part, pIdx) => {
        if (part.type === 'codeblock') {
          return (
            <div key={pIdx} className="my-3 rounded-lg overflow-hidden border border-[#d1d7dc] bg-[#1e1e1e] text-white">
              {part.lang && (
                <div className="bg-[#2d2d2d] px-4 py-1.5 text-xs font-mono text-gray-300 border-b border-gray-700 flex justify-between items-center">
                  <span>{part.lang.toUpperCase()}</span>
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-300 leading-normal">
                <code>{part.content}</code>
              </pre>
            </div>
          );
        }

        // Render text with paragraphs, bullet lists, bold, inline code
        const paragraphs = part.content.split(/\n\n+/);
        return (
          <React.Fragment key={pIdx}>
            {paragraphs.map((para, paraIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // Check if bullet list
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const items = trimmed.split(/\n[-*]\s+/).filter(Boolean);
                return (
                  <ul key={paraIdx} className="list-disc pl-5 space-y-1.5 my-2">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{renderInline(item)}</li>
                    ))}
                  </ul>
                );
              }

              // Normal paragraph with line breaks
              const lines = trimmed.split('\n');
              return (
                <p key={paraIdx} className="text-[15px] sm:text-[16px]">
                  {lines.map((line, lineIdx) => (
                    <React.Fragment key={lineIdx}>
                      {renderInline(line)}
                      {lineIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderInline(text) {
  // Parse inline bold (**bold**) and inline code (`code`)
  const tokens = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
  let lastIdx = 0;
  let m;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      tokens.push(text.substring(lastIdx, m.index));
    }
    const matchStr = m[0];
    if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
      tokens.push(
        <strong key={m.index} className="font-bold text-[#2d2f31]">
          {matchStr.slice(2, -2)}
        </strong>
      );
    } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
      tokens.push(
        <code
          key={m.index}
          className="px-1.5 py-0.5 mx-0.5 text-xs sm:text-sm font-mono bg-[#f2f3f5] text-[#b32d0f] rounded border border-[#d1d7dc]"
        >
          {matchStr.slice(1, -1)}
        </code>
      );
    } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
      tokens.push(
        <em key={m.index} className="italic text-[#2d2f31]">
          {matchStr.slice(1, -1)}
        </em>
      );
    }
    lastIdx = m.index + matchStr.length;
  }

  if (lastIdx < text.length) {
    tokens.push(text.substring(lastIdx));
  }

  return tokens.length > 0 ? tokens : text;
}
