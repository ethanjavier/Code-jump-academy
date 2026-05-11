import type { GuidedCourse } from './guidedLessonTypes'

const L = (es: string, en: string) => ({ es, en })

export const JAVA_GUIDED_COURSE: GuidedCourse = {
  languageId: 'java',
  lessons: [
    {
      id: 'java-01',
      title: L('Salida en Java', 'Printing in Java'),
      instruction: L(
        '`System.out.println` muestra texto. El método `main` es donde arranca el programa.',
        '`System.out.println` prints text. The `main` method is where the program starts.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Cuál es la forma habitual de mostrar una línea en la consola en Java?',
          'What is the usual way to print a line to the console in Java?',
        ),
        options: [
          L('printf("Hi")', 'printf("Hi")'),
          L('System.out.println("Hi");', 'System.out.println("Hi");'),
          L('console.log("Hi");', 'console.log("Hi");'),
          L('print Hi', 'print Hi'),
        ],
        correctIndex: 1,
        wrongHint: L(
          'En Java la clase `System` exprime salida estándar con `out.println`.',
          'In Java the `System` class writes to standard output with `out.println`.',
        ),
      },
    },
    {
      id: 'java-02',
      title: L('Variables tipadas', 'Typed variables'),
      instruction: L(
        'Declaras el tipo antes del nombre: `int pasos = 4;` guarda un entero con nombre.',
        'You declare the type before the name: `int steps = 4;` stores an integer.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('int x = 2;', 'int x = 2;'), L('System.out.println(x);', 'System.out.println(x);')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'java-03',
      title: L('if en Java', 'if in Java'),
      instruction: L(
        'Las llaves `{ }` marcan el cuerpo del `if`. La condición va entre paréntesis.',
        'Braces `{ }` mark the `if` body. The condition goes in parentheses.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'orderLines',
        lines: [
          L('    System.out.println("si");', '    System.out.println("yes");'),
          L('if (3 > 1) {', 'if (3 > 1) {'),
          L('}', '}'),
        ],
        correctOrder: [1, 0, 2],
      },
    },
  ],
}

export const CSHARP_GUIDED_COURSE: GuidedCourse = {
  languageId: 'csharp',
  lessons: [
    {
      id: 'cs-01',
      title: L('Consola en C#', 'Console in C#'),
      instruction: L(
        '`Console.WriteLine` imprime una línea en aplicaciones .NET.',
        '`Console.WriteLine` prints one line in .NET apps.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué método imprime una línea en C#?',
          'Which method prints a line in C#?',
        ),
        options: [
          L('System.print()', 'System.print()'),
          L('Console.WriteLine(...)', 'Console.WriteLine(...)'),
          L('puts(...)', 'puts(...)'),
          L('println(...)', 'println(...)'),
        ],
        correctIndex: 1,
        wrongHint: L('La clase estática es `Console`.', 'The static class is `Console`.'),
      },
    },
    {
      id: 'cs-02',
      title: L('var y tipos', 'var and types'),
      instruction: L(
        '`var nombre = 5;` deja que el compilador infiera el tipo.',
        '`var name = 5;` lets the compiler infer the type.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [
          L('var n = 10;', 'var n = 10;'),
          L('Console.WriteLine(n);', 'Console.WriteLine(n);'),
        ],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'cs-03',
      title: L('if', 'if'),
      instruction: L(
        'C# usa `if (condición) { ... }` igual que muchos lenguajes de llaves.',
        'C# uses `if (condition) { ... }` like many brace languages.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Cuál es verdadero sobre `if` en C#?',
          'What is true about `if` in C#?',
        ),
        options: [
          L('No usa paréntesis en la condición', 'The condition needs no parentheses'),
          L('La condición va entre paréntesis', 'The condition goes in parentheses'),
          L('Solo funciona con enteros', 'It only works with integers'),
          L('Termina con endif', 'It ends with endif'),
        ],
        correctIndex: 1,
        wrongHint: L('La sintaxis es `if (a > b) { }`.', 'Syntax is `if (a > b) { }`.'),
      },
    },
  ],
}

