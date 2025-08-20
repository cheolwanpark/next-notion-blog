import Prism from "prismjs";

// Core languages loaded immediately (most common ones)
import "prismjs/components/prism-markup-templating.js";
import "prismjs/components/prism-markup.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-typescript.min";
import "prismjs/components/prism-jsx.min";
import "prismjs/components/prism-tsx.min";

// Language groups for dynamic loading
const commonLanguages = [
  'javascript',
  'typescript', 
  'jsx',
  'tsx',
  'bash',
  'json',
  'markup',
  'css',
  'html',
] as const;

const webLanguages = [
  'css',
  'scss', 
  'sass',
  'html',
  'markdown',
  'yaml',
] as const;

const systemLanguages = [
  'c',
  'cpp', 
  'java',
  'python',
  'go',
  'rust',
  'swift',
] as const;

const devOpsLanguages = [
  'docker',
  'yaml',
  'makefile',
  'git',
] as const;

const specializedLanguages = [
  'csharp',
  'objectivec',
  'graphql',
  'sql',
  'wasm',
] as const;

// Cache to prevent loading same language multiple times
const loadedLanguages = new Set<string>(commonLanguages);

// Language loader function with TypeScript compatibility
async function loadLanguage(language: string): Promise<void> {
  if (loadedLanguages.has(language)) {
    return;
  }

  try {
    // Dynamic import based on language
    const loadModule = async (modulePath: string) => {
      await import(/* webpackChunkName: "prism-[request]" */ modulePath);
    };

    switch (language) {
      // Web languages
      case 'css':
        await loadModule("prismjs/components/prism-css.js");
        break;
      case 'scss':
        await loadModule("prismjs/components/prism-scss.js");
        break;
      case 'sass':
        await loadModule("prismjs/components/prism-sass.js");
        break;
      case 'markdown':
        await loadModule("prismjs/components/prism-markdown.js");
        break;
      case 'yaml':
        await loadModule("prismjs/components/prism-yaml.js");
        break;
        
      // System languages
      case 'c':
        await loadModule("prismjs/components/prism-c.js");
        break;
      case 'cpp':
        await loadModule("prismjs/components/prism-cpp.js");
        break;
      case 'java':
        await loadModule("prismjs/components/prism-java.js");
        break;
      case 'python':
        await loadModule("prismjs/components/prism-python.js");
        break;
      case 'go':
        await loadModule("prismjs/components/prism-go.js");
        break;
      case 'rust':
        await loadModule("prismjs/components/prism-rust.js");
        break;
      case 'swift':
        await loadModule("prismjs/components/prism-swift.js");
        break;
        
      // DevOps languages
      case 'docker':
        await loadModule("prismjs/components/prism-docker.js");
        break;
      case 'makefile':
        await loadModule("prismjs/components/prism-makefile.js");
        break;
      case 'git':
        await loadModule("prismjs/components/prism-git.js");
        break;
        
      // Specialized languages
      case 'csharp':
        await loadModule("prismjs/components/prism-csharp.js");
        break;
      case 'objectivec':
        await loadModule("prismjs/components/prism-objectivec.js");
        break;
      case 'graphql':
        await loadModule("prismjs/components/prism-graphql.js");
        break;
      case 'sql':
        await loadModule("prismjs/components/prism-sql.js");
        break;
      case 'wasm':
        await loadModule("prismjs/components/prism-wasm.js");
        break;
        
      // Template dependencies
      case 'js-templates':
        await loadModule("prismjs/components/prism-js-templates.js");
        break;
        
      default:
        console.warn(`Unknown language for Prism: ${language}`);
        return;
    }
    
    loadedLanguages.add(language);
  } catch (error) {
    console.error(`Failed to load Prism language: ${language}`, error);
  }
}

// Enhanced highlight function with dynamic loading
export async function highlightCode(code: string, language: string): Promise<string> {
  // Normalize language name
  const normalizedLang = language.toLowerCase().replace(/^language-/, '');
  
  // Load language if needed
  if (!loadedLanguages.has(normalizedLang)) {
    await loadLanguage(normalizedLang);
  }
  
  // Use Prism grammar if available, otherwise fallback to plain text
  const grammar = Prism.languages[normalizedLang];
  if (grammar) {
    return Prism.highlight(code, grammar, normalizedLang);
  } else {
    // Fallback to plain text - just return the code with HTML entities escaped
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// Preload common language groups
export async function preloadLanguageGroup(group: 'web' | 'system' | 'devops' | 'specialized'): Promise<void> {
  let languages: readonly string[];
  
  switch (group) {
    case 'web':
      languages = webLanguages;
      break;
    case 'system':
      languages = systemLanguages;
      break;
    case 'devops':
      languages = devOpsLanguages;
      break;
    case 'specialized':
      languages = specializedLanguages;
      break;
    default:
      return;
  }
  
  await Promise.all(languages.map(lang => loadLanguage(lang)));
}

export { Prism };