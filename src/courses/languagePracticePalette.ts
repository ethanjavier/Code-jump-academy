import type { LearningLanguageId } from '../app/learningTracks'
import type { Localized } from './guidedLessonTypes'

/** One “block” card in practice mode — same role as {@link ../app/constants.BLOCK_OPTIONS} but language-native snippets. */
export type LanguagePalettePiece = {
  id: string
  /** Used for ordering / future tooling only (palette UI shows code only). */
  group: 'output' | 'variables' | 'data'
  label: Localized
  hint: Localized
}

const L = (es: string, en: string): Localized => ({ es, en })

function pieces(...rows: LanguagePalettePiece[]): LanguagePalettePiece[] {
  return rows
}

/** Generic pseudo-blocks when a track has no tailor-made list yet. */
const FALLBACK_GENERIC: LanguagePalettePiece[] = pieces(
  {
    id: 'fb-out',
    group: 'output',
    label: L('print("texto")', 'print("text")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'fb-var',
    group: 'variables',
    label: L('nombre = valor', 'name = value'),
    hint: L('Variable', 'Variable'),
  },
)

const JAVASCRIPT: LanguagePalettePiece[] = pieces(
  {
    id: 'js-log',
    group: 'output',
    label: L('console.log("Hola");', 'console.log("Hello");'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'js-const',
    group: 'variables',
    label: L('const n = 3;', 'const n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const TYPESCRIPT: LanguagePalettePiece[] = pieces(
  {
    id: 'ts-log',
    group: 'output',
    label: L('console.log("Hola");', 'console.log("Hello");'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'ts-const',
    group: 'variables',
    label: L('const n = 3;', 'const n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const PYTHON: LanguagePalettePiece[] = pieces(
  {
    id: 'py-print',
    group: 'output',
    label: L('print("Hola")', 'print("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'py-assign',
    group: 'variables',
    label: L('pasos = 4', 'steps = 4'),
    hint: L('Variable', 'Variable'),
  },
)

const JAVA: LanguagePalettePiece[] = pieces(
  {
    id: 'java-out',
    group: 'output',
    label: L('System.out.println("Hola");', 'System.out.println("Hello");'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'java-var',
    group: 'variables',
    label: L('int n = 3;', 'int n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const CSHARP: LanguagePalettePiece[] = pieces(
  {
    id: 'cs-out',
    group: 'output',
    label: L('Console.WriteLine("Hola");', 'Console.WriteLine("Hello");'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'cs-var',
    group: 'variables',
    label: L('var n = 3;', 'var n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const CPP: LanguagePalettePiece[] = pieces(
  {
    id: 'cpp-out',
    group: 'output',
    label: L('std::cout << "Hola" << std::endl;', 'std::cout << "Hello" << std::endl;'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'cpp-var',
    group: 'variables',
    label: L('int n = 3;', 'int n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const C_LANG: LanguagePalettePiece[] = pieces(
  {
    id: 'c-print',
    group: 'output',
    label: L('printf("Hola\\n");', 'printf("Hello\\n");'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'c-int',
    group: 'variables',
    label: L('int n = 3;', 'int n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const GO: LanguagePalettePiece[] = pieces(
  {
    id: 'go-print',
    group: 'output',
    label: L('fmt.Println("Hola")', 'fmt.Println("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'go-short',
    group: 'variables',
    label: L('n := 3', 'n := 3'),
    hint: L('Variable', 'Variable'),
  },
)

const RUST: LanguagePalettePiece[] = pieces(
  {
    id: 'rs-print',
    group: 'output',
    label: L('println!("Hola");', 'println!("Hello");'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'rs-let',
    group: 'variables',
    label: L('let n = 3;', 'let n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const SWIFT: LanguagePalettePiece[] = pieces(
  {
    id: 'sw-print',
    group: 'output',
    label: L('print("Hola")', 'print("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'sw-let',
    group: 'variables',
    label: L('let n = 3', 'let n = 3'),
    hint: L('Variable', 'Variable'),
  },
)

const KOTLIN: LanguagePalettePiece[] = pieces(
  {
    id: 'kt-print',
    group: 'output',
    label: L('println("Hola")', 'println("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'kt-val',
    group: 'variables',
    label: L('val n = 3', 'val n = 3'),
    hint: L('Variable', 'Variable'),
  },
)

const RUBY: LanguagePalettePiece[] = pieces(
  {
    id: 'rb-puts',
    group: 'output',
    label: L('puts "Hola"', 'puts "Hello"'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'rb-var',
    group: 'variables',
    label: L('n = 3', 'n = 3'),
    hint: L('Variable', 'Variable'),
  },
)

const PHP: LanguagePalettePiece[] = pieces(
  {
    id: 'php-echo',
    group: 'output',
    label: L('echo "Hola";', 'echo "Hello";'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'php-var',
    group: 'variables',
    label: L('$n = 3;', '$n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const SQL: LanguagePalettePiece[] = pieces(
  {
    id: 'sql-select',
    group: 'data',
    label: L('SELECT nombre FROM personas;', 'SELECT name FROM people;'),
    hint: L('Consulta', 'Query'),
  },
  {
    id: 'sql-insert',
    group: 'data',
    label: L('INSERT INTO t (c) VALUES (v);', 'INSERT INTO t (c) VALUES (v);'),
    hint: L('Datos', 'Data'),
  },
)

const HTML_CSS: LanguagePalettePiece[] = pieces(
  {
    id: 'html-div',
    group: 'output',
    label: L('<div class="caja">', '<div class="box">'),
    hint: L('Marca', 'Markup'),
  },
  {
    id: 'html-p',
    group: 'output',
    label: L('<p>Hola</p>', '<p>Hello</p>'),
    hint: L('Marca', 'Markup'),
  },
)

const DART: LanguagePalettePiece[] = pieces(
  {
    id: 'dart-print',
    group: 'output',
    label: L('print("Hola");', 'print("Hello");'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'dart-var',
    group: 'variables',
    label: L('final n = 3;', 'final n = 3;'),
    hint: L('Variable', 'Variable'),
  },
)

const LUA: LanguagePalettePiece[] = pieces(
  {
    id: 'lua-print',
    group: 'output',
    label: L('print("Hola")', 'print("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'lua-local',
    group: 'variables',
    label: L('local n = 3', 'local n = 3'),
    hint: L('Variable', 'Variable'),
  },
)

const SHELL_BASH: LanguagePalettePiece[] = pieces(
  {
    id: 'sh-echo',
    group: 'output',
    label: L('echo "Hola"', 'echo "Hello"'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'sh-var',
    group: 'variables',
    label: L('N=3', 'N=3'),
    hint: L('Variable', 'Variable'),
  },
)

const R_LANG: LanguagePalettePiece[] = pieces(
  {
    id: 'r-print',
    group: 'output',
    label: L('print("Hola")', 'print("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'r-assign',
    group: 'variables',
    label: L('n <- 3', 'n <- 3'),
    hint: L('Variable', 'Variable'),
  },
)

const SCALA: LanguagePalettePiece[] = pieces(
  {
    id: 'sc-print',
    group: 'output',
    label: L('println("Hola")', 'println("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'sc-val',
    group: 'variables',
    label: L('val n = 3', 'val n = 3'),
    hint: L('Variable', 'Variable'),
  },
)

const ELIXIR: LanguagePalettePiece[] = pieces(
  {
    id: 'ex-io',
    group: 'output',
    label: L('IO.puts("Hola")', 'IO.puts("Hello")'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'ex-bind',
    group: 'variables',
    label: L('x = 3', 'x = 3'),
    hint: L('Variable', 'Variable'),
  },
)

const HASKELL: LanguagePalettePiece[] = pieces(
  {
    id: 'hs-print',
    group: 'output',
    label: L('putStrLn "Hola"', 'putStrLn "Hello"'),
    hint: L('Salida', 'Output'),
  },
  {
    id: 'hs-let',
    group: 'variables',
    label: L('let n = 3 in n + 1', 'let n = 3 in n + 1'),
    hint: L('Variable', 'Variable'),
  },
)

const BY_LANG: Partial<Record<LearningLanguageId, LanguagePalettePiece[]>> = {
  javascript: JAVASCRIPT,
  typescript: TYPESCRIPT,
  python: PYTHON,
  java: JAVA,
  csharp: CSHARP,
  cpp: CPP,
  c_lang: C_LANG,
  go: GO,
  rust: RUST,
  swift: SWIFT,
  kotlin: KOTLIN,
  ruby: RUBY,
  php: PHP,
  sql: SQL,
  html_css: HTML_CSS,
  dart: DART,
  lua: LUA,
  shell_bash: SHELL_BASH,
  r_lang: R_LANG,
  scala: SCALA,
  elixir: ELIXIR,
  haskell: HASKELL,
}

export function getLanguagePracticePalette(lang: LearningLanguageId): LanguagePalettePiece[] {
  return BY_LANG[lang] ?? FALLBACK_GENERIC
}