export const CPP_GUIDED_COURSE: GuidedCourse = {
  languageId: 'cpp',
  lessons: [
    {
      id: 'cpp-01',
      title: L('iostream', 'iostream'),
      instruction: L(
        '`#include <iostream>` y `std::cout` muestran salida en consola.',
        '`#include <iostream>` and `std::cout` print to the console.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué stream usa C++ para salida típica en consola?',
          'Which stream does C++ use for typical console output?',
        ),
        options: [L('std::cin', 'std::cin'), L('std::cout', 'std::cout'), L('std::err', 'std::err'), L('printf only', 'printf only')],
        correctIndex: 1,
        wrongHint: L('`cout` es “character output”.', '`cout` is character output.'),
      },
    },
    {
      id: 'cpp-02',
      title: L('Variables', 'Variables'),
      instruction: L(
        '`int x = 3;` reserva un entero con nombre.',
        '`int x = 3;` reserves a named integer.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('int a = 1;', 'int a = 1;'), L('std::cout << a;', 'std::cout << a;')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'cpp-03',
      title: L('if', 'if'),
      instruction: L(
        'C++ usa llaves para agrupar el cuerpo del `if`.',
        'C++ uses braces to group the `if` body.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'orderLines',
        lines: [
          L('    std::cout << "ok";', '    std::cout << "ok";'),
          L('if (true) {', 'if (true) {'),
          L('}', '}'),
        ],
        correctOrder: [1, 0, 2],
      },
    },
  ],
}

export const C_LANG_GUIDED_COURSE: GuidedCourse = {
  languageId: 'c_lang',
  lessons: [
    {
      id: 'c-01',
      title: L('printf', 'printf'),
      instruction: L(
        '`#include <stdio.h>` y `printf` formatean salida en C.',
        '`#include <stdio.h>` and `printf` format output in C.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué función imprime texto formateado en C estándar?',
          'Which function prints formatted text in standard C?',
        ),
        options: [L('println', 'println'), L('printf', 'printf'), L('cout', 'cout'), L('Console.Write', 'Console.Write')],
        correctIndex: 1,
        wrongHint: L('Viene de “print formatted”.', 'Short for print formatted.'),
      },
    },
    {
      id: 'c-02',
      title: L('Variables', 'Variables'),
      instruction: L(
        'Declaras tipo y nombre: `int n = 5;`',
        'You declare type then name: `int n = 5;`',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('int k = 2;', 'int k = 2;'), L('printf("%d", k);', 'printf("%d", k);')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'c-03',
      title: L('if', 'if'),
      instruction: L(
        '`if (cond) { ... }` ejecuta el bloque solo si la condición es verdadera.',
        '`if (cond) { ... }` runs the block only when the condition is true.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          'En C, ¿qué valor se considera falso en un `if (x)` clásico?',
          'In classic C `if (x)`, what value is false?',
        ),
        options: [L('1', '1'), L('0', '0'), L('-1', '-1'), L('100', '100')],
        correctIndex: 1,
        wrongHint: L('0 es falso; distinto de 0 es verdadero.', '0 is false; nonzero is true.'),
      },
    },
  ],
}

export const GO_GUIDED_COURSE: GuidedCourse = {
  languageId: 'go',
  lessons: [
    {
      id: 'go-01',
      title: L('fmt.Println', 'fmt.Println'),
      instruction: L(
        'El paquete `fmt` imprime con `Println` y variantes.',
        'The `fmt` package prints with `Println` and friends.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué paquete estándar usa Go habitualmente para imprimir en consola?',
          'Which standard package does Go usually use to print to the console?',
        ),
        options: [L('io', 'io'), L('fmt', 'fmt'), L('os', 'os'), L('log solo', 'log only')],
        correctIndex: 1,
        wrongHint: L('Importas `"fmt"` y llamas `fmt.Println`.', 'Import `"fmt"` and call `fmt.Println`.'),
      },
    },
    {
      id: 'go-02',
      title: L(':=' , ':='),
      instruction: L(
        '`:=` declara e infiere tipo dentro de funciones.',
        '`:=` declares and infers type inside functions.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('x := 7', 'x := 7'), L('fmt.Println(x)', 'fmt.Println(x)')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'go-03',
      title: L('if', 'if'),
      instruction: L(
        'Go puede declarar variables en el `if`: `if v := f(); v > 0 { }`',
        'Go may declare variables in `if`: `if v := f(); v > 0 { }`',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Necesita `if` paréntesis alrededor de la condición en Go?',
          'Does `if` need parentheses around the condition in Go?',
        ),
        options: [
          L('Sí, siempre', 'Yes, always'),
          L('No, no uses paréntesis alrededor de la condición', 'No, no parentheses around the condition'),
          L('Solo en bucles', 'Only in loops'),
          L('Opcional', 'Optional'),
        ],
        correctIndex: 1,
        wrongHint: L('La condición va sin paréntesis envolventes.', 'The condition has no wrapping parentheses.'),
      },
    },
  ],
}

