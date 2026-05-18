export type Locale = 'en' | 'es'

export type MessageDict = Record<string, string>

export const messages: Record<Locale, MessageDict> = {
  en: {
    'locale.en': 'English',
    'locale.es': 'Español',

    'hub.badge': 'Welcome',
    'hub.title': 'Choose what you want to learn',
    'hub.subtitle':
      'Choose one track at a time. It is saved on this device and you can change it anytime from Home.',
    'hub.section': 'Languages & tracks',
    'hub.blocks.title': 'Blocks & canvas',
    'hub.blocks.desc': 'Visual block coding on the canvas — available now in CodeJump Academy.',
    'hub.blocks.badge': 'Available',
    'hub.track.practiceDesc':
      'Five exercise modules with multiple-choice drills — unique questions per language.',
    'hub.track.practiceBadge': 'Practice',
    'hub.track.javascript.title': 'JavaScript',
    'hub.track.typescript.title': 'TypeScript',
    'hub.track.python.title': 'Python',
    'hub.track.java.title': 'Java',
    'hub.track.csharp.title': 'C#',
    'hub.track.cpp.title': 'C++',
    'hub.track.c_lang.title': 'C',
    'hub.track.go.title': 'Go',
    'hub.track.rust.title': 'Rust',
    'hub.track.swift.title': 'Swift',
    'hub.track.kotlin.title': 'Kotlin',
    'hub.track.ruby.title': 'Ruby',
    'hub.track.php.title': 'PHP',
    'hub.track.sql.title': 'SQL',
    'hub.track.html_css.title': 'HTML & CSS',
    'hub.track.dart.title': 'Dart',
    'hub.track.lua.title': 'Lua',
    'hub.track.shell_bash.title': 'Bash / shell',
    'hub.track.r_lang.title': 'R',
    'hub.track.scala.title': 'Scala',
    'hub.track.elixir.title': 'Elixir',
    'hub.track.haskell.title': 'Haskell',
    'hub.note':
      'Blocks opens canvas puzzles; a programming language opens guided lessons and quizzes for that track only. Puzzle instructions follow the UI language.',
    'hub.continue': 'Continue',
    'hub.continueBlocks': 'Blocks & canvas lessons',
    'hub.continuePractice': 'Language exercises',
    'hub.chooseDestination': 'Open blocks or language practice for your selected track (saved on this device).',
    'hub.selectOne': 'Select a track.',
    'hub.subtitleFull':
      'Every programming track offers two layouts: Beginner keeps the canvas-style preview column; Advanced gives you more space without it. Your choice is saved on this device.',
    'hub.sectionBlocks': 'Blocks & canvas',
    'hub.sectionModes': 'Languages · beginner or advanced',
    'hub.ctaBeginner': 'Beginner · with canvas',
    'hub.ctaAdvanced': 'Advanced · no canvas',
    'hub.ctaBeginnerShort': 'Beginner',
    'hub.ctaAdvancedShort': 'Advanced',
    'hub.noteModes':
      'Beginner adds the third “canvas / preview” column like the blocks mindset; Advanced hides it for a wider editor and tools.',
    'hub.siteName': 'CodeJump Academy',
    'hub.navAriaLabel': 'Site',
    'hub.skipToContent': 'Skip to content',
    'hub.footerLead':
      'Visual block puzzles plus guided lessons and quizzes across programming languages — runs entirely in your browser.',

    'nav.home': 'Home',

    'header.tagline': 'CodeJump Academy',
    'header.title': 'Learn code with blocks',
    'header.chapter': 'Chapter',
    'header.xp': 'XP · Lv. {{level}}',
    'header.prevPuzzle': 'Previous puzzle',
    'header.nextPuzzle': 'Next puzzle',
    'header.puzzleOption': 'Puzzle {{num}}',
    'header.trackQuiz': 'Track quizzes',
    'header.languagePractice': 'Language exercises',
    'header.modeLearn': 'Blocks',
    'header.modePractice': 'Practice',
    'header.modeToggleAria': 'Switch between block puzzles and language practice',

    'quiz.title': 'Quick track quiz',
    'quiz.pickLanguage': 'Language',
    'quiz.progress': 'Question {{current}} / {{total}}',
    'quiz.check': 'Check answer',
    'quiz.next': 'Next question',
    'quiz.finish': 'See results',
    'quiz.score': 'Score: {{correct}} / {{total}}',
    'quiz.close': 'Close',
    'quiz.noTracks':
      'On Home, choose a programming language (not Blocks) to unlock quizzes for that track.',
    'quiz.correct': 'Correct!',
    'quiz.incorrect': 'Not quite.',
    'quiz.doneTitle': 'Quiz complete',
    'quiz.deckLabel': 'Track: {{track}}',
    'quiz.loading': 'Loading…',

    'practice.title': 'Language exercises',
    'practice.subtitle':
      'Guided lessons with instructions and a hands-on step, plus five quiz modules for the language you chose on Home. New ideas are explained before you practice.',
    'practice.modulesIntro': 'Tap a module to start. Completing a module shows your score.',
    'practice.moduleLabel': 'Module {{num}}',
    'practice.moduleButton': 'Module {{num}}',
    'practice.backToOverview': 'Practice overview',
    'practice.backToModules': 'Back to modules',
    'practice.pickLanguagesOnHub':
      'Go to Home and choose a programming language (not Blocks) to see exercises for that track.',
    'practice.noQuestions': 'No quiz items are available for this selection.',

    'practice.overviewCanvasHint':
      'These are the languages you picked on Home. Every track uses the same layout in the middle column: guided lessons plus quiz modules.',
    'practice.trackCounts': '{{lessons}} guided lessons · {{quizzes}} quiz modules',
    'practice.paletteHintShort': 'Legend',
    'practice.uiLanguageAria': 'Interface language',
    'practice.paletteGuidedExplainer':
      'Amber gradient buttons open **guided lessons** — instructions, exercises, and Run where available.',
    'practice.paletteQuizExplainer':
      'Outlined violet buttons open **track quizzes** (five modules per language).',
    'practice.paletteFooter': 'Every language follows this pattern so practice stays consistent.',
    'practice.langPalette.intro':
      'Each card is a small code snippet for this track — tap to copy. Your exercise stays in the center column.',
    'practice.langPalette.introInsert':
      'Small code snippets — tap to insert at the cursor, or into the scratch pad for reorder or multiple-choice lessons.',
    'practice.paletteCode.intro':
      'This lesson’s snippets only — tap a card to insert at the cursor (typing from the keyboard is turned off).',
    'practice.paletteCode.introInsert':
      'Lesson snippets — tap to insert. Use Backspace to fix; new lines come from the “New line” card.',
    'practice.langPalette.group.output': 'Output',
    'practice.langPalette.group.variables': 'Variables',
    'practice.langPalette.group.control': 'Flow control',
    'practice.langPalette.group.types': 'Types',
    'practice.langPalette.group.data': 'Data',
    'practice.langPalette.group.functions': 'Functions',
    'practice.mascotTip':
      'Use the center column like your workspace: open a language card, then choose a lesson or quiz module.',

    'practice.quizInstructionsPanel':
      'Read each question in the center column, choose an answer, and press Check. Feedback explains the idea for this track.',
    'practice.quizCanvasHint':
      'Think of this panel like the canvas preview — one focused goal while you answer.',
    'practice.quizPaletteExplainer':
      'Quizzes drill syntax and concepts for the selected language. Complete the deck to see your score.',
    'practice.quizMascotTip': 'Wrong answers still teach — read the explanation before continuing.',

    'guided.courseSection': 'Guided lessons',
    'guided.courseBlurb':
      'Instructions plus a practice step (reorder lines, quiz, or **run code** in the mini lab). When a **new idea** appears, we explain it and relate it to CodeJump blocks when it helps.',
    'guided.extendedLessonHeading': 'Nine lessons in this module',
    'guided.moduleNoLessonsYet': 'No lessons in this module yet.',
    'guided.lessonButton': 'Lesson {{num}}',
    'guided.lessonMeta': 'Lesson {{current}} / {{total}}',
    'guided.newIdea': 'New idea — read this before coding',
    'guided.yourTurn': 'Your turn',
    'guided.orderHint': 'Put the lines in runnable order (top = first to execute). Use the arrows.',
    'guided.assembleLineGoal':
      'Reorder every fragment until the preview reads as one valid program (declare the value, then use the name).',
    'guided.assembleLineWorkspaceHint':
      'Each row is a piece of the line (or a new line). Use the arrows; the green preview updates as you go.',
    'guided.assembledLinePreview': 'Preview',
    'guided.assembledLinePreviewFragments':
      'Bars separate fragments in reading order; together they form one program.',
    'guided.moveUp': 'Move line up',
    'guided.moveDown': 'Move line down',
    'guided.tryReorder': 'Not quite — reorder so the program runs from top to bottom.',
    'guided.checkOrder': 'Check order',
    'guided.checkAnswer': 'Check answer',
    'guided.checkOutput': 'Check output',
    'guided.checkPaletteCode': 'Check program',
    'guided.beforeYouCode': 'Before you code — required ideas',
    'guided.conceptCheckVariable': 'Create variable (`const`)',
    'guided.conceptCheckRepeat': 'Repeat (`for` loop)',
    'guided.conceptCheckDone': 'done',
    'guided.conceptCheckPending': 'still needed',
    'guided.paletteMissingVariable':
      'Your program must include at least one **Create variable** line: a `const name = …;` card from the palette.',
    'guided.paletteMissingRepeat':
      'Your program must include **Repeat**: add the `for` card from the palette (like the Repeat block on the canvas).',
    'guided.paletteMissingBoth':
      'You still need **Create variable** (`const`) and **Repeat** (`for`) in your program — use those palette sections first.',
    'guided.paletteRoleVariable': 'Create variable',
    'guided.paletteRoleConsole': 'Output',
    'guided.paletteRoleIf': 'Condition',
    'guided.paletteRoleRepeat': 'Repeat',
    'guided.paletteCodePreviewHint':
      'Your program appears in the center — insert lines only from the palette on the right.',
    'guided.paletteCodeEditorAria': 'Program built from palette snippets only',
    'guided.paletteCodeLiveCanvasTitle': 'Live preview — your lines as stripes',
    'guided.paletteCodeLiveCanvasFoot':
      'Each stripe lights up when that line matches the goal. Open the large view anytime from the toolbar.',
    'guided.paletteCodeOpenModal': 'Large preview',
    'guided.paletteCodeModalTitle': 'Your program as a flow',
    'guided.paletteCodeModalBody':
      'This is the three-step flow you built. Each band matches one line of code!',
    'guided.paletteCodeModalClose': 'Got it',
    'guided.paletteCodeModalRestart': 'Restart exercise',
    'guided.paletteCodeCanvasHeroAria': 'Interactive preview — tap to play with the word',
    'guided.paletteCodeCanvasHeroLit': 'Nice — your first line matches. Keep building below.',
    'guided.paletteCodeCanvasHeroDim': 'Complete the first line of code below — then this lights up.',
    'guided.paletteCodeCanvasHeroTap': 'Tap the word — it’s what your program is “saying”.',
    'guided.paletteCodeCanvasHeroCelebrate': 'You did it — your code matches the goal. Tap the word to play!',
    'guided.paletteCodeCanvasAwait':
      'Build your program in the center, then tap Check program. Your picture unlocks here when every line matches!',
    'guided.paletteCodeHeroSqlAria': 'Visual funnel: SELECT, then FROM, then WHERE — match your three lines below.',
    'guided.paletteCodeHeroHtmlAria': 'Layers: HTML tag, visible text, then a CSS color rule — match your three lines below.',
    'guided.runHintEditor': 'Edit the code, press Run to see output, then Check output when it matches the goal.',
    'guided.scratchTitle': 'Snippet scratch pad',
    'guided.scratchHint':
      'Tap palette cards to insert snippets here — handy while you reorder lines or pick an answer.',
    'guided.pythonFirstLoad': 'The first Python run downloads the runtime; it may take a little while.',
    'guided.nice': 'Nice!',
    'guided.lessonDone': 'Lesson complete.',
    'guided.missingLesson': 'This lesson could not be loaded.',
    'guided.moreCoursesSoon': 'More guided lessons are added over time; quizzes stay available for every track.',
    'guided.nextLesson': 'Next lesson',
    'guided.prevLesson': 'Previous lesson',
    'guided.navLesson': 'Lesson',
    'guided.navChapter': 'Chapter',
    'guided.chapterLessonsRange': 'Lessons {{from}}–{{to}}',
    'guided.advancedNavAria': 'Lesson and chapter navigation',
    'guided.lessonTools': 'Lesson tools',
    'guided.goalHeading': 'Goal',
    'guided.resultPreview': 'Result preview',
    'guided.canvasBlocksAnalog':
      'Same idea as Blocks: paint, gaps, new rows, variables, and repeat — not only drawBox.',
    'guided.canvasRealGoal': 'Real canvas goal',
    'guided.canvasGoalPreview': 'What you are aiming for (preview)',
    'guided.previewPlaceholder':
      'Output from Run appears here — same idea as watching the canvas update after you press Run on blocks.',
    'guided.previewExerciseHint':
      'Use the center panel to reorder lines or answer the question. When the lesson has runnable code, Run shows output here.',
    'guided.resetExercise': 'Clear',
    'guided.resetOutput': 'Clear output',
    'guided.expectedFragments': 'Your output should include:',
    'guided.expectFragmentsExplainer':
      'After Run, we read everything in the output box together with any error text. The fragments below are your checklist: for Check output to pass, each fragment must appear somewhere in that combined text (unless the lesson says otherwise). Later lessons often add more fragments to the list as the goal grows.',
    'guided.paletteSnippetsExplainer':
      'The snippets below are the only pieces you can insert from the palette. Tap cards to build your program line by line until it matches the goal when you check. Longer lessons add more rows here as new names, literals, or lines appear.',
    'guided.goalOrderLinesExplainer':
      'Each row is a full line of code. Reorder until the program would run correctly from top to bottom.',
    'guided.goalAssembleExplainer':
      'Each row is a small token (word or punctuation). Reorder until they concatenate into one valid line of code.',
    'guided.goalStripeExplainer':
      'Each stripe is one step in the program’s story. Reorder until the flow matches how the code should execute.',
    'guided.goalPickOneExplainer':
      'Read the question carefully, then pick the answer that matches the idea the lesson is testing.',
    'guided.hintButton': 'Hint',
    'guided.hintButtonAria': 'Show or hide a hint for this step',
    'guided.runCodeParsonsWorkspaceHint':
      'Reorder the lines (top = first to run). Press Run, then Check output — your program is built only from these rows.',
    'guided.orderLinesManualHint':
      'Tip: read each line like a sentence. Declarations and setup usually come before lines that use those names or results.',
    'guided.mascotTip': 'Order matters — lines run top to bottom, just like statements in real code.',
    'guided.goalPickOne': 'Pick the option that best matches the prompt.',
    'practice.modeBeginner': 'Beginner',
    'practice.modeAdvanced': 'Advanced',
    'practice.modeBeginnerHint': 'Canvas column + preview hints on.',
    'practice.modeAdvancedHint': 'More space — no canvas preview column.',
    'practice.cornerInstructions': 'Read the panel on the left first.',
    'practice.cornerWorkspace': 'Guided lessons and quizzes live in the center.',
    'practice.cornerPalette': 'Goals and syntax notes on the right.',
    'practice.cornerTip': 'Pick a mode per language — saved on this device.',
    'guided.stripeGoalCaption': 'This is the target “flag” order — match it in the middle column.',
    'guided.stripeReorderHint':
      'Reorder the stripes (top = first in the flow). Use the arrows; read each stripe’s role in the tools panel →',
    'guided.moveStripeUp': 'Move stripe up',
    'guided.moveStripeDown': 'Move stripe down',

    'footer.line':
      'CodeJump Academy · React + Vite + Tailwind + Ant Design · by Ethan Javien Casilla',

    'workspace.instructions': 'Instructions',
    'workspace.canvas': 'Canvas',
    'workspace.yourCode': 'Your code',
    'workspace.clear': 'Clear',
    'workspace.resetCanvas': 'Canvas',
    'workspace.run': 'Run',
    'workspace.palette': 'Palette',
    'workspace.paletteHint': 'Click Repeat to nest blocks',
    'workspace.activeContainer': 'Active container',
    'workspace.root': 'Root',
    'workspace.repeatWith': 'Repeat {{label}}',
    'workspace.destination': 'Target:',
    'workspace.mainProgram': 'Main program',
    'workspace.paletteOnlyEditor': 'Palette inserts only — tap cards on the right',
    'workspace.insideRepeat': 'Inside Repeat (back to root)',
    'workspace.canvasHint':
      'Striped on the goal = empty cell. Use {{skip}} to advance without color.',
    'workspace.skipToken': 'skip()',
    'workspace.programProblem': 'Your program has a problem',
    'workspace.rowCol': 'Row {{row}}, col {{col}}',

    'palette.groupActions': 'Actions',
    'palette.groupControl': 'Control',
    'palette.groupValues': 'Values',
    'palette.newLine.desc': 'Go to the next row',
    'palette.skip.desc': 'Move without painting (blank cell)',
    'palette.repeat.desc': 'Repeat the inner blocks',
    'palette.varDecl.desc': 'Store a number to use in Repeat',
    'palette.drawBox.desc': 'Paint the current cell {{color}}',

    'blocks.segmentNumber': 'Number',
    'blocks.segmentVariable': 'Variable',
    'blocks.varKeyword': 'variable',
    'blocks.varOptionsHint': 'Names — drag to the slot or tap',
    'blocks.varDropTarget': 'Drop name here',
    'blocks.deleteBlock': 'Remove block',
    'blocks.repeatEmpty':
      'Select this Repeat and add blocks from the palette.',
    'blocks.emptyTitle': 'Your code will appear here',
    'blocks.emptyBody':
      'Drag from the palette or tap to build. Declared variables go at the bottom of the program; inside Repeat you can repeat using a number or a variable name defined above.',

    'visual.targetPattern': 'Target pattern',
    'visual.paintOrder': 'Paint order (like the cursor)',
    'visual.unpaintedCell': 'Unpainted',

    'difficulty.easy': 'Easy',
    'difficulty.normal': 'Normal',
    'difficulty.hard': 'Advanced',

    'color.red': 'Red',
    'color.orange': 'Orange',
    'color.yellow': 'Yellow',
    'color.green': 'Green',
    'color.blue': 'Blue',
    'color.indigo': 'Indigo',
    'color.purple': 'Purple',

    'modal.winTitle': 'Challenge complete!',
    'modal.winBody':
      'Your canvas matches the goal. Move on to the next puzzle whenever you are ready.',
    'modal.almostTitle': 'Almost there',
    'modal.tipTitle': 'Tip',
    'modal.tipBody': 'Walk through the code row by row in your head.',
    'modal.failLead':
      'Compare your canvas to the pattern: each {{drawBox}} paints and moves; use {{skip}} to leave a cell blank.',
    'modal.keepPracticing': 'Keep practicing',
    'modal.retryLevel': 'Retry this level',
    'modal.nextPuzzle': 'Next puzzle',
    'modal.newChallengeXp': 'New challenge + XP',

    'mascot.flattenError': 'Your code has an issue — check variables and blocks.',
    'mascot.win3': 'Three stars! First try and compact code!',
    'mascot.win2': 'Two stars! Nice use of blocks.',
    'mascot.win1': 'One star! Level complete.',
    'mascot.fail': 'So close! Try another order or check line breaks.',
    'mascot.tip.default':
      'Order matters—blocks run top to bottom, just like statements in real code.',
    'mascot.tip.javascript':
      'Small sequences here mirror how JavaScript runs one statement after another.',
    'mascot.tip.typescript':
      'Sketch the logic visually now; TypeScript will later help you catch mistakes early.',
    'mascot.tip.python':
      'Indentation and order matter—exactly like readable Python programs.',
    'mascot.tip.java':
      'Think in clear steps—classes and methods in Java love predictable flows.',
    'mascot.tip.csharp':
      'Structured flows translate cleanly to methods and LINQ-style pipelines.',
    'mascot.tip.cpp':
      'RAII mindset starts with disciplined ordering—same idea as stepping through blocks.',
    'mascot.tip.c_lang':
      'Low-level or high, programs still execute in order—feel it on the canvas.',
    'mascot.tip.go':
      'Tiny goroutines start from simple ordered steps—practice sequencing here.',
    'mascot.tip.rust':
      'Ownership is about clear moves—lining up blocks trains that careful ordering.',
    'mascot.tip.swift':
      'SwiftUI or not, execution order stays king—same as these puzzles.',
    'mascot.tip.kotlin':
      'Readable chains start with straightforward steps—build them visually first.',
    'mascot.tip.ruby':
      'Expressive Ruby still executes line by line—feel the rhythm with blocks.',
    'mascot.tip.php':
      'Requests become scripts that run top to bottom—same narrative as this canvas.',
    'mascot.tip.sql':
      'Queries are declarative, but your block order still trains logical thinking.',
    'mascot.tip.html_css':
      'Layouts read like trees—nested blocks echo nested tags and flex/grid flows.',
    'mascot.tip.dart':
      'Widget trees begin with ordered composition—practice nesting with repeats.',
    'mascot.tip.lua':
      'Lightweight scripts still execute stepwise—walk the grid like a Lua chunk.',
    'mascot.tip.shell_bash':
      'Pipelines are ordered commands—same discipline as stacking these blocks.',
    'mascot.tip.r_lang':
      'Vectors flow element by element—sequence intuition starts right here.',
    'mascot.tip.scala':
      'Functional pipelines begin with ordered transforms—warm up on this grid.',
    'mascot.tip.elixir':
      'Message-passing systems still run deterministic steps—practice the order.',
    'mascot.tip.haskell':
      'Even pure programs compose stepwise—feel evaluation order on the canvas.',

    'chapterTitle.fallback': 'Lesson',
  },
  es: {
    'locale.en': 'English',
    'locale.es': 'Español',

    'hub.badge': 'Bienvenida',
    'hub.title': 'Elige qué quieres aprender',
    'hub.subtitle':
      'Elige una sola ruta cada vez. Se guarda en este dispositivo y puedes cambiarla cuando quieras desde Inicio.',
    'hub.section': 'Lenguajes y rutas',
    'hub.blocks.title': 'Bloques y lienzo',
    'hub.blocks.desc': 'Código visual en el lienzo — ya disponible en CodeJump Academy.',
    'hub.blocks.badge': 'Disponible',
    'hub.track.practiceDesc':
      'Cinco módulos de ejercicios tipo test — preguntas distintas por lenguaje.',
    'hub.track.practiceBadge': 'Práctica',
    'hub.track.javascript.title': 'JavaScript',
    'hub.track.typescript.title': 'TypeScript',
    'hub.track.python.title': 'Python',
    'hub.track.java.title': 'Java',
    'hub.track.csharp.title': 'C#',
    'hub.track.cpp.title': 'C++',
    'hub.track.c_lang.title': 'C',
    'hub.track.go.title': 'Go',
    'hub.track.rust.title': 'Rust',
    'hub.track.swift.title': 'Swift',
    'hub.track.kotlin.title': 'Kotlin',
    'hub.track.ruby.title': 'Ruby',
    'hub.track.php.title': 'PHP',
    'hub.track.sql.title': 'SQL',
    'hub.track.html_css.title': 'HTML y CSS',
    'hub.track.dart.title': 'Dart',
    'hub.track.lua.title': 'Lua',
    'hub.track.shell_bash.title': 'Bash / shell',
    'hub.track.r_lang.title': 'R',
    'hub.track.scala.title': 'Scala',
    'hub.track.elixir.title': 'Elixir',
    'hub.track.haskell.title': 'Haskell',
    'hub.note':
      'Bloques abre los puzzles del lienzo; un lenguaje abre lecciones guiadas y tests solo para esa ruta. Las instrucciones del lienzo siguen el idioma de la interfaz.',
    'hub.continue': 'Continuar',
    'hub.continueBlocks': 'Lecciones bloques y lienzo',
    'hub.continuePractice': 'Ejercicios por lenguaje',
    'hub.chooseDestination': 'Abre bloques o la práctica del lenguaje elegido (se guarda en este dispositivo).',
    'hub.selectOne': 'Selecciona una ruta.',
    'hub.subtitleFull':
      'Cada lenguaje tiene dos modos: Principiante mantiene la columna tipo lienzo y vista previa; Avanzado te da más espacio sin esa columna. Se guarda en este dispositivo.',
    'hub.sectionBlocks': 'Bloques y lienzo',
    'hub.sectionModes': 'Lenguajes · principiante o avanzado',
    'hub.ctaBeginner': 'Principiante · con lienzo',
    'hub.ctaAdvanced': 'Avanzado · sin lienzo',
    'hub.ctaBeginnerShort': 'Principiante',
    'hub.ctaAdvancedShort': 'Avanzado',
    'hub.noteModes':
      'Principiante añade la tercera columna estilo lienzo / vista previa; Avanzado la oculta para más ancho en editor y herramientas.',
    'hub.siteName': 'CodeJump Academy',
    'hub.navAriaLabel': 'Sitio',
    'hub.skipToContent': 'Saltar al contenido',
    'hub.footerLead':
      'Puzzles visuales con bloques más lecciones guiadas y tests por lenguaje — todo en tu navegador.',

    'nav.home': 'Inicio',

    'header.tagline': 'CodeJump Academy',
    'header.title': 'Aprende código con bloques',
    'header.chapter': 'Capítulo',
    'header.xp': 'XP · Nv. {{level}}',
    'header.prevPuzzle': 'Puzzle anterior',
    'header.nextPuzzle': 'Siguiente puzzle',
    'header.puzzleOption': 'Puzzle {{num}}',
    'header.trackQuiz': 'Tests por lenguaje',
    'header.languagePractice': 'Ejercicios por lenguaje',
    'header.modeLearn': 'Bloques',
    'header.modePractice': 'Práctica',
    'header.modeToggleAria': 'Cambiar entre puzzles con bloques y práctica por lenguaje',

    'quiz.title': 'Test rápido del lenguaje',
    'quiz.pickLanguage': 'Lenguaje',
    'quiz.progress': 'Pregunta {{current}} / {{total}}',
    'quiz.check': 'Comprobar respuesta',
    'quiz.next': 'Siguiente pregunta',
    'quiz.finish': 'Ver resultados',
    'quiz.score': 'Puntuación: {{correct}} / {{total}}',
    'quiz.close': 'Cerrar',
    'quiz.noTracks':
      'En Inicio elige un lenguaje de programación (no Bloques) para desbloquear los tests de esa ruta.',
    'quiz.correct': '¡Correcto!',
    'quiz.incorrect': 'Casi…',
    'quiz.doneTitle': 'Test completado',
    'quiz.deckLabel': 'Ruta: {{track}}',
    'quiz.loading': 'Cargando…',

    'practice.title': 'Ejercicios por lenguaje',
    'practice.subtitle':
      'Lecciones guiadas con instrucciones y un paso práctico, más cinco módulos de test para el lenguaje que elegiste en Inicio. Cada idea nueva se explica antes de practicar.',
    'practice.modulesIntro': 'Toca un módulo para empezar. Al terminar verás tu puntuación.',
    'practice.moduleLabel': 'Módulo {{num}}',
    'practice.moduleButton': 'Módulo {{num}}',
    'practice.backToOverview': 'Vista de práctica',
    'practice.backToModules': 'Volver a los módulos',
    'practice.pickLanguagesOnHub':
      'Ve a Inicio y elige un lenguaje de programación (no Bloques) para ver los ejercicios de esa ruta.',
    'practice.noQuestions': 'No hay preguntas para esta selección.',

    'practice.overviewCanvasHint':
      'Son los lenguajes que marcaste en Inicio. Cada ruta usa el mismo diseño en la columna central: lecciones guiadas y módulos de test.',
    'practice.trackCounts': '{{lessons}} lecciones guiadas · {{quizzes}} módulos de test',
    'practice.paletteHintShort': 'Leyenda',
    'practice.uiLanguageAria': 'Idioma de la interfaz',
    'practice.paletteGuidedExplainer':
      'Los botones ámbar abren **lecciones guiadas**: texto, ejercicios y Ejecutar cuando toque.',
    'practice.paletteQuizExplainer':
      'Los botones violeta con borde abren los **tests por lenguaje** (cinco módulos por idioma).',
    'practice.paletteFooter': 'Todas las rutas siguen este patrón para que la práctica sea coherente.',
    'practice.langPalette.intro':
      'Cada tarjeta es un fragmento de código de esta ruta: pulsa para copiar. El ejercicio sigue en la columna central.',
    'practice.langPalette.introInsert':
      'Fragmentos de código: pulsa para insertar en el cursor o en el borrador si la lección es ordenar o test.',
    'practice.paletteCode.intro':
      'Solo los fragmentos de esta lección: pulsa una tarjeta para insertar en el cursor (el teclado no escribe letras).',
    'practice.paletteCode.introInsert':
      'Fragmentos de la lección: pulsa para insertar. Usa Retroceso para corregir; las líneas nuevas van con la tarjeta «Nueva línea».',
    'practice.langPalette.group.output': 'Salida',
    'practice.langPalette.group.variables': 'Variables',
    'practice.langPalette.group.control': 'Control de flujo',
    'practice.langPalette.group.types': 'Tipos',
    'practice.langPalette.group.data': 'Datos',
    'practice.langPalette.group.functions': 'Funciones',
    'practice.mascotTip':
      'Usa la columna central como tu espacio de trabajo: abre una tarjeta de idioma y elige lección o test.',

    'practice.quizInstructionsPanel':
      'Lee cada pregunta en el centro, elige respuesta y pulsa Comprobar. La explicación aclara la idea de esa ruta.',
    'practice.quizCanvasHint':
      'Este panel recuerda al lienzo: un objetivo claro mientras respondes.',
    'practice.quizPaletteExplainer':
      'Los tests refuerzan sintaxis y conceptos del idioma elegido. Termina el módulo para ver tu puntuación.',
    'practice.quizMascotTip': 'Un fallo también enseña — lee la explicación antes de seguir.',

    'guided.courseSection': 'Lecciones guiadas',
    'guided.courseBlurb':
      'Instrucciones + paso práctico (ordenar líneas, test rápido o **ejecutar código** en el mini laboratorio). Cuando hay una **idea nueva**, la explicamos y la relacionamos con los bloques de CodeJump cuando encaja.',
    'guided.extendedLessonHeading': 'Nueve lecciones en este módulo',
    'guided.moduleNoLessonsYet': 'Este módulo aún no tiene lecciones.',
    'guided.lessonButton': 'Lección {{num}}',
    'guided.lessonMeta': 'Lección {{current}} / {{total}}',
    'guided.newIdea': 'Idea nueva — léelo antes de programar',
    'guided.yourTurn': 'Tu turno',
    'guided.orderHint':
      'Ordena las líneas como programa ejecutable (arriba = lo primero que corre). Usa las flechas.',
    'guided.assembleLineGoal':
      'Reordena cada fragmento hasta que la vista previa sea un programa válido (primero declaras el valor, luego usas el nombre).',
    'guided.assembleLineWorkspaceHint':
      'Cada fila es un trozo de código (o un salto de línea). Usa las flechas; la vista previa verde se actualiza.',
    'guided.assembledLinePreview': 'Vista previa',
    'guided.assembledLinePreviewFragments':
      'Las barras separan cada fragmento en el orden actual; juntos forman un solo programa.',
    'guided.moveUp': 'Subir línea',
    'guided.moveDown': 'Bajar línea',
    'guided.tryReorder': 'Casi — reordena para que el programa corra de arriba abajo.',
    'guided.checkOrder': 'Comprobar orden',
    'guided.checkAnswer': 'Comprobar respuesta',
    'guided.checkOutput': 'Comprobar salida',
    'guided.checkPaletteCode': 'Comprobar programa',
    'guided.beforeYouCode': 'Antes de programar — ideas obligatorias',
    'guided.conceptCheckVariable': 'Crear variable (`const`)',
    'guided.conceptCheckRepeat': 'Repetir (bucle `for`)',
    'guided.conceptCheckDone': 'listo',
    'guided.conceptCheckPending': 'falta',
    'guided.paletteMissingVariable':
      'Tu programa debe incluir al menos una línea de **Crear variable**: una tarjeta `const nombre = …;` de la paleta.',
    'guided.paletteMissingRepeat':
      'Tu programa debe incluir **Repetir**: añade la tarjeta `for` de la paleta (como el bloque Repetir del lienzo).',
    'guided.paletteMissingBoth':
      'Aún faltan **Crear variable** (`const`) y **Repetir** (`for`) en tu programa — usa esas secciones de la paleta primero.',
    'guided.paletteRoleVariable': 'Crear variable',
    'guided.paletteRoleConsole': 'Salida',
    'guided.paletteRoleIf': 'Condición',
    'guided.paletteRoleRepeat': 'Repetir',
    'guided.paletteCodePreviewHint':
      'Tu programa va en el centro: monta las líneas solo con la paleta de la derecha.',
    'guided.paletteCodeEditorAria': 'Programa construido solo con fragmentos de la paleta',
    'guided.paletteCodeLiveCanvasTitle': 'Vista previa en vivo — tus líneas como franjas',
    'guided.paletteCodeLiveCanvasFoot':
      'Cada franja se enciende cuando esa línea coincide con el objetivo. Abre la vista grande cuando quieras desde la barra.',
    'guided.paletteCodeOpenModal': 'Vista grande',
    'guided.paletteCodeModalTitle': 'Tu programa como flujo',
    'guided.paletteCodeModalBody':
      'Este es el flujo de tres pasos que construiste. ¡Cada banda coincide con una línea de código!',
    'guided.paletteCodeModalClose': 'Entendido',
    'guided.paletteCodeModalRestart': 'Reiniciar ejercicio',
    'guided.paletteCodeCanvasHeroAria': 'Vista previa interactiva — pulsa la palabra',
    'guided.paletteCodeCanvasHeroLit': 'Bien — tu primera línea coincide. Sigue abajo.',
    'guided.paletteCodeCanvasHeroDim': 'Completa la primera línea de código abajo — esto se encenderá.',
    'guided.paletteCodeCanvasHeroTap': 'Pulsa la palabra: es lo que tu programa “dice”.',
    'guided.paletteCodeCanvasHeroCelebrate':
      '¡Lo lograste! Tu código coincide con el objetivo. Pulsa la palabra para jugar un poco.',
    'guided.paletteCodeCanvasAwait':
      'Arma tu programa en el centro y pulsa Comprobar programa. ¡Tu imagen aparece aquí cuando todas las líneas coincidan!',
    'guided.paletteCodeHeroSqlAria':
      'Embudo visual: SELECT, luego FROM, luego WHERE — igual que tus tres líneas abajo.',
    'guided.paletteCodeHeroHtmlAria':
      'Capas: etiqueta HTML, texto visible y regla CSS de color — igual que tus tres líneas abajo.',
    'guided.runHintEditor':
      'Edita el código, pulsa Ejecutar para ver la salida y Comprobar salida cuando cumpla el objetivo.',
    'guided.scratchTitle': 'Borrador de fragmentos',
    'guided.scratchHint':
      'Pulsa la paleta para insertar fragmentos aquí — útil mientras ordenas líneas o eliges respuesta.',
    'guided.pythonFirstLoad': 'La primera vez que ejecutas Python se descarga el motor; puede tardar un poco.',
    'guided.nice': '¡Muy bien!',
    'guided.lessonDone': 'Lección completada.',
    'guided.missingLesson': 'No se pudo cargar esta lección.',
    'guided.moreCoursesSoon': 'Seguiremos ampliando lecciones guiadas; los tests rápidos siguen en todas las rutas.',
    'guided.nextLesson': 'Siguiente lección',
    'guided.prevLesson': 'Lección anterior',
    'guided.navLesson': 'Lección',
    'guided.navChapter': 'Capítulo',
    'guided.chapterLessonsRange': 'Lecciones {{from}}–{{to}}',
    'guided.advancedNavAria': 'Navegación de lección y capítulo',
    'guided.lessonTools': 'Herramientas de la lección',
    'guided.goalHeading': 'Objetivo',
    'guided.resultPreview': 'Vista previa del resultado',
    'guided.canvasBlocksAnalog':
      'La misma idea que en Bloques: pintar, huecos, nueva fila, variables y Repetir — no solo drawBox.',
    'guided.canvasRealGoal': 'Objetivo en el lienzo',
    'guided.canvasGoalPreview': 'Meta visual (vista previa)',
    'guided.previewPlaceholder':
      'La salida de Ejecutar aparece aquí — la misma idea que ver el lienzo actualizarse al pulsar Ejecutar en bloques.',
    'guided.previewExerciseHint':
      'Usa el panel central para reordenar líneas o responder. Si la lección tiene código ejecutable, Ejecutar muestra la salida aquí.',
    'guided.resetExercise': 'Limpiar',
    'guided.resetOutput': 'Borrar salida',
    'guided.expectedFragments': 'Tu salida debe incluir:',
    'guided.expectFragmentsExplainer':
      'Después de Ejecutar, leemos todo lo que aparece en la caja de salida junto con el texto de error, si lo hay. Los fragmentos de abajo son tu lista: para que Comprobar salida funcione, cada fragmento debe aparecer en algún sitio de ese texto combinado (salvo que la lección diga otra cosa). En lecciones posteriores suele haber más fragmentos en la lista a medida que el objetivo crece.',
    'guided.paletteSnippetsExplainer':
      'Los fragmentos de abajo son las únicas piezas que puedes insertar desde la paleta. Pulsa las tarjetas y arma tu programa línea a línea hasta que coincida con el objetivo al comprobar. En lecciones más largas verás más filas aquí cuando entren nombres, literales o líneas nuevas.',
    'guided.goalOrderLinesExplainer':
      'Cada fila es una línea de código completa. Reordena hasta que el programa tenga sentido de arriba abajo al ejecutarse.',
    'guided.goalAssembleExplainer':
      'Cada fila es un token pequeño (palabra o signo). Reordena hasta que, al leerlos en orden, formen una línea de código válida.',
    'guided.goalStripeExplainer':
      'Cada franja es un paso en la historia del programa. Reordena hasta que el flujo coincida con cómo debería ejecutarse el código.',
    'guided.goalPickOneExplainer':
      'Lee bien la pregunta y elige la respuesta que encaje con la idea que la lección está comprobando.',
    'guided.hintButton': 'Pista',
    'guided.hintButtonAria': 'Mostrar u ocultar una pista para este paso',
    'guided.runCodeParsonsWorkspaceHint':
      'Reordena las líneas (arriba = primero en ejecutarse). Pulsa Ejecutar y luego Comprobar salida — tu programa son solo estas filas.',
    'guided.orderLinesManualHint':
      'Consejo: lee cada línea como una frase. Las declaraciones y preparación suelen ir antes de las líneas que usan esos nombres o resultados.',
    'guided.mascotTip': 'El orden importa: las líneas corren de arriba abajo, igual que las sentencias en código real.',
    'guided.goalPickOne': 'Elige la opción que encaje mejor con la pregunta.',
    'practice.modeBeginner': 'Principiante',
    'practice.modeAdvanced': 'Avanzado',
    'practice.modeBeginnerHint': 'Columna tipo lienzo + vista previa activada.',
    'practice.modeAdvancedHint': 'Más espacio — sin columna de vista previa.',
    'practice.cornerInstructions': 'Empieza leyendo el panel de instrucciones.',
    'practice.cornerWorkspace': 'Lecciones guiadas y tests en el centro.',
    'practice.cornerPalette': 'Objetivos y notas a la derecha.',
    'practice.cornerTip': 'Elige modo por idioma — se guarda en este dispositivo.',
    'guided.stripeGoalCaption': 'Este es el orden objetivo de la “bandera” — iguálalo en la columna central.',
    'guided.stripeReorderHint':
      'Reordena las franjas (arriba = primero en el flujo). Usa las flechas; lee el papel de cada franja en herramientas →',
    'guided.moveStripeUp': 'Subir franja',
    'guided.moveStripeDown': 'Bajar franja',

    'footer.line':
      'CodeJump Academy · React + Vite + Tailwind + Ant Design · por Ethan Javien Casilla',

    'workspace.instructions': 'Instrucciones',
    'workspace.canvas': 'Lienzo',
    'workspace.yourCode': 'Tu código',
    'workspace.clear': 'Limpiar',
    'workspace.resetCanvas': 'Lienzo',
    'workspace.run': 'Ejecutar',
    'workspace.palette': 'Paleta',
    'workspace.paletteHint': 'Clic en Repetir para anidar',
    'workspace.activeContainer': 'Contenedor activo',
    'workspace.root': 'Raíz',
    'workspace.repeatWith': 'Repetir {{label}}',
    'workspace.destination': 'Destino:',
    'workspace.mainProgram': 'Programa principal',
    'workspace.paletteOnlyEditor': 'Solo inserciones de paleta — usa las tarjetas de la derecha',
    'workspace.insideRepeat': 'Dentro del Repetir (volver a raíz)',
    'workspace.canvasHint':
      'Rayado en la meta = hueco sin pintar. Usa {{skip}} para avanzar sin color.',
    'workspace.skipToken': 'skip()',
    'workspace.programProblem': 'Tu programa tiene un problema',
    'workspace.rowCol': 'Fila {{row}}, col {{col}}',

    'palette.groupActions': 'Acciones',
    'palette.groupControl': 'Control',
    'palette.groupValues': 'Valores',
    'palette.newLine.desc': 'Salta a la siguiente fila',
    'palette.skip.desc': 'Avanza sin pintar (celda en blanco)',
    'palette.repeat.desc': 'Repite los bloques internos',
    'palette.varDecl.desc': 'Guarda un número para usarlo en Repetir',
    'palette.drawBox.desc': 'Pinta la celda actual de {{color}}',

    'blocks.segmentNumber': 'Número',
    'blocks.segmentVariable': 'Variable',
    'blocks.varKeyword': 'variable',
    'blocks.varOptionsHint': 'Nombres — arrastra al hueco o toca',
    'blocks.varDropTarget': 'Suelta el nombre aquí',
    'blocks.deleteBlock': 'Eliminar bloque',
    'blocks.repeatEmpty':
      'Selecciona este Repetir y añade bloques desde la paleta.',
    'blocks.emptyTitle': 'Tu código aparecerá aquí',
    'blocks.emptyBody':
      'Arrastra desde la paleta o haz clic para construir. Las variables declaradas van al pie del programa; dentro de Repetir puedes repetir usando un número o un nombre de variable definido arriba.',

    'visual.targetPattern': 'Patrón objetivo',
    'visual.paintOrder': 'Orden al pintar (como el cursor)',
    'visual.unpaintedCell': 'Sin pintar',

    'difficulty.easy': 'Fácil',
    'difficulty.normal': 'Normal',
    'difficulty.hard': 'Avanzado',

    'color.red': 'Rojo',
    'color.orange': 'Naranja',
    'color.yellow': 'Amarillo',
    'color.green': 'Verde',
    'color.blue': 'Azul',
    'color.indigo': 'Índigo',
    'color.purple': 'Morado',

    'modal.winTitle': '¡Desafío superado!',
    'modal.winBody':
      'Tu pintura coincide con el objetivo. Sigue con el siguiente puzzle cuando quieras.',
    'modal.almostTitle': 'Casi lo tienes',
    'modal.tipTitle': 'Consejo',
    'modal.tipBody': 'Ejecuta mentalmente el código fila a fila.',
    'modal.failLead':
      'Compara tu lienzo con el patrón: cada {{drawBox}} pinta y avanza; usa {{skip}} para dejar una celda en blanco sin pintar.',
    'modal.keepPracticing': 'Seguir practicando',
    'modal.retryLevel': 'Reintentar este nivel',
    'modal.nextPuzzle': 'Siguiente puzzle',
    'modal.newChallengeXp': 'Nuevo reto + XP',

    'mascot.flattenError':
      'Tu código tiene un problema: revisa variables y bloques.',
    'mascot.win3': '¡Tres estrellas! ¡Primer intento y código compacto!',
    'mascot.win2': '¡Dos estrellas! Buen uso de bloques.',
    'mascot.win1': '¡Una estrella! Nivel completado.',
    'mascot.fail':
      '¡Casi! Prueba otro orden o revisa los saltos de línea.',
    'mascot.tip.default':
      'El orden importa: los bloques se ejecutan de arriba abajo, como las instrucciones reales.',
    'mascot.tip.javascript':
      'Las secuencias cortas aquí recuerdan cómo JavaScript ejecuta una instrucción tras otra.',
    'mascot.tip.typescript':
      'Dibuja la lógica visual primero; TypeScript luego te ayudará a detectar errores antes.',
    'mascot.tip.python':
      'La sangría y el orden importan—igual que en un Python legible.',
    'mascot.tip.java':
      'Piensa en pasos claros; las clases y métodos en Java quieren flujos predecibles.',
    'mascot.tip.csharp':
      'Los flujos ordenados se traducen bien a métodos y tuberías estilo LINQ.',
    'mascot.tip.cpp':
      'La mentalidad RAII empieza por un orden disciplinado—como recorrer estos bloques.',
    'mascot.tip.c_lang':
      'Alto o bajo nivel, el programa sigue un orden—piénsalo en el lienzo.',
    'mascot.tip.go':
      'Las goroutines nacen de pasos ordenados—practica la secuencia aquí.',
    'mascot.tip.rust':
      'La propiedad son movimientos claros; alinear bloques entrena ese orden.',
    'mascot.tip.swift':
      'Con SwiftUI o no, el orden de ejecución manda—como en estos puzzles.',
    'mascot.tip.kotlin':
      'Las cadenas legibles empiezan con pasos sencillos—constrúyelos en visual primero.',
    'mascot.tip.ruby':
      'Ruby es expresivo pero ejecuta línea a línea—siente el ritmo con bloques.',
    'mascot.tip.php':
      'Las peticiones se vuelven scripts de arriba abajo—la misma historia que este lienzo.',
    'mascot.tip.sql':
      'Las consultas son declarativas, pero el orden de bloques entrena la lógica.',
    'mascot.tip.html_css':
      'Los layouts son árboles—los bloques anidados recuerdan etiquetas y flex/grid.',
    'mascot.tip.dart':
      'Los árboles de widgets empiezan componiendo en orden—practica anidar Repetir.',
    'mascot.tip.lua':
      'Los scripts ligeros siguen pasos—recorre la cuadrícula como un chunk de Lua.',
    'mascot.tip.shell_bash':
      'Las tuberías son comandos ordenados—la misma disciplina que apilar bloques.',
    'mascot.tip.r_lang':
      'Los vectores avanzan elemento a elemento—la intuición de secuencia empieza aquí.',
    'mascot.tip.scala':
      'Las tuberías funcionales empiezan con transformaciones ordenadas—calienta en la cuadrícula.',
    'mascot.tip.elixir':
      'El paso de mensajes sigue pasos deterministas—practica el orden.',
    'mascot.tip.haskell':
      'Hasta los programas puros se componen paso a paso—siente el orden en el lienzo.',

    'chapterTitle.fallback': 'Lección',
  },
}
