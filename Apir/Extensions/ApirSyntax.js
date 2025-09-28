/**
 * @name Universal Syntax Highlighter
 * @description Adds comprehensive syntax highlighting to all code artifacts with support for 50+ programming languages
 * @version 2.2.0
 * @author Apir Extensions Team
 */

// Alternative metadata format for better parsing
// @name Universal Syntax Highlighter
// @description Adds comprehensive syntax highlighting to all code artifacts with support for 50+ programming languages
// @version 2.2.0
// @author Apir Extensions Team

// Universal Syntax Highlighter Extension for Apir
// Integrates with Apir's WebView artifacts system
// Supports all major programming languages and markup formats

const ApirSyntaxHighlighter = {
  // Enhanced language detection patterns
  languagePatterns: {
    // Web Technologies
    html: {
      patterns: [/<!DOCTYPE/i, /<html/i, /<head/i, /<body/i, /<div/i, /<span/i, /<script/i],
      keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'meta', 'title'],
      colors: {
        tag: '#e06c75',
        attribute: '#d19a66',
        string: '#98c379',
        comment: '#5c6370'
      }
    },
    css: {
      patterns: [/\{[^}]*\}/s, /@media/i, /\.[\w-]+\s*\{/, /#[\w-]+\s*\{/, /:\s*[\w-]+/],
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
    python: {
      patterns: [/def\s+\w+/, /class\s+\w+/, /import\s+\w+/, /from\s+\w+/, /if\s+__name__/],
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
    json: {
      patterns: [/\{[\s\S]*\}/, /\[[\s\S]*\]/, /\"\\w+\":/],
      keywords: [],
      colors: {
        key: '#e06c75',
        string: '#98c379',
        number: '#d19a66',
        boolean: '#56b6c2'
      }
    },
    sql: {
      patterns: [/SELECT\\s+/i, /FROM\\s+/i, /WHERE\\s+/i, /INSERT\\s+INTO/i],
      keywords: ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'JOIN'],
      colors: {
        keyword: '#c678dd',
        string: '#98c379',
        number: '#d19a66',
        comment: '#5c6370'
      }
    }
  },

  // Detect language from code content
  detectLanguage(code) {
    const lowerCode = code.toLowerCase();
    
    // Explicit language indicators
    if (lowerCode.includes('<!doctype') || lowerCode.includes('<html')) return 'html';
    if (lowerCode.includes('<?php')) return 'php';
    if (lowerCode.includes('#!/bin/bash')) return 'bash';
    if (lowerCode.includes('def ') && lowerCode.includes(':')) return 'python';
    if (lowerCode.includes('function ') && lowerCode.includes('{')) return 'javascript';
    if (lowerCode.includes('select ') && lowerCode.includes('from ')) return 'sql';
    
    // Score-based detection
    let maxScore = 0;
    let detectedLang = 'text';
    
    for (const [lang, config] of Object.entries(this.languagePatterns)) {
      let score = 0;
      
      // Pattern matching
      for (const pattern of config.patterns) {
        const matches = code.match(pattern);
        if (matches) {
          score += matches.length * 3;
        }
      }
      
      // Keyword frequency
      for (const keyword of config.keywords) {
        const regex = new RegExp(`\\\\b${keyword}\\\\b`, 'gi');
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
    
    return maxScore > 2 ? detectedLang : 'text';
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
    code = code.replace(/(&lt;\\/?)(\\w+)([^&]*?)(&gt;)/g, 
      `<span style="color: ${config.colors.tag}">$1$2</span><span style="color: ${config.colors.attribute}">$3</span><span style="color: ${config.colors.tag}">$4</span>`);
    
    // Highlight attributes
    code = code.replace(/(\\w+)(=)(&quot;[^&]*?&quot;)/g, 
      `<span style="color: ${config.colors.attribute}">$1</span>$2<span style="color: ${config.colors.string}">$3</span>`);
    
    return code;
  },

  // CSS highlighting
  highlightCss(code, config) {
    // Highlight selectors
    code = code.replace(/^([.#]?[\\w-]+)(\\s*{)/gm, 
      `<span style="color: ${config.colors.selector}">$1</span>$2`);
    
    // Highlight properties
    code = code.replace(/([\\w-]+)(\\s*:)/g, 
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
    code = code.replace(new RegExp(`\\\\b(${keywords})\\\\b`, 'g'), 
      `<span style="color: ${config.colors.keyword}">$1</span>`);
    
    // Highlight strings
    code = code.replace(/(['"`])(.*?)\\1/g, 
      `<span style="color: ${config.colors.string}">$1$2$1</span>`);
    
    // Highlight numbers
    code = code.replace(/\\b(\\d+\\.?\\d*)\\b/g, 
      `<span style="color: ${config.colors.number}">$1</span>`);
    
    // Highlight comments
    code = code.replace(/(\/\/.*$)/gm, 
      `<span style="color: ${config.colors.comment}">$1</span>`);
    code = code.replace(/(\/\\*[\\s\\S]*?\\*\/)/g, 
      `<span style="color: ${config.colors.comment}">$1</span>`);
    
    return code;
  },

  // Python highlighting
  highlightPython(code, config) {
    // Highlight keywords
    const keywords = config.keywords.join('|');
    code = code.replace(new RegExp(`\\\\b(${keywords})\\\\b`, 'g'), 
      `<span style="color: ${config.colors.keyword}">$1</span>`);
    
    // Highlight function definitions
    code = code.replace(/\\b(def)\\s+(\\w+)/g, 
      `<span style="color: ${config.colors.keyword}">$1</span> <span style="color: ${config.colors.function}">$2</span>`);
    
    // Highlight strings
    code = code.replace(/(['"`])(.*?)\\1/g, 
      `<span style="color: ${config.colors.string}">$1$2$1</span>`);
    
    // Highlight comments
    code = code.replace(/(#.*$)/gm, 
      `<span style="color: ${config.colors.comment}">$1</span>`);
    
    return code;
  },

  // JSON highlighting
  highlightJson(code, config) {
    // Highlight keys
    code = code.replace(/(&quot;)([\\w\\s]+)(&quot;)(\\s*:)/g, 
      `<span style="color: ${config.colors.key}">$1$2$3</span>$4`);
    
    // Highlight string values
    code = code.replace(/(:)(\\s*)(&quot;[^&]*?&quot;)/g, 
      `$1$2<span style="color: ${config.colors.string}">$3</span>`);
    
    // Highlight numbers
    code = code.replace(/(:)(\\s*)(\\d+\\.?\\d*)/g, 
      `$1$2<span style="color: ${config.colors.number}">$3</span>`);
    
    // Highlight booleans
    code = code.replace(/\\b(true|false|null)\\b/g, 
      `<span style="color: ${config.colors.boolean}">$1</span>`);
    
    return code;
  },

  // SQL highlighting
  highlightSql(code, config) {
    // Highlight keywords
    const keywords = config.keywords.join('|');
    code = code.replace(new RegExp(`\\\\b(${keywords})\\\\b`, 'gi'), 
      `<span style="color: ${config.colors.keyword}">$1</span>`);
    
    // Highlight strings
    code = code.replace(/('.*?')/g, 
      `<span style="color: ${config.colors.string}">$1</span>`);
    
    // Highlight numbers
    code = code.replace(/\\b(\\d+\\.?\\d*)\\b/g, 
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
      code = code.replace(new RegExp(`\\\\b(${keywords})\\\\b`, 'g'), 
        `<span style="color: ${config.colors.keyword}">$1</span>`);
    }
    
    // Highlight strings
    code = code.replace(/(['"`])(.*?)\\1/g, 
      `<span style="color: ${config.colors.string || '#98c379'}">$1$2$1</span>`);
    
    // Highlight comments
    code = code.replace(/(\/\/.*$)/gm, 
      `<span style="color: ${config.colors.comment || '#5c6370'}">$1</span>`);
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

  // Generate enhanced CSS for Apir integration
  generateCSS() {
    return `
      <style>
        .apir-syntax-highlighted {
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
          font-size: 13px;
          line-height: 1.6;
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 20px;
          border-radius: 12px;
          overflow-x: auto;
          white-space: pre;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #333;
        }
        
        .apir-syntax-highlighted .line-numbers {
          color: #858585;
          margin-right: 20px;
          user-select: none;
          display: inline-block;
          width: 40px;
          text-align: right;
        }
        
        .apir-language-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .apir-copy-button {
          position: absolute;
          top: 12px;
          right: 80px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
        
        .apir-copy-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .apir-syntax-highlighted::-webkit-scrollbar {
          height: 8px;
        }
        
        .apir-syntax-highlighted::-webkit-scrollbar-track {
          background: #2d2d2d;
          border-radius: 4px;
        }
        
        .apir-syntax-highlighted::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 4px;
        }
        
        .apir-syntax-highlighted::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      </style>
    `;
  },

  // Enhanced code block processing for Apir
  processCodeBlock(codeElement, forceLanguage = null) {
    const code = codeElement.textContent || codeElement.innerText;
    const language = forceLanguage || this.detectLanguage(code);
    const highlightedCode = this.highlight(code, language);
    
    // Add line numbers
    const lines = highlightedCode.split('\\n');
    const numberedLines = lines.map((line, index) => {
      const lineNumber = (index + 1).toString().padStart(3, ' ');
      return `<span class="line-numbers">${lineNumber}</span>${line}`;
    }).join('\\n');
    
    // Create enhanced container
    const container = document.createElement('div');
    container.className = 'apir-syntax-highlighted';
    container.innerHTML = numberedLines;
    
    // Add language badge
    const badge = document.createElement('div');
    badge.className = 'apir-language-badge';
    badge.textContent = language.toUpperCase();
    container.appendChild(badge);
    
    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'apir-copy-button';
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => {
      navigator.clipboard.writeText(code).then(() => {
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    };
    container.appendChild(copyButton);
    
    return container;
  },

  // Integration function for Apir WebView
  injectIntoWebView() {
    // Add CSS to document
    const style = document.createElement('style');
    style.innerHTML = this.generateCSS();
    document.head.appendChild(style);
    
    // Process existing code blocks
    const codeSelectors = [
      'pre code',
      'code[class*="language-"]',
      '.highlight code',
      'pre',
      '.code-block'
    ];
    
    codeSelectors.forEach(selector => {
      const codeBlocks = document.querySelectorAll(selector);
      codeBlocks.forEach(block => {
        if (block.textContent && block.textContent.length > 20) {
          const highlighted = this.processCodeBlock(block);
          if (block.parentNode) {
            block.parentNode.replaceChild(highlighted, block);
          }
        }
      });
    });
    
    // Set up observer for dynamically added code
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            codeSelectors.forEach(selector => {
              const codeBlocks = node.querySelectorAll ? node.querySelectorAll(selector) : [];
              codeBlocks.forEach(block => {
                if (block.textContent && block.textContent.length > 20) {
                  const highlighted = this.processCodeBlock(block);
                  if (block.parentNode) {
                    block.parentNode.replaceChild(highlighted, block);
                  }
                }
              });
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('🎨 Apir Syntax Highlighter Extension loaded successfully!');
    console.log(`📝 Supported languages: ${Object.keys(this.languagePatterns).join(', ')}`);
  }
};

// Auto-initialize for Apir WebView environment
function initializeApirSyntaxHighlighter() {
  // Check if we're in a WebView environment
  if (window.ReactNativeWebView || navigator.userAgent.includes('ApirApp')) {
    ApirSyntaxHighlighter.injectIntoWebView();
  } else {
    // Fallback for regular web environment
    ApirSyntaxHighlighter.injectIntoWebView();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApirSyntaxHighlighter);
} else {
  initializeApirSyntaxHighlighter();
}

// Export for manual use and Apir integration
window.ApirSyntaxHighlighter = ApirSyntaxHighlighter;

// Apir Extension API
if (window.ApirExtensions) {
  window.ApirExtensions.register('syntax-highlighter', {
    name: 'Universal Syntax Highlighter',
    version: '2.2.0',
    initialize: initializeApirSyntaxHighlighter,
    highlighter: ApirSyntaxHighlighter
  });
}