export const RUST_GUIDED_COURSE: GuidedCourse = {
  languageId: 'rust',
  lessons: [
    {
      id: 'rust-01',
      title: L('println!', 'println!'),
      instruction: L(
        '`println!` es una macro que imprime con salto de línea.',
        '`println!` is a macro that prints with a newline.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Por qué `println!` termina en `!` en Rust?',
          'Why does `println!` end with `!` in Rust?',
        ),
        options: [
          L('Es un comentario', 'It is a comment'),
          L('Es una macro, no una función normal', 'It is a macro, not a normal function'),
          L('Indica async', 'Marks async'),
          L('Error de sintaxis', 'Syntax error'),
        ],
        correctIndex: 1,
        wrongHint: L('Las macros se expanden en tiempo de compilación.', 'Macros expand at compile time.'),
      },
    },
    {
      id: 'rust-02',
      title: L('let', 'let'),
      instruction: L(
        '`let x = 3;` crea un enlace inmutable por defecto; `mut` permite cambiar.',
        '`let x = 3;` binds immutably by default; `mut` allows change.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('let n = 4;', 'let n = 4;'), L('println!("{}", n);', 'println!("{}", n);')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'rust-03',
      title: L('if como expresión', 'if as expression'),
      instruction: L(
        '`if` puede devolver un valor sin `ternario` separado.',
        '`if` can return a value without a separate ternary.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Las ramas de `if` y `else` deben devolver el mismo tipo en Rust?',
          'Must `if` and `else` branches return the same type in Rust?',
        ),
        options: [
          L('No importa', 'Does not matter'),
          L('Sí, el tipo debe coincidir', 'Yes, types must match'),
          L('Solo para enteros', 'Only for integers'),
          L('Nunca', 'Never'),
        ],
        correctIndex: 1,
        wrongHint: L('Rust infiere un único tipo para toda la expresión `if`.', 'Rust infers one type for the whole `if` expression.'),
      },
    },
  ],
}

export const SWIFT_GUIDED_COURSE: GuidedCourse = {
  languageId: 'swift',
  lessons: [
    {
      id: 'swift-01',
      title: L('print', 'print'),
      instruction: L(
        '`print(...)` muestra valores en la salida estándar.',
        '`print(...)` writes values to standard output.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué función usa Swift habitualmente para imprimir en consola de texto?',
          'What does Swift usually use to print to a text console?',
        ),
        options: [L('println (Java style)', 'println (Java style)'), L('print(...)', 'print(...)'), L('printf solo', 'printf only'), L('cout', 'cout')],
        correctIndex: 1,
        wrongHint: L('Es la función global `print`.', 'It is the global `print` function.'),
      },
    },
    {
      id: 'swift-02',
      title: L('let y var', 'let and var'),
      instruction: L(
        '`let` es constante; `var` permite reasignar.',
        '`let` is constant; `var` allows reassignment.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('let a = 5', 'let a = 5'), L('print(a)', 'print(a)')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'swift-03',
      title: L('if', 'if'),
      instruction: L(
        'Las condiciones `if` no requieren paréntesis alrededor del booleano.',
        '`if` conditions do not need parentheses around the boolean.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          'En Swift, ¿los paréntesis alrededor de `if condición` son obligatorios?',
          'In Swift, are parentheses around `if condition` required?',
        ),
        options: [
          L('Sí, siempre', 'Yes, always'),
          L('No, se omiten casi siempre', 'No, usually omitted'),
          L('Solo en UIKit', 'Only in UIKit'),
          L('Solo en Linux', 'Only on Linux'),
        ],
        correctIndex: 1,
        wrongHint: L('Escribes `if x > 0 { }` sin paréntesis extra.', 'You write `if x > 0 { }` without extra parens.'),
      },
    },
  ],
}

