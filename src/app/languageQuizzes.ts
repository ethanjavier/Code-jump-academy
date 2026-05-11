import type { Locale } from '../i18n/messages'

import type { LearningLanguageId } from './learningTracks'

export type Localized = { en: string; es: string }

export type QuizQuestion = {
  prompt: Localized
  options: [Localized, Localized, Localized, Localized]
  correctIndex: 0 | 1 | 2 | 3
  explain: Localized
}

export type QuizDeck = QuizQuestion[]

/** Three quick checks per track; copy is distinct per language. */
export const LANGUAGE_QUIZZES: Partial<Record<LearningLanguageId, QuizDeck>> = {
  javascript: [
    {
      prompt: {
        en: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
        es: '¿Qué palabra clave declara una variable de ámbito de bloque que no se puede reasignar?',
      },
      options: [
        { en: 'var', es: 'var' },
        { en: 'const', es: 'const' },
        { en: 'static', es: 'static' },
        { en: 'define', es: 'define' },
      ],
      correctIndex: 1,
      explain: {
        en: '`const` is for bindings that do not get reassigned; `let` is the usual mutable block-scoped sibling.',
        es: '`const` fija un enlace que no se reasigna; `let` suele ser la opción mutable con ámbito de bloque.',
      },
    },
    {
      prompt: {
        en: 'What does `===` compare in JavaScript?',
        es: '¿Qué compara `===` en JavaScript?',
      },
      options: [
        { en: 'Only truthiness', es: 'Solo valores “truthy”' },
        { en: 'Value and type', es: 'Valor y tipo' },
        { en: 'Only references', es: 'Solo referencias' },
        { en: 'Only strings', es: 'Solo cadenas' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Strict equality checks both type and value, unlike `==` which can coerce types.',
        es: 'La igualdad estricta comprueba tipo y valor; `==` puede forzar conversiones.',
      },
    },
    {
      prompt: {
        en: 'Which runtime traditionally executes JS in the browser?',
        es: '¿Qué motor ejecuta tradicionalmente JS en el navegador?',
      },
      options: [
        { en: 'JVM', es: 'JVM' },
        { en: 'CPython', es: 'CPython' },
        { en: 'V8 / SpiderMonkey / JavaScriptCore (engine)', es: 'V8 / SpiderMonkey / JavaScriptCore (motor)' },
        { en: 'LLVM only', es: 'Solo LLVM' },
      ],
      correctIndex: 2,
      explain: {
        en: 'Browsers ship a JavaScript engine (Chrome uses V8, Safari JSCore, Firefox SpiderMonkey).',
        es: 'Los navegadores incluyen un motor JS (p. ej. V8 en Chrome, JSC en Safari, SpiderMonkey en Firefox).',
      },
    },
  ],

  typescript: [
    {
      prompt: {
        en: 'What does TypeScript compile to?',
        es: '¿A qué compila TypeScript?',
      },
      options: [
        { en: 'Bytecode for JVM', es: 'Bytecode para la JVM' },
        { en: 'JavaScript', es: 'JavaScript' },
        { en: 'Native machine code only', es: 'Solo código máquina nativo' },
        { en: 'Python', es: 'Python' },
      ],
      correctIndex: 1,
      explain: {
        en: 'The `tsc` compiler emits JavaScript (ES targets you configure).',
        es: 'El compilador `tsc` emite JavaScript (según el objetivo ES que configures).',
      },
    },
    {
      prompt: {
        en: 'What is a common way to describe “optional” object fields in TypeScript?',
        es: '¿Cómo se marcan con frecuencia campos opcionales en objetos en TypeScript?',
      },
      options: [
        { en: 'Using `?` on the property', es: 'Con `?` en la propiedad' },
        { en: 'Using `#` on the property', es: 'Con `#` en la propiedad' },
        { en: 'Using `optional` keyword always', es: 'Siempre con la palabra `optional`' },
        { en: 'Using only JSDoc', es: 'Solo con JSDoc' },
      ],
      correctIndex: 0,
      explain: {
        en: 'Optional properties are often written as `name?: string`.',
        es: 'Las propiedades opcionales suelen escribirse como `nombre?: string`.',
      },
    },
    {
      prompt: {
        en: 'Interfaces vs types: which statement is most accurate?',
        es: 'Interfaces frente a types: ¿qué afirmación es más acertada?',
      },
      options: [
        {
          en: 'They are identical in every scenario',
          es: 'Son idénticos en todos los casos',
        },
        {
          en: 'Both can model object shapes; unions/intersections differ slightly in ergonomics',
          es: 'Ambos modelan formas de objeto; uniones/intersecciones difieren algo en ergonomía',
        },
        { en: 'TypeScript has no interfaces', es: 'TypeScript no tiene interfaces' },
        { en: 'Types cannot alias primitives', es: 'Los types no pueden alias de primitivos' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Interfaces and type aliases overlap for objects; unions and mapped types often lean on `type`.',
        es: 'Interfaces y `type` se solapan en objetos; uniones y tipos mapeados suelen usar `type`.',
      },
    },
  ],

  python: [
    {
      prompt: {
        en: 'Which keyword defines a function in Python?',
        es: '¿Qué palabra clave define una función en Python?',
      },
      options: [
        { en: 'function', es: 'function' },
        { en: 'def', es: 'def' },
        { en: 'fn', es: 'fn' },
        { en: 'func', es: 'func' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Python uses `def name(args):` with indentation for the body.',
        es: 'Python usa `def nombre(args):` y sangría para el cuerpo.',
      },
    },
    {
      prompt: {
        en: 'What is a list comprehension primarily used for?',
        es: '¿Para qué sirve principalmente una list comprehension?',
      },
      options: [
        { en: 'Declarative SQL only', es: 'Solo SQL declarativo' },
        { en: 'Building lists from iterables with filters/maps', es: 'Construir listas desde iterables con filtros/mapas' },
        { en: 'Static typing', es: 'Tipado estático' },
        { en: 'Binary IO only', es: 'Solo E/S binaria' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Comprehensions are an expressive way to transform sequences: `[x*2 for x in nums if x>0]`.',
        es: 'Las comprehensions transforman secuencias de forma expresiva: `[x*2 for x in nums if x>0]`.',
      },
    },
    {
      prompt: {
        en: 'Which tool is the standard package installer for Python?',
        es: '¿Qué herramienta es el instalador de paquetes estándar en Python?',
      },
      options: [
        { en: 'npm', es: 'npm' },
        { en: 'pip', es: 'pip' },
        { en: 'cargo', es: 'cargo' },
        { en: 'gem', es: 'gem' },
      ],
      correctIndex: 1,
      explain: {
        en: '`pip` installs from PyPI; modern workflows often pair it with virtual environments.',
        es: '`pip` instala desde PyPI; lo habitual son entornos virtuales.',
      },
    },
  ],

  java: [
    {
      prompt: {
        en: 'Which keyword inherits from a class in Java?',
        es: '¿Qué palabra clave hereda de una clase en Java?',
      },
      options: [
        { en: 'extends', es: 'extends' },
        { en: 'inherits', es: 'inherits' },
        { en: 'derive', es: 'derive' },
        { en: 'superclass', es: 'superclass' },
      ],
      correctIndex: 0,
      explain: {
        en: '`class Child extends Parent` establishes inheritance.',
        es: '`class Hijo extends Padre` establece la herencia.',
      },
    },
    {
      prompt: {
        en: 'Where does Java bytecode typically run?',
        es: '¿Dónde suele ejecutarse el bytecode de Java?',
      },
      options: [
        { en: 'Java Virtual Machine (JVM)', es: 'Máquina virtual Java (JVM)' },
        { en: 'Only inside GPUs', es: 'Solo en GPU' },
        { en: 'Directly as OS syscalls only', es: 'Directamente solo como llamadas al SO' },
        { en: 'Python interpreter', es: 'Intérprete de Python' },
      ],
      correctIndex: 0,
      explain: {
        en: 'The JVM executes `.class` bytecode; JIT compilers optimize hot paths.',
        es: 'La JVM ejecuta bytecode `.class`; el JIT optimiza zonas calientes.',
      },
    },
    {
      prompt: {
        en: 'Which access modifier limits visibility to the same package (unless subclass rules apply)?',
        es: '¿Qué modificador limita la visibilidad al mismo paquete (salvo reglas de subclase)?',
      },
      options: [
        { en: 'private', es: 'private' },
        { en: 'protected', es: 'protected' },
        { en: 'package-private (no modifier)', es: 'package-private (sin modificador)' },
        { en: 'global', es: 'global' },
      ],
      correctIndex: 2,
      explain: {
        en: 'Default (package) visibility is when no modifier is written.',
        es: 'La visibilidad por defecto del paquete es sin modificador explícito.',
      },
    },
  ],

  csharp: [
    {
      prompt: {
        en: 'Which runtime executes modern cross-platform .NET apps?',
        es: '¿Qué runtime ejecuta aplicaciones .NET multiplataforma modernas?',
      },
      options: [
        { en: '.NET (Core) runtime', es: 'Runtime de .NET (Core)' },
        { en: 'Flash Player', es: 'Flash Player' },
        { en: 'CPython only', es: 'Solo CPython' },
        { en: 'JVM only', es: 'Solo JVM' },
      ],
      correctIndex: 0,
      explain: {
        en: '.NET 5+ uses the unified .NET runtime across Windows, Linux, and macOS.',
        es: '.NET 5+ usa un runtime unificado en Windows, Linux y macOS.',
      },
    },
    {
      prompt: {
        en: 'Which keyword declares a reference type that supports inheritance?',
        es: '¿Qué palabra clave declara un tipo referencia con herencia?',
      },
      options: [
        { en: 'struct', es: 'struct' },
        { en: 'record struct only', es: 'solo record struct' },
        { en: 'class', es: 'class' },
        { en: 'tuple', es: 'tuple' },
      ],
      correctIndex: 2,
      explain: {
        en: '`class` types inherit implementation from base classes in typical OOP style.',
        es: '`class` hereda implementación de clases base en el estilo OOP habitual.',
      },
    },
    {
      prompt: {
        en: 'LINQ is primarily used for…',
        es: 'LINQ se usa sobre todo para…',
      },
      options: [
        { en: 'Low-level GPU shaders', es: 'Shaders de GPU de bajo nivel' },
        { en: 'Declarative queries over collections', es: 'Consultas declarativas sobre colecciones' },
        { en: 'CSS styling', es: 'Estilos CSS' },
        { en: 'Docker builds', es: 'Builds de Docker' },
      ],
      correctIndex: 1,
      explain: {
        en: 'LINQ lets you write SQL-like transformations on enumerables with lazy evaluation.',
        es: 'LINQ permite transformaciones tipo SQL sobre enumerables con evaluación perezosa.',
      },
    },
  ],

  cpp: [
    {
      prompt: {
        en: 'Which header is idiomatic for console output in modern C++?',
        es: '¿Qué cabecera es idiomática para salida por consola en C++ moderno?',
      },
      options: [
        { en: '<iostream>', es: '<iostream>' },
        { en: '<stdio.py>', es: '<stdio.py>' },
        { en: '<canvas>', es: '<canvas>' },
        { en: '<regex.h> only', es: 'solo <regex.h>' },
      ],
      correctIndex: 0,
      explain: {
        en: '`std::cout` lives with `<iostream>`; `<cstdio>` also exists for C-style IO.',
        es: '`std::cout` va con `<iostream>`; también existe `<cstdio>` estilo C.',
      },
    },
    {
      prompt: {
        en: 'What does RAII usually help manage?',
        es: '¿Qué suele gestionar RAII?',
      },
      options: [
        { en: 'Resources tied to object lifetimes', es: 'Recursos ligados a la vida del objeto' },
        { en: 'Only floating-point math', es: 'Solo matemática flotante' },
        { en: 'CSS layouts', es: 'Maquetación CSS' },
        { en: 'DNS records', es: 'Registros DNS' },
      ],
      correctIndex: 0,
      explain: {
        en: 'Constructors acquire resources; destructors release—great for locks and memory.',
        es: 'Los constructores adquieren recursos y los destructores liberan (locks, memoria…).',
      },
    },
    {
      prompt: {
        en: 'Smart pointers like `std::unique_ptr` mainly prevent…',
        es: 'Los punteros inteligentes como `std::unique_ptr` evitan sobre todo…',
      },
      options: [
        { en: 'Compile-time type errors only', es: 'Solo errores de tipos en compilación' },
        { en: 'Manual memory bugs like leaks/double-free', es: 'Fallos manuales de memoria (fugas/doble liberación)' },
        { en: 'Unicode sorting', es: 'Orden Unicode' },
        { en: 'GPU thrashing', es: 'Thrashing de GPU' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Ownership discipline reduces classic pointer mistakes.',
        es: 'La disciplina de propiedad reduce errores clásicos de punteros.',
      },
    },
  ],

  c_lang: [
    {
      prompt: {
        en: 'Which function typically starts a C program?',
        es: '¿Qué función suele iniciar un programa en C?',
      },
      options: [
        { en: 'start()', es: 'start()' },
        { en: 'main()', es: 'main()' },
        { en: 'begin()', es: 'begin()' },
        { en: 'init()', es: 'init()' },
      ],
      correctIndex: 1,
      explain: {
        en: '`int main(void)` or `int main(int argc, char** argv)` is the portable entry.',
        es: '`int main(void)` o `int main(int argc, char** argv)` es la entrada portable.',
      },
    },
    {
      prompt: {
        en: 'What does `malloc` return?',
        es: '¿Qué devuelve `malloc`?',
      },
      options: [
        { en: 'A stack frame pointer', es: 'Un puntero de marco de pila' },
        { en: 'Heap memory or NULL', es: 'Memoria en montículo o NULL' },
        { en: 'A Java object', es: 'Un objeto Java' },
        { en: 'A Python dict', es: 'Un dict de Python' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Dynamic allocation lives on the heap; always pair with `free` when appropriate.',
        es: 'La asignación dinámica va al montículo; hay que liberar con `free` cuando toque.',
      },
    },
    {
      prompt: {
        en: 'Which header declares `printf`?',
        es: '¿Qué cabecera declara `printf`?',
      },
      options: [
        { en: '<stdio.h>', es: '<stdio.h>' },
        { en: '<iostream>', es: '<iostream>' },
        { en: '<rust.h>', es: '<rust.h>' },
        { en: '<gui.h>', es: '<gui.h>' },
      ],
      correctIndex: 0,
      explain: {
        en: 'Standard IO lives in `<stdio.h>` in C.',
        es: 'La E/S estándar en C está en `<stdio.h>`.',
      },
    },
  ],

  go: [
    {
      prompt: {
        en: 'What keyword starts a goroutine?',
        es: '¿Qué palabra clave arranca una goroutine?',
      },
      options: [
        { en: 'spawn', es: 'spawn' },
        { en: 'go', es: 'go' },
        { en: 'async', es: 'async' },
        { en: 'fork', es: 'fork' },
      ],
      correctIndex: 1,
      explain: {
        en: '`go fn()` launches a goroutine—lightweight concurrency.',
        es: '`go fn()` lanza una goroutine: concurrencia ligera.',
      },
    },
    {
      prompt: {
        en: 'Channels are primarily used to…',
        es: 'Los canales sirven sobre todo para…',
      },
      options: [
        { en: 'Paint pixels', es: 'Pintar píxeles' },
        { en: 'Communicate between goroutines', es: 'Comunicar goroutines entre sí' },
        { en: 'Compile templates', es: 'Compilar plantillas' },
        { en: 'Parse CSS', es: 'Analizar CSS' },
      ],
      correctIndex: 1,
      explain: {
        en: '`chan T` carries typed messages; remember synchronization semantics.',
        es: '`chan T` transporta mensajes tipados; atiende a la sincronización.',
      },
    },
    {
      prompt: {
        en: 'How are exported (public) identifiers spelled in Go?',
        es: '¿Cómo se escriben los identificadores exportados (públicos) en Go?',
      },
      options: [
        { en: 'ALL CAPS', es: 'TODO MAYÚSCULAS' },
        { en: 'Leading uppercase letter', es: 'Primera letra en mayúscula' },
        { en: 'Leading @ symbol', es: 'Símbolo @ inicial' },
        { en: 'Trailing _pub', es: '_pub al final' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Capitalized names are exported from a package; lowercase stays internal.',
        es: 'Nombre en mayúscula inicial exporta; minúscula queda interno al paquete.',
      },
    },
  ],

  rust: [
    {
      prompt: {
        en: 'What does the borrow checker enforce?',
        es: '¿Qué impone el borrow checker?',
      },
      options: [
        { en: 'CSS specificity rules', es: 'Reglas de especificidad CSS' },
        {
          en: 'Memory safety rules for references vs mutation',
          es: 'Reglas de seguridad de memoria para referencias frente a mutación',
        },
        { en: 'Java classpath ordering', es: 'Orden del classpath de Java' },
        { en: 'SQL isolation levels only', es: 'Solo niveles de aislamiento SQL' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Rust prevents data races at compile time via ownership and lifetimes.',
        es: 'Rust evita condiciones de carrera en compilación con propiedad y tiempos de vida.',
      },
    },
    {
      prompt: {
        en: 'Which macro prints debug formatting with line info?',
        es: '¿Qué macro imprime depuración con información de línea?',
      },
      options: [
        { en: 'println!', es: 'println!' },
        { en: 'dbg!', es: 'dbg!' },
        { en: 'log!', es: 'log!' },
        { en: 'trace!', es: 'trace!' },
      ],
      correctIndex: 1,
      explain: {
        en: '`dbg!(expr)` wraps expressions for quick inspection during development.',
        es: '`dbg!(expr)` envuelve expresiones para inspección rápida al desarrollar.',
      },
    },
    {
      prompt: {
        en: '`Option<T>` mainly models…',
        es: '`Option<T>` modela sobre todo…',
      },
      options: [
        { en: 'Optional CSS classes', es: 'Clases CSS opcionales' },
        { en: 'A value that may be absent', es: 'Un valor que puede faltar' },
        { en: 'Parallel GPU queues', es: 'Colas paralelas en GPU' },
        { en: 'HTTP cookies only', es: 'Solo cookies HTTP' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Rust replaces null with `Some`/`None` for safer APIs.',
        es: 'Rust sustituye null por `Some`/`None` para APIs más seguras.',
      },
    },
  ],

  swift: [
    {
      prompt: {
        en: 'Which keyword declares a constant in Swift?',
        es: '¿Qué palabra clave declara una constante en Swift?',
      },
      options: [
        { en: 'const', es: 'const' },
        { en: 'let', es: 'let' },
        { en: 'val', es: 'val' },
        { en: 'final', es: 'final' },
      ],
      correctIndex: 1,
      explain: {
        en: '`let` is immutable; `var` is mutable.',
        es: '`let` es inmutable; `var` es mutable.',
      },
    },
    {
      prompt: {
        en: 'Optionals in Swift represent values that…',
        es: 'Los opcionales en Swift representan valores que…',
      },
      options: [
        { en: 'Are always non-nil', es: 'Siempre no son nil' },
        { en: 'May be missing', es: 'Pueden faltar' },
        { en: 'Must be integers', es: 'Deben ser enteros' },
        { en: 'Cannot be compared', es: 'No se pueden comparar' },
      ],
      correctIndex: 1,
      explain: {
        en: '`String?` forces you to unwrap safely.',
        es: '`String?` obliga a desenvolver con seguridad.',
      },
    },
    {
      prompt: {
        en: 'Swift primarily targets which Apple frameworks ecosystem?',
        es: 'Swift apunta sobre todo a qué ecosistema de frameworks de Apple?',
      },
      options: [
        { en: 'Win32 only', es: 'Solo Win32' },
        { en: 'UIKit / SwiftUI on Apple platforms', es: 'UIKit / SwiftUI en plataformas Apple' },
        { en: 'TensorFlow only', es: 'Solo TensorFlow' },
        { en: 'DirectX only', es: 'Solo DirectX' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Swift powers iOS, macOS, watchOS, tvOS apps alongside Apple SDKs.',
        es: 'Swift impulsa apps en iOS, macOS, watchOS y tvOS con los SDK de Apple.',
      },
    },
  ],

  kotlin: [
    {
      prompt: {
        en: 'Kotlin runs on the JVM and also compiles to…',
        es: 'Kotlin corre en la JVM y también compila a…',
      },
      options: [
        { en: 'Only Bash scripts', es: 'Solo scripts Bash' },
        { en: 'JavaScript / Native (multiplatform)', es: 'JavaScript / Nativo (multiplataforma)' },
        { en: 'COBOL bytecode', es: 'Bytecode COBOL' },
        { en: 'Excel macros only', es: 'Solo macros de Excel' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Kotlin Multiplatform shares business logic across Android, iOS, web, and desktop.',
        es: 'Kotlin Multiplatform comparte lógica entre Android, iOS, web y escritorio.',
      },
    },
    {
      prompt: {
        en: 'Which keyword declares a read-only property in a typical Kotlin class?',
        es: '¿Qué palabra clave declara una propiedad de solo lectura típica?',
      },
      options: [
        { en: 'let', es: 'let' },
        { en: 'val', es: 'val' },
        { en: 'const only outside classes', es: 'const solo fuera de clases' },
        { en: 'readonly', es: 'readonly' },
      ],
      correctIndex: 1,
      explain: {
        en: '`val` is immutable reference; `var` is mutable.',
        es: '`val` es referencia inmutable; `var` es mutable.',
      },
    },
    {
      prompt: {
        en: 'Null-safety in Kotlin means references are…',
        es: 'La seguridad frente a null en Kotlin significa que las referencias son…',
      },
      options: [
        { en: 'Always nullable', es: 'Siempre anulables' },
        { en: 'Non-null by default unless marked `?`', es: 'No nulas por defecto salvo `?`' },
        { en: 'Only strings', es: 'Solo cadenas' },
        { en: 'Forbidden', es: 'Prohibidas' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Types split into `T` vs `T?`, pushing null checks to compile time.',
        es: 'Los tipos se dividen en `T` frente a `T?`, llevando comprobaciones a compilación.',
      },
    },
  ],

  ruby: [
    {
      prompt: {
        en: 'Which package manager is standard for Ruby libraries?',
        es: '¿Qué gestor de paquetes es estándar para librerías Ruby?',
      },
      options: [
        { en: 'npm', es: 'npm' },
        { en: 'RubyGems + Bundler', es: 'RubyGems + Bundler' },
        { en: 'pip', es: 'pip' },
        { en: 'cargo', es: 'cargo' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Gems ship libraries; Bundler locks dependency versions for apps.',
        es: 'Las gems distribuyen librerías; Bundler fija versiones en aplicaciones.',
      },
    },
    {
      prompt: {
        en: 'Everything being an object in Ruby includes…',
        es: 'Que “todo sea objeto” en Ruby incluye…',
      },
      options: [
        { en: 'Only GUI widgets', es: 'Solo widgets de interfaz' },
        { en: 'Numbers and booleans too', es: 'También números y booleanos' },
        { en: 'Nothing—Ruby has no objects', es: 'Nada: Ruby no tiene objetos' },
        { en: 'Only strings', es: 'Solo cadenas' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Uniform object model shapes Ruby’s expressive APIs.',
        es: 'El modelo uniforme de objetos da APIs muy expresivas.',
      },
    },
    {
      prompt: {
        en: 'Blocks in Ruby are commonly passed with…',
        es: 'Los bloques en Ruby suelen pasarse con…',
      },
      options: [
        { en: 'Only XML tags', es: 'Solo etiquetas XML' },
        { en: '`do ... end` or `{ ... }`', es: '`do ... end` o `{ ... }`' },
        { en: '`lambda` keyword exclusively', es: 'Exclusivamente la palabra `lambda`' },
        { en: 'Shell pipes only', es: 'Solo tuberías shell' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Iterators accept blocks for DSL-like readability.',
        es: 'Los iteradores aceptan bloques para DSLs legibles.',
      },
    },
  ],

  php: [
    {
      prompt: {
        en: 'Which symbol prefixes variables in PHP?',
        es: '¿Qué símbolo antepone las variables en PHP?',
      },
      options: [
        { en: '@', es: '@' },
        { en: '$', es: '$' },
        { en: '%', es: '%' },
        { en: '&', es: '&' },
      ],
      correctIndex: 1,
      explain: {
        en: '$name is the classic scalar variable syntax.',
        es: '`$nombre` es la sintaxis clásica de variables escalares.',
      },
    },
    {
      prompt: {
        en: 'Composer is mainly used to…',
        es: 'Composer se usa sobre todo para…',
      },
      options: [
        { en: 'Draw vector graphics', es: 'Dibujar gráficos vectoriales' },
        { en: 'Manage PHP dependencies', es: 'Gestionar dependencias PHP' },
        { en: 'Compile Rust crates', es: 'Compilar crates de Rust' },
        { en: 'Authorize OAuth visually', es: 'Autorizar OAuth visualmente' },
      ],
      correctIndex: 1,
      explain: {
        en: '`composer.json` declares packages much like package.json for Node.',
        es: '`composer.json` declara paquetes parecido a package.json en Node.',
      },
    },
    {
      prompt: {
        en: 'PHP traditionally excels at…',
        es: 'PHP destaca tradicionalmente en…',
      },
      options: [
        { en: 'GPU shader authoring', es: 'Escritura de shaders GPU' },
        { en: 'Server-side web requests & HTML rendering', es: 'Peticiones web en servidor y HTML' },
        { en: 'Firmware for microwaves', es: 'Firmware para microondas' },
        { en: 'Blockchain consensus only', es: 'Solo consenso blockchain' },
      ],
      correctIndex: 1,
      explain: {
        en: 'PHP powers tons of CMS and dynamic sites via Apache/nginx + PHP-FPM.',
        es: 'PHP impulsa muchos CMS y sitios dinámicos con Apache/nginx + PHP-FPM.',
      },
    },
  ],

  sql: [
    {
      prompt: {
        en: 'Which statement retrieves rows from a table?',
        es: '¿Qué sentencia obtiene filas de una tabla?',
      },
      options: [
        { en: 'FETCH CSS', es: 'FETCH CSS' },
        { en: 'SELECT', es: 'SELECT' },
        { en: 'RENDER', es: 'RENDER' },
        { en: 'IMPORT JPEG', es: 'IMPORT JPEG' },
      ],
      correctIndex: 1,
      explain: {
        en: '`SELECT ... FROM ... WHERE` is the core read pattern.',
        es: '`SELECT ... FROM ... WHERE` es el patrón básico de lectura.',
      },
    },
    {
      prompt: {
        en: 'Primary keys uniquely identify…',
        es: 'Las claves primarias identifican de forma única…',
      },
      options: [
        { en: 'CSS classes', es: 'Clases CSS' },
        { en: 'Rows in a table', es: 'Filas en una tabla' },
        { en: 'GPU textures', es: 'Texturas GPU' },
        { en: 'DNS TTL values', es: 'Valores TTL de DNS' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Each row should map to one stable key value when modeled that way.',
        es: 'Cada fila debe mapear a un valor estable de clave cuando el modelo lo exige.',
      },
    },
    {
      prompt: {
        en: 'JOIN connects rows based on…',
        es: 'JOIN conecta filas según…',
      },
      options: [
        { en: 'Random hashes', es: 'Hashes aleatorios' },
        { en: 'Related keys / predicates', es: 'Claves relacionadas / predicados' },
        { en: 'Monitor refresh rate', es: 'Tasa de refresco del monitor' },
        { en: 'Git branches only', es: 'Solo ramas git' },
      ],
      correctIndex: 1,
      explain: {
        en: 'INNER/LEFT joins express relational links declaratively.',
        es: 'Los INNER/LEFT joins expresan vínculos relacionales de forma declarativa.',
      },
    },
  ],

  html_css: [
    {
      prompt: {
        en: 'Which tag wraps the main metadata of an HTML document?',
        es: '¿Qué etiqueta envuelve los metadatos principales de un HTML?',
      },
      options: [
        { en: '<body>', es: '<body>' },
        { en: '<head>', es: '<head>' },
        { en: '<canvas>', es: '<canvas>' },
        { en: '<sql>', es: '<sql>' },
      ],
      correctIndex: 1,
      explain: {
        en: '`<head>` hosts `<title>`, `<meta>`, linked CSS, etc.',
        es: '`<head>` contiene `<title>`, `<meta>`, CSS enlazado, etc.',
      },
    },
    {
      prompt: {
        en: 'CSS flexbox mainly helps with…',
        es: 'Flexbox en CSS ayuda sobre todo a…',
      },
      options: [
        { en: 'Database normalization', es: 'Normalizar bases de datos' },
        { en: 'One-dimensional layouts & alignment', es: 'Disposiciones en una dimensión y alineación' },
        { en: 'Writing bash scripts', es: 'Escribir scripts bash' },
        { en: 'Compiling Kotlin', es: 'Compilar Kotlin' },
      ],
      correctIndex: 1,
      explain: {
        en: '`display:flex` distributes space along an axis with powerful alignment props.',
        es: '`display:flex` reparte espacio en un eje con props de alineación potentes.',
      },
    },
    {
      prompt: {
        en: 'Semantic HTML improves…',
        es: 'El HTML semántico mejora…',
      },
      options: [
        { en: 'GPU raster perf only', es: 'Solo rendimiento raster GPU' },
        { en: 'Accessibility & meaning for assistive tech', es: 'Accesibilidad y significado para tecnologías de apoyo' },
        { en: 'Ethernet throughput', es: 'Throughput Ethernet' },
        { en: 'Docker layer caching only', es: 'Solo caché de capas Docker' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Tags like `<article>`, `<nav>` convey structure beyond `<div>` soup.',
        es: 'Etiquetas como `<article>`, `<nav>` dan estructura más allá de un mar de `<div>`.',
      },
    },
  ],

  dart: [
    {
      prompt: {
        en: 'Flutter UIs are primarily built with…',
        es: 'Las UIs de Flutter se construyen sobre todo con…',
      },
      options: [
        { en: 'WinForms only', es: 'Solo WinForms' },
        { en: 'Widgets composing a tree', es: 'Widgets formando un árbol' },
        { en: 'Photoshop layers only', es: 'Solo capas de Photoshop' },
        { en: 'Excel charts', es: 'Gráficos de Excel' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Everything is a widget—layout, styling, and interaction nest recursively.',
        es: 'Todo es un widget: diseño, estilo e interacción se anidan recursivamente.',
      },
    },
    {
      prompt: {
        en: 'Dart uses `async` / `await` for…',
        es: 'Dart usa `async` / `await` para…',
      },
      options: [
        { en: 'CSS animations only', es: 'Solo animaciones CSS' },
        { en: 'Asynchronous Futures and Streams', es: 'Futures y Streams asíncronos' },
        { en: 'malloc/free pairs', es: 'Pares malloc/free' },
        { en: 'COM interfaces', es: 'Interfaces COM' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Futures represent single async values; Streams handle sequences.',
        es: 'Los Futures representan un valor asíncrono; los Streams, secuencias.',
      },
    },
    {
      prompt: {
        en: 'Null safety in Dart soundly separates…',
        es: 'La seguridad de null en Dart separa de forma sólida…',
      },
      options: [
        { en: 'UDP vs TCP only', es: 'Solo UDP frente a TCP' },
        { en: 'Nullable (`T?`) vs non-nullable (`T`) types', es: 'Tipos anulables (`T?`) frente a no anulables (`T`)' },
        { en: 'JPEG vs PNG only', es: 'Solo JPEG frente a PNG' },
        { en: 'Tabs vs spaces only', es: 'Solo tabuladores frente a espacios' },
      ],
      correctIndex: 1,
      explain: {
        en: 'The type system tracks nullability to prevent surprise crashes.',
        es: 'El sistema de tipos rastrea anulabilidad para evitar fallos sorpresa.',
      },
    },
  ],

  lua: [
    {
      prompt: {
        en: 'Lua tables behave like…',
        es: 'Las tablas en Lua se comportan como…',
      },
      options: [
        { en: 'Only fixed SQL schemas', es: 'Solo esquemas SQL fijos' },
        { en: 'Arrays, maps, or objects depending on keys', es: 'Arrays, mapas u objetos según las claves' },
        { en: 'GPU buffers only', es: 'Solo buffers GPU' },
        { en: 'Immutable strings only', es: 'Solo cadenas inmutables' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Tables unify sequences and associative containers.',
        es: 'Las tablas unifican secuencias y mapas asociativos.',
      },
    },
    {
      prompt: {
        en: 'Lua is widely embedded in…',
        es: 'Lua se embebe mucho en…',
      },
      options: [
        { en: 'BIOS chips only', es: 'Solo chips BIOS' },
        { en: 'Game engines & scripting hosts', es: 'Motores de juegos y hosts de scripting' },
        { en: 'Printer firmware only', es: 'Solo firmware de impresoras' },
        { en: 'Kubernetes controllers only', es: 'Solo controladores de Kubernetes' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Lightweight interpreter design makes Lua ideal for embedding.',
        es: 'Un intérprete ligero hace ideal embeber Lua.',
      },
    },
    {
      prompt: {
        en: 'Local variables use the keyword…',
        es: 'Las variables locales usan la palabra clave…',
      },
      options: [
        { en: 'let', es: 'let' },
        { en: 'local', es: 'local' },
        { en: 'var', es: 'var' },
        { en: 'dim', es: 'dim' },
      ],
      correctIndex: 1,
      explain: {
        en: '`local x = 1` scopes to the block—prefer locals by default.',
        es: '`local x = 1` limita el ámbito al bloque; usa `local` por defecto.',
      },
    },
  ],

  shell_bash: [
    {
      prompt: {
        en: 'What does `#!/bin/bash` at the top of a script declare?',
        es: '¿Qué declara `#!/bin/bash` al inicio de un script?',
      },
      options: [
        { en: 'A CSS theme', es: 'Un tema CSS' },
        { en: 'The interpreter that should execute the file', es: 'El intérprete que debe ejecutar el archivo' },
        { en: 'A SQL dialect', es: 'Un dialecto SQL' },
        { en: 'GPU shader language', es: 'Lenguaje de shaders GPU' },
      ],
      correctIndex: 1,
      explain: {
        en: 'The shebang tells the OS which program reads the script.',
        es: 'El shebang indica al SO qué programa lee el script.',
      },
    },
    {
      prompt: {
        en: '`pipefail` helps scripts…',
        es: '`pipefail` ayuda a los scripts a…',
      },
      options: [
        { en: 'Ignore all errors silently', es: 'Ignorar todos los errores en silencio' },
        { en: 'Detect failures inside pipelines', es: 'Detectar fallos dentro de tuberías' },
        { en: 'Compile C++ faster', es: 'Compilar C++ más rápido' },
        { en: 'Encrypt disks automatically', es: 'Cifrar discos automáticamente' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Without `pipefail`, early commands may fail while exit status stays 0.',
        es: 'Sin `pipefail`, comandos tempranos pueden fallar y el estado sigue siendo 0.',
      },
    },
    {
      prompt: {
        en: 'Which expansion outputs command stdout inside another command?',
        es: '¿Qué expansión inserta la salida estándar de un comando en otro?',
      },
      options: [
        { en: '`$(cmd)` / backticks', es: '`$(cmd)` / comillas invertidas' },
        { en: '`#cmd`', es: '`#cmd`' },
        { en: '`@cmd`', es: '`@cmd`' },
        { en: '`%cmd%` only in POSIX', es: '`%cmd%` solo en POSIX' },
      ],
      correctIndex: 0,
      explain: {
        en: 'Command substitution captures output for nesting.',
        es: 'La sustitución de comandos captura salida para anidar.',
      },
    },
  ],

  r_lang: [
    {
      prompt: {
        en: 'Which data structure is central to tabular stats work in R?',
        es: '¿Qué estructura es central para datos tabulares en R?',
      },
      options: [
        { en: 'GPU framebuffer', es: 'Framebuffer GPU' },
        { en: 'data.frame / tibble', es: 'data.frame / tibble' },
        { en: 'BPF map', es: 'Mapa BPF' },
        { en: 'Kafka topic only', es: 'Solo topic Kafka' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Columns can mix types while preserving row alignment.',
        es: 'Las columnas pueden mezclar tipos manteniendo filas alineadas.',
      },
    },
    {
      prompt: {
        en: 'Vectors in R are typically…',
        es: 'Los vectores en R suelen ser…',
      },
      options: [
        { en: 'Always GPU tensors', es: 'Siempre tensores GPU' },
        { en: 'Homogeneous typed sequences', es: 'Secuencias homogéneas tipadas' },
        { en: 'SQL indexes only', es: 'Solo índices SQL' },
        { en: 'Immutable filesystem paths', es: 'Rutas de sistema de ficheros inmutables' },
      ],
      correctIndex: 1,
      explain: {
        en: '`c(1,2,3)` builds numeric vectors; recycling rules apply in ops.',
        es: '`c(1,2,3)` construye vectores numéricos; hay reglas de reciclaje.',
      },
    },
    {
      prompt: {
        en: 'CRAN primarily distributes…',
        es: 'CRAN distribuye principalmente…',
      },
      options: [
        { en: 'Docker images only', es: 'Solo imágenes Docker' },
        { en: 'R packages', es: 'Paquetes de R' },
        { en: 'Unity assets only', es: 'Solo assets de Unity' },
        { en: 'Terraform modules only', es: 'Solo módulos Terraform' },
      ],
      correctIndex: 1,
      explain: {
        en: '`install.packages()` pulls from CRAN mirrors worldwide.',
        es: '`install.packages()` descarga desde réplicas CRAN en todo el mundo.',
      },
    },
  ],

  scala: [
    {
      prompt: {
        en: 'Scala runs on the JVM and emphasizes…',
        es: 'Scala corre en la JVM y enfatiza…',
      },
      options: [
        { en: 'Only markup templating', es: 'Solo plantillas markup' },
        { en: 'Functional + object-oriented fusion', es: 'Fusión funcional y orientada a objetos' },
        { en: 'CPU microcode editing', es: 'Edición de microcódigo CPU' },
        { en: 'Spreadsheet formulas only', es: 'Solo fórmulas de hoja de cálculo' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Immutability, pattern matching, and expressive collections are idiomatic.',
        es: 'Inmutabilidad, coincidencia de patrones y colecciones expresivas son idiomáticas.',
      },
    },
    {
      prompt: {
        en: '`Option[T]` in Scala replaces…',
        es: '`Option[T]` en Scala sustituye…',
      },
      options: [
        { en: 'CSS variables', es: 'Variables CSS' },
        { en: 'Null-pointer ambiguity for optional values', es: 'La ambigüedad de null para valores opcionales' },
        { en: 'UDP sockets', es: 'Sockets UDP' },
        { en: 'Docker volumes', es: 'Volúmenes Docker' },
      ],
      correctIndex: 1,
      explain: {
        en: '`Some`/`None` forces explicit handling.',
        es: '`Some`/`None` fuerza un manejo explícito.',
      },
    },
    {
      prompt: {
        en: 'Case classes automatically provide…',
        es: 'Las case classes proporcionan automáticamente…',
      },
      options: [
        { en: 'GPU tessellation', es: 'Teselación GPU' },
        { en: 'Structural equality & pattern-friendly decomposition', es: 'Igualdad estructural y descomposición útil en patrones' },
        { en: 'Excel macros', es: 'Macros de Excel' },
        { en: 'SSH host keys', es: 'Claves host SSH' },
      ],
      correctIndex: 1,
      explain: {
        en: '`copy` methods and `apply` factories reduce boilerplate.',
        es: 'Métodos `copy` y factorías `apply` reducen repetición.',
      },
    },
  ],

  elixir: [
    {
      prompt: {
        en: 'Elixir runs on the Erlang VM and uses immutable…',
        es: 'Elixir corre en la VM de Erlang y usa datos inmutables…',
      },
      options: [
        { en: 'GPU framebuffers only', es: 'Solo framebuffers GPU' },
        { en: 'Data + lightweight processes', es: 'Datos + procesos ligeros' },
        { en: 'Excel COM objects only', es: 'Solo objetos COM de Excel' },
        { en: 'Docker volumes only', es: 'Solo volúmenes Docker' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Actor-style messaging scales fault-tolerant systems.',
        es: 'La mensajería tipo actor escala sistemas tolerantes a fallos.',
      },
    },
    {
      prompt: {
        en: 'The pipe operator `|>` forwards…',
        es: 'El operador tubería `|>` reenvía…',
      },
      options: [
        { en: 'HTTP cookies only', es: 'Solo cookies HTTP' },
        { en: 'The prior expression as first argument to the next call', es: 'La expresión previa como primer argumento de la siguiente llamada' },
        { en: 'GPU shaders', es: 'Shaders GPU' },
        { en: 'SSH tunnels only', es: 'Solo túneles SSH' },
      ],
      correctIndex: 1,
      explain: {
        en: 'It reads like a pipeline for transformations.',
        es: 'Se lee como una tubería de transformaciones.',
      },
    },
    {
      prompt: {
        en: 'Pattern matching in Elixir helps with…',
        es: 'La coincidencia de patrones en Elixir ayuda a…',
      },
      options: [
        { en: 'Rasterizing fonts only', es: 'Solo rasterizar fuentes' },
        { en: 'Destructuring structured data safely', es: 'Desestructurar datos con seguridad' },
        { en: 'Managing RAID arrays only', es: 'Solo gestionar RAID' },
        { en: 'Printing shipping labels only', es: 'Solo imprimir etiquetas de envío' },
      ],
      correctIndex: 1,
      explain: {
        en: '`case`/`with` shine when shaping control flow.',
        es: '`case`/`with` destacan al moldear el flujo de control.',
      },
    },
  ],

  haskell: [
    {
      prompt: {
        en: 'Pure functions in Haskell mean…',
        es: 'Las funciones puras en Haskell significan…',
      },
      options: [
        { en: 'They always perform IO randomly', es: 'Siempre hacen E/S aleatoria' },
        { en: 'Same inputs yield same outputs without side effects', es: 'Las mismas entradas dan las mismas salidas sin efectos secundarios' },
        { en: 'They must mutate globals', es: 'Deben mutar globales' },
        { en: 'They only run on GPUs', es: 'Solo corren en GPU' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Effects stay explicit via types like `IO`.',
        es: 'Los efectos explícitos van en tipos como `IO`.',
      },
    },
    {
      prompt: {
        en: 'Lazy evaluation evaluates expressions…',
        es: 'La evaluación perezosa calcula las expresiones…',
      },
      options: [
        { en: 'Never', es: 'Nunca' },
        { en: 'Only when their results are needed', es: 'Solo cuando hace falta su resultado' },
        { en: 'Twice always', es: 'Siempre dos veces' },
        { en: 'Only at compile time', es: 'Solo en tiempo de compilación' },
      ],
      correctIndex: 1,
      explain: {
        en: 'Infinite lists are okay because producers stay lazy.',
        es: 'Las listas infinitas funcionan porque los productores son perezosos.',
      },
    },
    {
      prompt: {
        en: 'Type inference helps Haskell programmers…',
        es: 'La inferencia de tipos ayuda a los programadores de Haskell a…',
      },
      options: [
        { en: 'Avoid writing any functions', es: 'Evitar escribir funciones' },
        { en: 'Skip redundant annotations while staying safe', es: 'Omitir anotaciones redundantes manteniendo seguridad' },
        { en: 'Compile Java bytecode', es: 'Compilar bytecode Java' },
        { en: 'Edit PNG pixels faster', es: 'Editar píxeles PNG más rápido' },
      ],
      correctIndex: 1,
      explain: {
        en: 'The compiler nails down polymorphic types automatically when possible.',
        es: 'El compilador fija tipos polimórficos solo cuando puede.',
      },
    },
  ],
}

/** Number of exercise modules offered per programming track (each module ≈ 3 questions). */
export const PRACTICE_MODULE_COUNT = 5

function hashLangId(lang: LearningLanguageId): number {
  let h = 2166136261
  for (let i = 0; i < lang.length; i += 1) {
    h ^= lang.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic subset for a track module (stable between runs for the same lang + module). */
export function quizQuestionsForModule(
  lang: LearningLanguageId,
  moduleIndex: number,
): QuizQuestion[] {
  const full = LANGUAGE_QUIZZES[lang]
  if (!full?.length) return []
  const n = full.length
  const take = Math.min(3, n)
  const indices = Array.from({ length: n }, (_, i) => i)
  let seed = (hashLangId(lang) + moduleIndex * 928371 + n * 17) >>> 0
  for (let i = n - 1; i > 0; i -= 1) {
    seed = (Math.imul(seed, 1103515245) + 12345) >>> 0
    const j = seed % (i + 1)
    ;[indices[i], indices[j]] = [indices[j]!, indices[i]!]
  }
  return indices.slice(0, take).map((i) => full[i]!)
}

export function pickQuizQuestions(deck: QuizDeck): QuizQuestion[] {
  if (deck.length <= 3) return deck
  const pool = [...deck]
  const out: QuizQuestion[] = []
  while (out.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length)
    out.push(pool.splice(i, 1)[0]!)
  }
  return out
}

export function localized(loc: Localized, locale: Locale): string {
  return locale === 'es' ? loc.es : loc.en
}

export function hasQuizFor(id: LearningLanguageId): boolean {
  return id !== 'blocks' && Boolean(LANGUAGE_QUIZZES[id]?.length)
}

export function quizLanguagesForSelection(ids: LearningLanguageId[]): LearningLanguageId[] {
  return ids.filter(hasQuizFor)
}
