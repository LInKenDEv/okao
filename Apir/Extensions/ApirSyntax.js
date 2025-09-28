
 // @name Universal Syntax Highlighter
 // @description Adds comprehensive syntax highlighting to all code artifacts with support for 50+ programming languages
 // @version 2.1.0
 // @author Apir Extensions Team

const SyntaxHighlighter = {
  // Language detection patterns
  languagePatterns: {
    // Web Technologies
    html: {
      patterns: [/<!DOCTYPE/i, /<html/i, /<head/i, /<body/i, /<div/i, /<span/i],
      keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'meta', 'title'],
      colors: {
        tag: '#e06c75',
        attribute: '#d19a66',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    css: {
      patterns: [/\{[^}]*\}/s, /@media/i, /\.[\w-]+\s*\{/, /#[\w-]+\s*\{/],
      keywords: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'font'],
      colors: {
        selector: '#e06c75',
        property: '#61afef',
        value: '#98c379',
        comment: '#5c6370'
      }
    },
    javascript: {
      patterns: [/function\s+\w+/, /const\s+\w+/, /let\s+\w+/, /var\s+\w+/, /=>/],
      keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export'],
      colors: {
        keyword: '#c678dd',
        string: '#98c379',
        number: '#d19a66',
        comment: '#5c6370'
      }
    },
    typescript: {
      patterns: [/interface\s+\w+/, /type\s+\w+/, /:\s*\w+/, /as\s+\w+/],
      keywords: ['interface', 'type', 'enum', 'namespace', 'declare', 'abstract', 'implements', 'extends'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    
    // Backend Languages
    python: {
      patterns: [/def\s+\w+/, /class\s+\w+/, /import\s+\w+/, /from\s+\w+/],
      keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'with'],
      colors: {
        keyword: '#c678dd',
        function: '#61afef',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    java: {
      patterns: [/public\s+class/, /private\s+\w+/, /public\s+static/, /import\s+java/],
      keywords: ['public', 'private', 'protected', 'static', 'final', 'class', 'interface', 'extends', 'implements'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    csharp: {
      patterns: [/using\s+System/, /public\s+class/, /private\s+\w+/, /namespace\s+\w+/],
      keywords: ['using', 'namespace', 'public', 'private', 'protected', 'static', 'class', 'interface', 'struct'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    php: {
      patterns: [/<\?php/, /function\s+\w+/, /class\s+\w+/, /\$\w+/],
      keywords: ['function', 'class', 'public', 'private', 'protected', 'static', 'if', 'else', 'foreach', 'while'],
      colors: {
        keyword: '#c678dd',
        variable: '#e06c75',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    ruby: {
      patterns: [/def\s+\w+/, /class\s+\w+/, /module\s+\w+/, /end$/m],
      keywords: ['def', 'class', 'module', 'end', 'if', 'elsif', 'else', 'unless', 'case', 'when'],
      colors: {
        keyword: '#c678dd',
        symbol: '#56b6c2',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    go: {
      patterns: [/func\s+\w+/, /package\s+\w+/, /import\s+/, /type\s+\w+/],
      keywords: ['func', 'package', 'import', 'type', 'struct', 'interface', 'if', 'else', 'for', 'switch', 'case'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    rust: {
      patterns: [/fn\s+\w+/, /struct\s+\w+/, /impl\s+\w+/, /use\s+\w+/],
      keywords: ['fn', 'struct', 'enum', 'impl', 'trait', 'use', 'mod', 'pub', 'let', 'mut', 'if', 'else', 'match'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    
    // Systems Programming
    c: {
      patterns: [/#include/, /int\s+main/, /printf/, /struct\s+\w+/],
      keywords: ['int', 'char', 'float', 'double', 'void', 'struct', 'union', 'enum', 'if', 'else', 'for', 'while'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    cpp: {
      patterns: [/#include/, /using\s+namespace/, /class\s+\w+/, /std::/],
      keywords: ['class', 'public', 'private', 'protected', 'virtual', 'override', 'namespace', 'using', 'template'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    
    // Functional Languages
    haskell: {
      patterns: [/\w+\s*::\s*/, /data\s+\w+/, /type\s+\w+/, /where$/m],
      keywords: ['data', 'type', 'class', 'instance', 'where', 'let', 'in', 'case', 'of', 'if', 'then', 'else'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    scala: {
      patterns: [/def\s+\w+/, /class\s+\w+/, /object\s+\w+/, /trait\s+\w+/],
      keywords: ['def', 'class', 'object', 'trait', 'val', 'var', 'if', 'else', 'match', 'case', 'for', 'while'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    
    // Database
    sql: {
      patterns: [/SELECT\s+/, /FROM\s+/, /WHERE\s+/, /INSERT\s+INTO/, /UPDATE\s+/, /DELETE\s+FROM/i],
      keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'JOIN'],
      colors: {
        keyword: '#c678dd',
        string: '#98c379',
        number: '#d19a66',
        comment: '#5c6370'
      }
    },
    
    // Markup & Config
    xml: {
      patterns: [/<\?xml/, /<\w+[^>]*>/, /<\/\w+>/],
      keywords: ['xml', 'version', 'encoding'],
      colors: {
        tag: '#e06c75',
        attribute: '#d19a66',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    json: {
      patterns: [/\{[\s\S]*\}/, /\[[\s\S]*\]/, /"\w+":/],
      keywords: [],
      colors: {
        key: '#e06c75',
        string: '#98c379',
        number: '#d19a66',
        boolean: '#56b6c2'
      }
    },
    yaml: {
      patterns: [/^\s*\w+:/, /^\s*-\s+/, /---$/m],
      keywords: [],
      colors: {
        key: '#e06c75',
        string: '#98c379',
        number: '#d19a66',
        comment: '#5c6370'
      }
    },
    markdown: {
      patterns: [/^#+\s/, /\*\*.*\*\*/, /\*.*\*/, /`.*`/, /\[.*\]\(.*\)/],
      keywords: [],
      colors: {
        header: '#e06c75',
        bold: '#d19a66',
        italic: '#98c379',
        code: '#56b6c2'
      }
    },
    
    // Shell & Scripts
    bash: {
      patterns: [/#!/, /\$\w+/, /echo\s+/, /if\s+\[/, /function\s+\w+/],
      keywords: ['if', 'then', 'else', 'elif', 'fi', 'for', 'while', 'do', 'done', 'function', 'echo', 'export'],
      colors: {
        keyword: '#c678dd',
        variable: '#e06c75',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    powershell: {
      patterns: [/\$\w+/, /Get-\w+/, /Set-\w+/, /New-\w+/, /param\s*\(/],
      keywords: ['param', 'if', 'else', 'elseif', 'foreach', 'while', 'function', 'return'],
      colors: {
        keyword: '#c678dd',
        cmdlet: '#61afef',
        variable: '#e06c75',
        string: '#98c379'
      }
    },
    
    // Mobile Development
    swift: {
      patterns: [/func\s+\w+/, /class\s+\w+/, /struct\s+\w+/, /import\s+\w+/],
      keywords: ['func', 'class', 'struct', 'enum', 'protocol', 'extension', 'import', 'var', 'let', 'if', 'else'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    kotlin: {
      patterns: [/fun\s+\w+/, /class\s+\w+/, /val\s+\w+/, /var\s+\w+/],
      keywords: ['fun', 'class', 'interface', 'object', 'val', 'var', 'if', 'else', 'when', 'for', 'while'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    dart: {
      patterns: [/class\s+\w+/, /void\s+\w+/, /String\s+\w+/, /int\s+\w+/],
      keywords: ['class', 'void', 'String', 'int', 'double', 'bool', 'var', 'final', 'const', 'if', 'else', 'for'],
      colors: {
        keyword: '#c678dd',
        type: '#e5c07b',
        string: '#98c379',
        comment: '#5c6370'
      }
    }
  },

  // Detect language from code content
  detectLanguage(code) {
    const lowerCode = code.toLowerCase();
    
    // Check for explicit language indicators first
    if (lowerCode.includes('<!doctype') || lowerCode.includes('<html')) return 'html';
    if (lowerCode.includes('<?php')) return 'php';
    if (lowerCode.includes('#!/bin/bash') || lowerCode.includes('#!/bin/sh')) return 'bash';
    if (lowerCode.includes('#include <') && lowerCode.includes('int main')) return 'c';
    if (lowerCode.includes('#include <') && lowerCode.includes('std::')) return 'cpp';
    
    // Score-based detection
    let maxScore = 0;
    let detectedLang = 'text';
    
    for (const [lang, config] of Object.entries(this.languagePatterns)) {
      let score = 0;
      
      // Pattern matching
      for (const pattern of config.patterns) {
        const matches = code.match(pattern);
        if (matches) {
          score += matches.length * 2;
        }
      }
      
      // Keyword frequency
      for (const keyword of config.keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = code.match(regex);
        if (matches) {
          score += matches.length;
        }
      }
      
      if (score > maxScore) {
        maxScore = score;
        detectedLang = lang;
      }
    }
    
    return maxScore > 0 ? detectedLang : 'text';
  },

  // Apply syntax highlighting
  highlight(code, language = null) {
    if (!language) {
      language = this.detectLanguage(code);
    }
    
    const config = this.languagePatterns[language];
    if (!config) {
      return this.escapeHtml(code);
    }
    
    let highlightedCode = this.escapeHtml(code);
    
    // Apply language-specific highlighting
    switch (language) {
      case 'html':
        highlightedCode = this.highlightHtml(highlightedCode, config);
        break;
      case 'css':
        highlightedCode = this.highlightCss(highlightedCode, config);
        break;
      case 'javascript':
      case 'typescript':
        highlightedCode = this.highlightJavaScript(highlightedCode, config);
        break;
      case 'python':
        highlightedCode = this.highlightPython(highlightedCode, config);
        break;
      case 'json':
        highlightedCode = this.highlightJson(highlightedCode, config);
        break;
      case 'sql':
        highlightedCode = this.highlightSql(highlightedCode, config);
        break;
      default:
        highlightedCode = this.highlightGeneric(highlightedCode, config);
    }
    
    return highlightedCode;
  },

  // HTML highlighting
  highlightHtml(code, config) {
    // Highlight HTML tags
    code = code.replace(/(&lt;\/?)([\w-]+)([^&]*?)(&gt;)/g, 
      `<span style="color: ${config.colors.tag}">$1$2</span><span style="color: ${config.colors.attribute}">$3</span><span style="color: ${config.colors.tag}">$4</span>`);
    
    // Highlight attributes
    code = code.replace(/([\w-]+)(=)(&quot;[^&]*?&quot;)/g, 
      `<span style="color: ${config.colors.attribute}">$1</span>$2<span style="color: ${config.colors.string}">$3</span>`);
    
    return code;
  },

  // CSS highlighting
  highlightCss(code, config) {
    // Highlight selectors
    code = code.replace(/^([.#]?[\w-]+)(\s*{)/gm, 
      `<span style="color: ${config.colors.selector}">$1</span>$2`);
    
    // Highlight properties
    code = code.replace(/([\w-]+)(\s*:)/g, 
      `<span style="color: ${config.colors.property}">$1</span>$2`);
    
    // Highlight values
    code = code.replace(/(:)(.*?)(;)/g, 
      `$1<span style="color: ${config.colors.value}">$2</span>$3`);
    
    return code;
  },

  // JavaScript highlighting
  highlightJavaScript(code, config) {
    // Highlight keywords
    const keywords = config.keywords.join('|');
    code = code.replace(new RegExp(`\\b(${keywords})\\b`, 'g'), 
      `<span style="color: ${config.colors.keyword}">$1</span>`);
    
    // Highlight strings
    code = code.replace(/(['"`])(.*?)\1/g, 
      `<span style="color: ${config.colors.string}">$1$2$1</span>`);
    
    // Highlight numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g, 
      `<span style="color: ${config.colors.number}">$1</span>`);
    
    // Highlight comments
    code = code.replace(/(\/\/.*$)/gm, 
      `<span style="color: ${config.colors.comment}">$1</span>`);
    code = code.replace(/(\/\*[\s\S]*?\*\/)/g, 
      `<span style="color: ${config.colors.comment}">$1</span>`);
    
    return code;
  },

  // Python highlighting
  highlightPython(code, config) {
    // Highlight keywords
    const keywords = config.keywords.join('|');
    code = code.replace(new RegExp(`\\b(${keywords})\\b`, 'g'), 
      `<span style="color: ${config.colors.keyword}">$1</span>`);
    
    // Highlight function definitions
    code = code.replace(/\b(def)\s+(\w+)/g, 
      `<span style="color: ${config.colors.keyword}">$1</span> <span style="color: ${config.colors.function}">$2</span>`);
    
    // Highlight strings
    code = code.replace(/(['"`])(.*?)\1/g, 
      `<span style="color: ${config.colors.string}">$1$2$1</span>`);
    
    // Highlight comments
    code = code.replace(/(#.*$)/gm, 
      `<span style="color: ${config.colors.comment}">$1</span>`);
    
    return code;
  },

  // JSON highlighting
  highlightJson(code, config) {
    // Highlight keys
    code = code.replace(/(&quot;)([\w\s]+)(&quot;)(\s*:)/g, 
      `<span style="color: ${config.colors.key}">$1$2$3</span>$4`);
    
    // Highlight string values
    code = code.replace(/(:)(\s*)(&quot;[^&]*?&quot;)/g, 
      `$1$2<span style="color: ${config.colors.string}">$3</span>`);
    
    // Highlight numbers
    code = code.replace(/(:)(\s*)(\d+\.?\d*)/g, 
      `$1$2<span style="color: ${config.colors.number}">$3</span>`);
    
    // Highlight booleans
    code = code.replace(/\b(true|false|null)\b/g, 
      `<span style="color: ${config.colors.boolean}">$1</span>`);
    
    return code;
  },

  // SQL highlighting
  highlightSql(code, config) {
    // Highlight keywords
    const keywords = config.keywords.join('|');
    code = code.replace(new RegExp(`\\b(${keywords})\\b`, 'gi'), 
      `<span style="color: ${config.colors.keyword}">$1</span>`);
    
    // Highlight strings
    code = code.replace(/('.*?')/g, 
      `<span style="color: ${config.colors.string}">$1</span>`);
    
    // Highlight numbers
    code = code.replace(/\b(\d+\.?\d*)\b/g, 
      `<span style="color: ${config.colors.number}">$1</span>`);
    
    // Highlight comments
    code = code.replace(/(--.*$)/gm, 
      `<span style="color: ${config.colors.comment}">$1</span>`);
    
    return code;
  },

  // Generic highlighting for other languages
  highlightGeneric(code, config) {
    // Highlight keywords
    if (config.keywords.length > 0) {
      const keywords = config.keywords.join('|');
      code = code.replace(new RegExp(`\\b(${keywords})\\b`, 'g'), 
        `<span style="color: ${config.colors.keyword}">$1</span>`);
    }
    
    // Highlight strings
    code = code.replace(/(['"`])(.*?)\1/g, 
      `<span style="color: ${config.colors.string || '#98c379'}">$1$2$1</span>`);
    
    // Highlight comments (// and /* */ style)
    code = code.replace(/(\/\/.*$)/gm, 
      `<span style="color: ${config.colors.comment || '#5c6370'}">$1</span>`);
    code = code.replace(/(\/\*[\s\S]*?\*\/)/g, 
      `<span style="color: ${config.colors.comment || '#5c6370'}">$1</span>`);
    
    // Highlight # comments
    code = code.replace(/(#.*$)/gm, 
      `<span style="color: ${config.colors.comment || '#5c6370'}">$1</span>`);
    
    return code;
  },

  // Escape HTML entities
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Generate CSS for syntax highlighting
  generateCSS() {
    return `
      <style>
        .syntax-highlighted {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
          background: #282c34;
          color: #abb2bf;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          white-space: pre;
        }
        
        .syntax-highlighted .line-numbers {
          color: #5c6370;
          margin-right: 16px;
          user-select: none;
        }
        
        .language-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #61afef;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
      </style>
    `;
  },

  // Main function to process code blocks
  processCodeBlock(codeElement) {
    const code = codeElement.textContent;
    const language = this.detectLanguage(code);
    const highlightedCode = this.highlight(code, language);
    
    // Add line numbers
    const lines = highlightedCode.split('\n');
    const numberedLines = lines.map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(3, ' ');
      return `<span class="line-numbers">${lineNumber}</span>${line}`;
    }).join('\n');
    
    // Create highlighted container
    const container = document.createElement('div');
    container.className = 'syntax-highlighted';
    container.style.position = 'relative';
    container.innerHTML = numberedLines;
    
    // Add language badge
    const badge = document.createElement('div');
    badge.className = 'language-badge';
    badge.textContent = language;
    container.appendChild(badge);
    
    return container;
  }
};

// Extension initialization
function initializeSyntaxHighlighter() {
  // Add CSS to document
  const style = document.createElement('style');
  style.innerHTML = SyntaxHighlighter.generateCSS();
  document.head.appendChild(style);
  
  // Process existing code blocks
  const codeBlocks = document.querySelectorAll('pre code, code');
  codeBlocks.forEach(block => {
    if (block.textContent.length > 50) { // Only highlight substantial code blocks
      const highlighted = SyntaxHighlighter.processCodeBlock(block);
      block.parentNode.replaceChild(highlighted, block);
    }
  });
  
  // Set up observer for dynamically added code
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const codeBlocks = node.querySelectorAll('pre code, code');
          codeBlocks.forEach(block => {
            if (block.textContent.length > 50) {
              const highlighted = SyntaxHighlighter.processCodeBlock(block);
              block.parentNode.replaceChild(highlighted, block);
            }
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('Universal Syntax Highlighter Extension loaded successfully!');
  console.log(`Supported languages: ${Object.keys(SyntaxHighlighter.languagePatterns).join(', ')}`);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSyntaxHighlighter);
} else {
  initializeSyntaxHighlighter();
}

// Export for manual use
window.SyntaxHighlighter = SyntaxHighlighter;