export const KOTLIN_GUIDED_COURSE: GuidedCourse = {
  languageId: 'kotlin',
  lessons: [
    {
      id: 'kotlin-01',
      title: L('println', 'println'),
      instruction: L(
        '`println` imprime una línea; Kotlin corre en JVM y otros entornos.',
        '`println` prints one line; Kotlin runs on the JVM and elsewhere.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Cuál imprime una línea con salto en Kotlin?',
          'Which prints a line with a newline in Kotlin?',
        ),
        options: [L('print only', 'print only'), L('println(...)', 'println(...)'), L('puts', 'puts'), L('echo', 'echo')],
        correctIndex: 1,
        wrongHint: L('`println` añade el salto de línea.', '`println` adds the newline.'),
      },
    },
    {
      id: 'kotlin-02',
      title: L('val y var', 'val and var'),
      instruction: L(
        '`val` es solo lectura; `var` es mutable.',
        '`val` is read-only; `var` is mutable.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('val n = 8', 'val n = 8'), L('println(n)', 'println(n)')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'kotlin-03',
      title: L('if expresión', 'if expression'),
      instruction: L(
        '`if` puede ser expresión y devolver un valor.',
        '`if` can be an expression and return a value.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Puede `if` en Kotlin usarse como expresión (devolver valor)?',
          'Can `if` in Kotlin be used as an expression (return a value)?',
        ),
        options: [
          L('No', 'No'),
          L('Sí', 'Yes'),
          L('Solo en Android', 'Only on Android'),
          L('Solo con suspend', 'Only with suspend'),
        ],
        correctIndex: 1,
        wrongHint: L('Ejemplo: `val s = if (a) "x" else "y"`', 'Example: `val s = if (a) "x" else "y"`'),
      },
    },
  ],
}

export const RUBY_GUIDED_COURSE: GuidedCourse = {
  languageId: 'ruby',
  lessons: [
    {
      id: 'ruby-01',
      title: L('puts', 'puts'),
      instruction: L(
        '`puts` imprime una línea; Ruby es flexible con paréntesis.',
        '`puts` prints a line; Ruby is flexible about parentheses.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué método imprime con salto de línea en Ruby?',
          'Which method prints with a newline in Ruby?',
        ),
        options: [L('print (solo)', 'print (alone)'), L('puts', 'puts'), L('echo', 'echo'), L('println', 'println')],
        correctIndex: 1,
        wrongHint: L('`puts` añade newline al final.', '`puts` adds a newline at the end.'),
      },
    },
    {
      id: 'ruby-02',
      title: L('Variables', 'Variables'),
      instruction: L(
        'Las variables locales empiezan con letra o `_`; convención `snake_case`.',
        'Local variables start with a letter or `_`; convention `snake_case`.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('x = 3', 'x = 3'), L('puts x', 'puts x')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'ruby-03',
      title: L('if', 'if'),
      instruction: L(
        '`if condición` puede ir al final en estilo modificador: `puts "ok" if ok`',
        '`if condition` can trail as a modifier: `puts "ok" if ok`',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Los paréntesis alrededor de la condición en `if` son obligatorios?',
          'Are parentheses around the `if` condition required?',
        ),
        options: [
          L('Siempre obligatorios', 'Always required'),
          L('Opcionales en muchos casos', 'Optional in many cases'),
          L('Prohibidos', 'Forbidden'),
          L('Solo con unless', 'Only with unless'),
        ],
        correctIndex: 1,
        wrongHint: L('Ruby permite `if x > 0` sin paréntesis.', 'Ruby allows `if x > 0` without parens.'),
      },
    },
  ],
}

export const PHP_GUIDED_COURSE: GuidedCourse = {
  languageId: 'php',
  lessons: [
    {
      id: 'php-01',
      title: L('echo', 'echo'),
      instruction: L(
        '`echo` y `print` muestran texto en salida HTML o consola según el contexto.',
        '`echo` and `print` show text to HTML output or the CLI depending on context.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Cuál es una forma común de imprimir texto en PHP?',
          'What is a common way to print text in PHP?',
        ),
        options: [L('Console.WriteLine', 'Console.WriteLine'), L('echo "Hi";', 'echo "Hi";'), L('println', 'println'), L('std::cout', 'std::cout')],
        correctIndex: 1,
        wrongHint: L('`echo` es una construcción del lenguaje muy usada.', '`echo` is a widely used language construct.'),
      },
    },
    {
      id: 'php-02',
      title: L('$variables', '$variables'),
      instruction: L(
        'Las variables empiezan con `$`: `$nombre = "Ana";`',
        'Variables start with `$`: `$name = "Ana";`',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('$k = 2;', '$k = 2;'), L('echo $k;', 'echo $k;')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'php-03',
      title: L('if', 'if'),
      instruction: L(
        'Las llaves agrupan bloques; PHP mezcla con HTML en plantillas.',
        'Braces group blocks; PHP mixes with HTML in templates.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'orderLines',
        lines: [
          L('    echo "si";', '    echo "yes";'),
          L('if ($x > 0) {', 'if ($x > 0) {'),
          L('}', '}'),
        ],
        correctOrder: [1, 0, 2],
      },
    },
  ],
}

