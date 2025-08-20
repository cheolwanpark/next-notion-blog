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
    switch (language) {
      // Web languages
      case 'css':
        await import(/* webpackChunkName: "prism-css" */ "prismjs/components/prism-css.js");
        break;
      case 'scss':
        await import(/* webpackChunkName: "prism-scss" */ "prismjs/components/prism-scss.js");
        break;
      case 'sass':
        await import(/* webpackChunkName: "prism-sass" */ "prismjs/components/prism-sass.js");
        break;
      case 'markdown':
        await import(/* webpackChunkName: "prism-markdown" */ "prismjs/components/prism-markdown.js");
        break;
      case 'yaml':
        await import(/* webpackChunkName: "prism-yaml" */ "prismjs/components/prism-yaml.js");
        break;
        
      // System languages
      case 'c':
        await import(/* webpackChunkName: "prism-c" */ "prismjs/components/prism-c.js");
        break;
      case 'cpp':
        await import(/* webpackChunkName: "prism-cpp" */ "prismjs/components/prism-cpp.js");
        break;
      case 'java':
        await import(/* webpackChunkName: "prism-java" */ "prismjs/components/prism-java.js");
        break;
      case 'python':
        await import(/* webpackChunkName: "prism-python" */ "prismjs/components/prism-python.js");
        break;
      case 'go':
        await import(/* webpackChunkName: "prism-go" */ "prismjs/components/prism-go.js");
        break;
      case 'rust':
        await import(/* webpackChunkName: "prism-rust" */ "prismjs/components/prism-rust.js");
        break;
      case 'swift':
        await import(/* webpackChunkName: "prism-swift" */ "prismjs/components/prism-swift.js");
        break;
        
      // DevOps languages
      case 'docker':
        await import(/* webpackChunkName: "prism-docker" */ "prismjs/components/prism-docker.js");
        break;
      case 'makefile':
        await import(/* webpackChunkName: "prism-makefile" */ "prismjs/components/prism-makefile.js");
        break;
      case 'git':
        await import(/* webpackChunkName: "prism-git" */ "prismjs/components/prism-git.js");
        break;
        
      // Specialized languages
      case 'csharp':
        await import(/* webpackChunkName: "prism-csharp" */ "prismjs/components/prism-csharp.js");
        break;
      case 'objectivec':
        await import(/* webpackChunkName: "prism-objectivec" */ "prismjs/components/prism-objectivec.js");
        break;
      case 'graphql':
        await import(/* webpackChunkName: "prism-graphql" */ "prismjs/components/prism-graphql.js");
        break;
      case 'sql':
        await import(/* webpackChunkName: "prism-sql" */ "prismjs/components/prism-sql.js");
        break;
      case 'wasm':
        await import(/* webpackChunkName: "prism-wasm" */ "prismjs/components/prism-wasm.js");
        break;
        
      // Template dependencies
      case 'js-templates':
        await import(/* webpackChunkName: "prism-js-templates" */ "prismjs/components/prism-js-templates.js");
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