export const DART_GUIDED_COURSE: GuidedCourse = {
  languageId: 'dart',
  lessons: [
    {
      id: 'dart-01',
      title: L('print', 'print'),
      instruction: L(
        '`print(object)` muestra la representación en consola (flutter / CLI).',
        '`print(object)` shows the representation in the console (Flutter / CLI).',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué función usa Dart típicamente para depurar por consola?',
          'What does Dart typically use to debug to the console?',
        ),
        options: [L('println', 'println'), L('print(...)', 'print(...)'), L('cout', 'cout'), L('echo', 'echo')],
        correctIndex: 1,
        wrongHint: L('Es la función `print` del núcleo.', 'It is the core `print` function.'),
      },
    },
    {
      id: 'dart-02',
      title: L('var y tipos', 'var and types'),
      instruction: L(
        '`var` infiere; también puedes escribir tipos explícitos.',
        '`var` infers; you can also write explicit types.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('var n = 9;', 'var n = 9;'), L('print(n);', 'print(n);')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'dart-03',
      title: L('if', 'if'),
      instruction: L(
        '`if (cond) { }` — condición booleana entre paréntesis.',
        '`if (cond) { }` — boolean condition in parentheses.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Dart exige punto y coma al final de cada sentencia?',
          'Does Dart require a semicolon at the end of each statement?',
        ),
        options: [
          L('Nunca', 'Never'),
          L('En la mayoría de sentencias sí', 'Yes for most statements'),
          L('Solo en clases', 'Only in classes'),
          L('Opcional siempre', 'Always optional'),
        ],
        correctIndex: 1,
        wrongHint: L('El estilo habitual incluye `;` al terminar sentencias.', 'The usual style ends statements with `;`.'),
      },
    },
  ],
}

export const LUA_GUIDED_COURSE: GuidedCourse = {
  languageId: 'lua',
  lessons: [
    {
      id: 'lua-01',
      title: L('print', 'print'),
      instruction: L(
        '`print(a, b)` puede mostrar varios valores separados por tabuladores.',
        '`print(a, b)` can show several values separated by tabs.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué función global imprime en Lua?',
          'Which global function prints in Lua?',
        ),
        options: [L('puts', 'puts'), L('print(...)', 'print(...)'), L('echo', 'echo'), L('fmt.Println', 'fmt.Println')],
        correctIndex: 1,
        wrongHint: L('Es simplemente `print`.', 'It is simply `print`.'),
      },
    },
    {
      id: 'lua-02',
      title: L('Variables locales', 'Local variables'),
      instruction: L(
        '`local x = 1` limita el alcance al bloque actual.',
        '`local x = 1` limits scope to the current block.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('local n = 2', 'local n = 2'), L('print(n)', 'print(n)')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'lua-03',
      title: L('if', 'if'),
      instruction: L(
        '`then` y `end` delimitan el cuerpo del `if` en Lua.',
        '`then` and `end` delimit the `if` body in Lua.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'orderLines',
        lines: [
          L('    print("ok")', '    print("ok")'),
          L('if 1 < 2 then', 'if 1 < 2 then'),
          L('end', 'end'),
        ],
        correctOrder: [1, 0, 2],
      },
    },
  ],
}

export const SQL_GUIDED_COURSE: GuidedCourse = {
  languageId: 'sql',
  lessons: [
    {
      id: 'sql-01',
      title: L('SELECT', 'SELECT'),
      instruction: L(
        '`SELECT` elige columnas; `FROM` indica la tabla.',
        '`SELECT` chooses columns; `FROM` names the table.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué palabra clave empieza una consulta de lectura típica en SQL?',
          'Which keyword starts a typical read query in SQL?',
        ),
        options: [L('INSERT', 'INSERT'), L('SELECT', 'SELECT'), L('DELETE', 'DELETE'), L('CREATE', 'CREATE')],
        correctIndex: 1,
        wrongHint: L('Las consultas de lectura empiezan con `SELECT`.', 'Read queries start with `SELECT`.'),
      },
    },
    {
      id: 'sql-02',
      title: L('WHERE', 'WHERE'),
      instruction: L(
        '`WHERE` filtra filas antes de devolver resultados.',
        '`WHERE` filters rows before returning results.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Dónde va la condición que limita qué filas ves?',
          'Where does the condition go that limits which rows you see?',
        ),
        options: [
          L('Antes de SELECT', 'Before SELECT'),
          L('Tras FROM ... WHERE ...', 'After FROM ... WHERE ...'),
          L('Solo en ORDER BY', 'Only in ORDER BY'),
          L('Al final sin nombre', 'At the end unnamed'),
        ],
        correctIndex: 1,
        wrongHint: L('Patrón: `SELECT ... FROM tabla WHERE condición`.', 'Pattern: `SELECT ... FROM table WHERE condition`.'),
      },
    },
    {
      id: 'sql-03',
      title: L('ORDER BY', 'ORDER BY'),
      instruction: L(
        '`ORDER BY columna` ordena el resultado; `DESC` invierte.',
        '`ORDER BY column` sorts results; `DESC` reverses.',
      ),
      introducesConcept: 'repeat_loop',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué cláusula ordena los resultados finales?',
          'Which clause sorts the final results?',
        ),
        options: [L('GROUP BY solo', 'GROUP BY only'), L('ORDER BY', 'ORDER BY'), L('HAVING solo', 'HAVING only'), L('FILTER BY', 'FILTER BY')],
        correctIndex: 1,
        wrongHint: L('`ORDER BY` controla el orden de las filas devueltas.', '`ORDER BY` controls row order in the result.'),
      },
    },
  ],
}

export const HTML_CSS_GUIDED_COURSE: GuidedCourse = {
  languageId: 'html_css',
  lessons: [
    {
      id: 'html-01',
      title: L('Etiquetas HTML', 'HTML tags'),
      instruction: L(
        'Las páginas usan elementos como `<p>`texto`</p>`.',
        'Pages use elements like `<p>`text`</p>`.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué par forma un párrafo en HTML?',
          'Which pair forms a paragraph in HTML?',
        ),
        options: [
          L('<paragraph>...</paragraph>', '<paragraph>...</paragraph>'),
          L('<p>...</p>', '<p>...</p>'),
          L('<para>...</para>', '<para>...</para>'),
          L('{p}...{/p}', '{p}...{/p}'),
        ],
        correctIndex: 1,
        wrongHint: L('El elemento de párrafo es `p`.', 'The paragraph element is `p`.'),
      },
    },
    {
      id: 'html-02',
      title: L('CSS color', 'CSS color'),
      instruction: L(
        '`color: red;` dentro de una regla cambia el color del texto.',
        '`color: red;` inside a rule changes text color.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [
          L('  color: blue;', '  color: blue;'),
          L('p {', 'p {'),
          L('}', '}'),
        ],
        correctOrder: [1, 0, 2],
      },
    },
    {
      id: 'html-03',
      title: L('Clases', 'Classes'),
      instruction: L(
        'El atributo `class` enlaza CSS con `.nombre { ... }`.',
        'The `class` attribute links CSS with `.name { ... }`.',
      ),
      introducesConcept: 'function_block',
      exercise: {
        type: 'pickOne',
        prompt: L(
          'En CSS, ¿cómo seleccionas elementos con `class="btn"`?',
          'In CSS, how do you select elements with `class="btn"`?',
        ),
        options: [L('#btn', '#btn'), L('.btn', '.btn'), L('btn', 'btn'), L('*btn', '*btn')],
        correctIndex: 1,
        wrongHint: L('El punto indica clase.', 'The dot marks a class selector.'),
      },
    },
  ],
}

export const SHELL_BASH_GUIDED_COURSE: GuidedCourse = {
  languageId: 'shell_bash',
  lessons: [
    {
      id: 'sh-01',
      title: L('echo', 'echo'),
      instruction: L(
        '`echo texto` escribe en la salida del terminal.',
        '`echo text` writes to the terminal output.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué comando suele mostrar una línea de texto en shell?',
          'What command usually prints a line of text in the shell?',
        ),
        options: [L('cat only files', 'cat only files'), L('echo', 'echo'), L('ls', 'ls'), L('cd', 'cd')],
        correctIndex: 1,
        wrongHint: L('`echo` repite argumentos a stdout.', '`echo` repeats arguments to stdout.'),
      },
    },
    {
      id: 'sh-02',
      title: L('Variables', 'Variables'),
      instruction: L(
        '`NOMBRE=valor` y luego `$NOMBRE` expande el valor.',
        '`NAME=value` then `$NAME` expands the value.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('X=3', 'X=3'), L('echo $X', 'echo $X')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'sh-03',
      title: L('if en bash', 'if in bash'),
      instruction: L(
        '`if [ condición ]; then ... fi` cierra con `fi`.',
        '`if [ condition ]; then ... fi` closes with `fi`.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Cómo termina un bloque `if` en bash?',
          'How does an `if` block end in bash?',
        ),
        options: [L('end', 'end'), L('fi', 'fi'), L('}', '}'), L('endif', 'endif')],
        correctIndex: 1,
        wrongHint: L('`if` al revés es `fi`.', '`if` reversed is `fi`.'),
      },
    },
  ],
}

export const R_LANG_GUIDED_COURSE: GuidedCourse = {
  languageId: 'r_lang',
  lessons: [
    {
      id: 'r-01',
      title: L('print', 'print'),
      instruction: L(
        '`print(x)` y `cat()` muestran valores en la consola interactiva.',
        '`print(x)` and `cat()` show values in the interactive console.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué función muestra un objeto completo de forma legible en R?',
          'Which function shows a whole object readably in R?',
        ),
        options: [L('echo', 'echo'), L('print(...)', 'print(...)'), L('cout', 'cout'), L('fmt.Print', 'fmt.Print')],
        correctIndex: 1,
        wrongHint: L('`print` es la función básica de inspección.', '`print` is the basic inspection function.'),
      },
    },
    {
      id: 'r-02',
      title: L('<-', '<-'),
      instruction: L(
        'La flecha `<-` asigna valores a nombres: `x <- 5`.',
        'The `<-` arrow assigns values to names: `x <- 5`.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('n <- 4', 'n <- 4'), L('print(n)', 'print(n)')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'r-03',
      title: L('if', 'if'),
      instruction: L(
        '`if (cond) { ... } else { ... }` — llaves para bloques largos.',
        '`if (cond) { ... } else { ... }` — braces for longer blocks.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué valor lógico representa “verdadero” en R?',
          'Which logical value means TRUE in R?',
        ),
        options: [L('0', '0'), L('TRUE', 'TRUE'), L('"false"', '"false"'), L('NULL', 'NULL')],
        correctIndex: 1,
        wrongHint: L('Los escalares lógicos son TRUE y FALSE en mayúsculas.', 'Logical scalars are TRUE and FALSE in capitals.'),
      },
    },
  ],
}

export const SCALA_GUIDED_COURSE: GuidedCourse = {
  languageId: 'scala',
  lessons: [
    {
      id: 'scala-01',
      title: L('println', 'println'),
      instruction: L(
        '`println` en Scala corre sobre la JVM y se parece a Java.',
        '`println` in Scala runs on the JVM and feels like Java.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué método suele usarse en scripts Scala para imprimir una línea?',
          'What method do Scala scripts usually use to print a line?',
        ),
        options: [L('printf solo C', 'printf only C'), L('println(...)', 'println(...)'), L('echo', 'echo'), L('puts', 'puts')],
        correctIndex: 1,
        wrongHint: L('Herencia del estilo de la librería estándar JVM.', 'Inherited from the JVM standard style.'),
      },
    },
    {
      id: 'scala-02',
      title: L('val y var', 'val and var'),
      instruction: L(
        '`val` es inmutable; `var` es mutable.',
        '`val` is immutable; `var` is mutable.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('val k = 6', 'val k = 6'), L('println(k)', 'println(k)')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'scala-03',
      title: L('if expresión', 'if expression'),
      instruction: L(
        '`if` devuelve valores como expresión.',
        '`if` returns values as an expression.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Scala prefiere tipado estático explícito en muchas APIs?',
          'Does Scala favor explicit static typing in many APIs?',
        ),
        options: [
          L('No, todo es dinámico', 'No, everything is dynamic'),
          L('Sí, el tipado estático es central', 'Yes, static typing is central'),
          L('Solo en scripts', 'Only in scripts'),
          L('Nunca usa tipos', 'Never uses types'),
        ],
        correctIndex: 1,
        wrongHint: L('Scala combina POO y funcional con tipos fuertes.', 'Scala mixes OOP and functional with strong types.'),
      },
    },
  ],
}

export const ELIXIR_GUIDED_COURSE: GuidedCourse = {
  languageId: 'elixir',
  lessons: [
    {
      id: 'ex-01',
      title: L('IO.puts', 'IO.puts'),
      instruction: L(
        '`IO.puts` envía una cadena con salto de línea al proceso estándar.',
        '`IO.puts` sends a string with a newline to standard output.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué módulo suele usarse para imprimir en consola en Elixir?',
          'Which module is typically used to print to the console in Elixir?',
        ),
        options: [L('Kernel solo', 'Kernel only'), L('IO', 'IO'), L('Enum', 'Enum'), L('GenServer', 'GenServer')],
        correctIndex: 1,
        wrongHint: L('`IO.puts/1` es el patrón común.', '`IO.puts/1` is the common pattern.'),
      },
    },
    {
      id: 'ex-02',
      title: L('Pattern matching', 'Pattern matching'),
      instruction: L(
        '`=` no solo asigna: también hace coincidencia de patrones.',
        '`=` does not only assign: it also pattern-matches.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'orderLines',
        lines: [L('x = 3', 'x = 3'), L('IO.puts(x)', 'IO.puts(x)')],
        correctOrder: [0, 1],
      },
    },
    {
      id: 'ex-03',
      title: L('if', 'if'),
      instruction: L(
        '`if`/`else`/`end` delimitan ramas como en Ruby.',
        '`if`/`else`/`end` delimit branches like Ruby.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Elixir corre sobre la máquina virtual de Erlang (BEAM)?',
          'Does Elixir run on the Erlang VM (BEAM)?',
        ),
        options: [
          L('No, JVM', 'No, JVM'),
          L('Sí, BEAM', 'Yes, BEAM'),
          L('Solo en navegador', 'Browser only'),
          L('No hay VM', 'No VM'),
        ],
        correctIndex: 1,
        wrongHint: L('Comparte runtime con Erlang.', 'It shares the Erlang runtime.'),
      },
    },
  ],
}

export const HASKELL_GUIDED_COURSE: GuidedCourse = {
  languageId: 'haskell',
  lessons: [
    {
      id: 'hs-01',
      title: L('print', 'print'),
      instruction: L(
        '`print x` usa Show para convertir valores a texto legible.',
        '`print x` uses Show to turn values into readable text.',
      ),
      introducesConcept: 'console',
      exercise: {
        type: 'pickOne',
        prompt: L(
          'En Haskell en GHCi, ¿qué función imprime valores que implementan `Show`?',
          'In GHCi Haskell, what prints values that implement `Show`?',
        ),
        options: [L('echo', 'echo'), L('print', 'print'), L('println', 'println'), L('cout', 'cout')],
        correctIndex: 1,
        wrongHint: L('Prelude define `print :: Show a => a -> IO ()`.', 'Prelude defines `print :: Show a => a -> IO ()`.'),
      },
    },
    {
      id: 'hs-02',
      title: L('let', 'let'),
      instruction: L(
        '`let nombre = expr in ...` introduce enlaces locales.',
        '`let name = expr in ...` introduces local bindings.',
      ),
      introducesConcept: 'variable',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Haskell usa mutación de variables por defecto en el núcleo puro?',
          'Does Haskell use variable mutation by default in the pure core?',
        ),
        options: [
          L('Sí, todo es mutable', 'Yes, everything is mutable'),
          L('No, los valores puros son inmutables', 'No, pure values are immutable'),
          L('Solo los enteros', 'Only integers'),
          L('Depende del SO', 'Depends on OS'),
        ],
        correctIndex: 1,
        wrongHint: L('La mutación vive en `IO` y monadas.', 'Mutation lives in `IO` and monads.'),
      },
    },
    {
      id: 'hs-03',
      title: L('if then else', 'if then else'),
      instruction: L(
        '`if cond then a else b` — siempre necesita ambas ramas y tipos compatibles.',
        '`if cond then a else b` — always needs both branches with compatible types.',
      ),
      introducesConcept: 'if_branch',
      exercise: {
        type: 'pickOne',
        prompt: L(
          '¿Qué frase describe mejor una expresión `if` en Haskell?',
          'Which phrase best describes a Haskell `if` expression?',
        ),
        options: [
          L('Solo una rama puede existir', 'Only one branch may exist'),
          L('Es obligatorio `then` y `else` con el mismo tipo', '`then` and `else` must share the same type'),
          L('Siempre devuelve IO', 'Always returns IO'),
          L('No existe `if`', '`if` does not exist'),
        ],
        correctIndex: 1,
        wrongHint: L(
          'Ambas ramas deben ser compatibles porque todo es una expresión.',
          'Both branches must match because everything is one expression.',
        ),
      },
    },
  ],
}
