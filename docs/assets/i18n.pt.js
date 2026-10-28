window.FP_I18N = window.FP_I18N || {};

window.FP_I18N.pt = {
  "meta.title": "fixed-precision — conta exata, sem float",
  "meta.desc": "Decimal de ponto fixo com bigint: 0 a 20 casas, nove " +
    "modos de arredondamento e contexto imutável. Duas APIs, zero " +
    "dependências de runtime.",

  "skip": "pular para o conteúdo",
  "nav.aria": "navegação principal",
  "nav.why": "por quê",
  "nav.lab": "arredondar",
  "nav.features": "recursos",
  "nav.fns": "funcional",
  "nav.core": "núcleo",
  "nav.install": "instalar",

  "ui.copy": "copiar",
  "ui.copied": "copiado",
  "ui.copyfail": "falhou",
  "ui.copycmd": "copiar comando",
  "ui.copycode": "copiar código",

  "hero.eyebrow": "<b>//</b> decimal de ponto fixo · bigint · duas APIs",
  "hero.h1a": "CONTA EXATA,",
  "hero.h1b": 'sem <em class="serif">float</em>.',
  "hero.sub": "Cada decimal é um <b>bigint escalado</b>: de 0 a 20 casas, " +
    "nove modos de arredondamento e contexto imutável. Sem " +
    "<code>0.30000000000000004</code> no meio do caminho — e sem " +
    "dependência de runtime.",
  "hero.l1": "ver o código ↗",
  "hero.l2": "testar o arredondamento ↓",
  "hero.l3": "API funcional ↘",
  "hero.l4": "instalar ↘",
  "hero.m2": "zero dependências",
  "hero.m3": "8 casas padrão",
  "hero.m4": "9 modos",
  "hero.m6": "119 subcaminhos",

  "term.title": "node — fixed-precision",
  "term.replay": "↻ replay",
  "term.aria": "sessão de exemplo",
  "term.meta": "local · Money = create({ places: 2 })",
  "noscript.term": "Ative o JavaScript para ver a sessão animada e o " +
    "laboratório. O resto da página funciona sem ele.",

  "mq": "0.1 + 0.2 = 0.3 <i>·</i> 0–20 CASAS <i>·</i> 9 MODOS <i>·</i> " +
    "BIGINT ESCALADO <i>·</i> ZERO DEPS <i>·</i> ESM + CJS <i>·</i> MIT " +
    "<i>·</i> TREE-SHAKEABLE <i>·</i> 119 SUBCAMINHOS <i>·</i> ",

  "why.label": "<b>§ 01</b> — por quê",
  "why.h2": 'O float mente em <em class="serif">silêncio.</em>',
  "diff.bar": "fluxo — antes / depois",
  "why.i1.h3": "0.1 + 0.2 = <em>0.3</em>",
  "why.i1.p": "Em binário, 0.1 e 0.2 não têm representação finita. O " +
    "fixed-precision soma inteiros escalados: com 8 casas, <code>1.23</code> " +
    "vira <code>123000000</code>. O resultado é o número que você escreveu.",
  "why.i2.h3": "contexto <em>explícito</em>",
  "why.i2.p": "Casas e modo de arredondamento fazem parte do valor. " +
    "<code>create({ places: 2 })</code> congela um contexto imutável. A API " +
    "de classes recusa misturar precisões; a funcional resolve pelo maior " +
    "<code>places</code>.",
  "why.i3.h3": "um núcleo, <em>duas APIs</em>",
  "why.i3.p": "<code>fixed-precision</code> para encadeamento e classes. " +
    "<code>fixed-precision-fns</code> para funções puras, com um subcaminho " +
    "por operação. As duas usam o mesmo código de valor.",

  "steps.label": "<b>§ 02</b> — primeiros passos",
  "steps.h2": 'Três passos até a <em class="serif">conta fechar.</em>',
  "step1.h3": "Instale",
  "step1.p": "Um pacote, sem dependências de runtime. A API funcional é um " +
    "segundo pacote, opcional.",
  "step2.h3": "Congele um contexto",
  "step2.p": "Para dinheiro, uma factory imutável: duas casas e o modo que " +
    "você escolher. O padrão é <code>places: 8</code> e <code>HALF_UP</code>.",
  "step3.h3": "Opere",
  "step3.p": "Métodos aceitam <code>string</code>, <code>number</code>, " +
    "<code>bigint</code> ou outra instância. Encadeie sem instanciar cada " +
    "operando.",

  "features.label": "<b>§ 03</b> — recursos",
  "features.h2": 'Construído como ferramenta de ' +
    '<em class="serif">precisão.</em>',
  "f1.k": "places 0–20",
  "f1": "A escala é explícita e limitada. " +
    "<code>new FixedPrecision(\"1.23\")</code> guarda <code>123000000</code> " +
    "com 8 casas; <code>create({ places: 2 })</code> guarda <code>123</code>.",
  "f2.k": "9 modos",
  "f2": "<code>ROUND_UP</code>, <code>ROUND_DOWN</code>, " +
    "<code>ROUND_CEIL</code>, <code>ROUND_FLOOR</code>, " +
    "<code>ROUND_HALF_UP</code>, <code>ROUND_HALF_DOWN</code>, " +
    "<code>ROUND_HALF_EVEN</code>, <code>ROUND_HALF_CEIL</code> e " +
    "<code>ROUND_HALF_FLOOR</code>. O padrão é <code>HALF_UP</code> (4).",
  "f3": "Factories imutáveis: " +
    "<code>create({ places: 2, roundingMode: 6 })</code> congela o contexto. " +
    "Mudar o padrão global depois não altera a factory.",
  "f4": "A entrada enxuta: criação, aritmética, comparação, arredondamento, " +
    "<code>sqrt</code>, estatística básica e formatação comum. Fora ficam " +
    "trigonometria, logs, matrizes, frações, bitwise e combinatória.",
  "f5": "Um subcaminho por operação em <code>fixed-precision-fns</code>. " +
    "<code>import { add } from \"fixed-precision-fns/add\"</code> puxa só o " +
    "grafo de <code>add</code>: 3,06 kB minificados e 1,24 kB gzip.",
  "f6": "<code>pipe</code>, <code>compose</code> e <code>partial</code> " +
    "compõem estágios tipados de ponta a ponta. As " +
    "variantes <code>*By</code> fazem o mesmo bind com nome próprio.",
  "f7": "Operações escaladas (<code>add</code>, <code>mul</code>) validam o " +
    "contexto. As raw (<code>plus</code>, <code>times</code>) operam " +
    "direto no bigint. Use raw quando a escala já é conhecida.",
  "f8": "O valor interno é um bigint. <code>raw()</code> devolve o inteiro " +
    "escalado. Um bigint na entrada é tratado como já escalado — veja o " +
    "aviso no § 06.",
  "f9": "<code>sin</code>, <code>cos</code>, <code>tan</code>, " +
    "<code>sec</code>, <code>csc</code>, <code>cot</code>, as inversas, as " +
    "hiperbólicas e as inversas hiperbólicas, com <code>atan2</code>. A " +
    "precisão é medida contra referências de 45 dígitos.",
  "f10": "Nenhuma dependência de runtime. ESM + CJS + tipos TypeScript, " +
    "<code>sideEffects: false</code> e builds minificados.",
  "f11.k": "imutável",
  "f11": "Toda operação devolve um valor novo. Instâncias não mudam; " +
    "contexto e escala fazem parte do valor.",
  "f12": "Licença MIT nos dois pacotes. Embuta em produto fechado, sem taxa " +
    "e sem pegadinha.",

  "lab.label": "<b>§ 04</b> — laboratório",
  "lab.h2": 'Nove modos, <em class="serif">um resultado.</em>',
  "lab.lead": "Digite um valor e escolha as casas. A tabela roda o build " +
    "real do <code>fixed-precision</code> nesta aba, com bigint e nenhuma " +
    "chamada de rede.",
  "lab.title": "arredondamento ao vivo",
  "lab.status": "local · bigint",
  "lab.value": "valor",
  "lab.places": "casas",
  "lab.presets": "valores de exemplo",
  "lab.caption": "Resultado de cada modo de arredondamento para o valor e as " +
    "casas escolhidos.",
  "lab.mode": "modo",
  "lab.code": "código",
  "lab.result": "resultado",
  "lab.inside": "por dentro",
  "lab.raw": "bigint (20 casas)",
  "lab.scale": "escala",
  "lab.floatnote": "O <code>Number</code> decide no binário antes de " +
    "arredondar. O binário não guarda a maioria dos decimais exatamente, " +
    "então o resultado pode ser outro. A biblioteca decide no decimal.",
  "lab.note": "O bigint mostrado usa 20 casas para não perder dígitos antes " +
    "do arredondamento (<code>P20</code>). O resultado da tabela é " +
    "<code>scale(places, modo)</code> seguido de <code>toFixed(places)</code>.",
  "lab.invalid": "Valor inválido. Use um decimal como <code>2.675</code> " +
    "(sem expoente).",
  "lab.unavailable": "O build local da biblioteca não carregou. Verifique " +
    "<code>docs/assets/fixed-precision.js</code>.",

  "mode.up": "afasta do zero",
  "mode.down": "em direção ao zero",
  "mode.ceil": "em direção a +∞",
  "mode.floor": "em direção a −∞",
  "mode.halfup": "metade para longe do zero",
  "mode.halfdown": "metade para o zero",
  "mode.halfeven": "metade para o par",
  "mode.halfceil": "metade para +∞",
  "mode.halffloor": "metade para −∞",

  "fns.label": "<b>§ 05</b> — funcional",
  "fns.h2": 'Uma função, <em class="serif">um subcaminho.</em>',
  "fns.alt": "ou <code>npm add fixed-precision-fns</code> — a camada " +
    "funcional é um pacote separado, sem dependências de runtime.",
  "fns.groups.h": "119 subcaminhos",
  "fns.groups": "<code>aritmética</code> · <code>relação</code> · " +
    "<code>trigonometria</code> · <code>strings</code> · <code>lógica</code> " +
    "· <code>combinatória</code> · <code>estatística</code> · " +
    "<code>matrizes</code> · <code>frações</code> · <code>bitwise</code> · " +
    "<code>constantes</code> · <code>composição</code>",
  "fns.k1.h3": "sem configure()",
  "fns.k1.p": "A API funcional não tem estado global mutável. O contexto " +
    "padrão é congelado em 8 casas e HALF_UP; o contexto vem dos operandos, " +
    "não do ambiente.",
  "fns.k2.h3": "dados, não classes",
  "fns.k2.p": "As operações de valor devolvem dados simples — " +
    "<code>{ ctx, value }</code> ou um primitivo. Nada de protótipo, cache " +
    "global ou ordem de import. A ponte com a API de classes é " +
    "<code>dataOf</code>.",
  "fns.k3.h3": "tree-shaking medido",
  "fns.k3.p": "Um entry por operação e <code>sideEffects: false</code>. O " +
    "barrel também poda: <code>import { add }</code> fica em 3,06 kB min / " +
    "1,24 kB gzip. O orçamento é um teste em CI.",

  "core.label": "<b>§ 06</b> — núcleo",
  "core.h2": 'O valor é um <em class="serif">inteiro.</em>',
  "core.lead": "Com 8 casas, <code>1.23</code> é <code>123000000n</code>. " +
    "Somar é somar inteiros; dividir escala de volta. Nada de mantissa " +
    "binária.",
  "core.card1.h3": "escala",
  "core.card1.p": "<code>places</code> define a escala, de 0 a 20. " +
    "<code>SCALE = 10^places</code>. O valor bruto é sempre bigint.",
  "core.card2.h3": "contexto",
  "core.card2.p": "<code>{ places, roundingMode, SCALE, SCALENUMBER }" +
    "</code>. O contexto acompanha o valor; factories o congelam.",
  "core.card3.h3": "escalado × raw",
  "core.card3.p": "<code>add</code>/<code>mul</code> validam e escalam. " +
    "<code>plus</code>/<code>times</code> pulam a validação e operam no " +
    "inteiro. Escolha raw só quando souber a escala.",
  "core.warn.h": "bigint é pré-escalado",
  "core.warn.p": "<code>new FixedPrecision(123n)</code> não é " +
    "<code>123</code>. Com 8 casas, é <code>0.00000123</code>. Use " +
    "<code>string</code> ou " +
    "<code>number</code> para valores literais; reserve bigint para valores " +
    "já escalados.",
  "core.warn.link": "leia o aviso completo ↗",

  "precision.label": "<b>§ 07</b> — precisão",
  "precision.h2": 'Medida, não <em class="serif">prometida.</em>',
  "precision.th1": "cenário",
  "precision.th2": "medida",
  "precision.r1.k": "trigonometria · ângulos genéricos",
  "precision.r1.v": "≤ 2 ULP · 7/16/18 casas",
  "precision.r2.k": "tan/cot/sec/csc · quadrantes reflexos",
  "precision.r2.v": "≤ 15 ULP",
  "precision.r3.k": "referência de comparação",
  "precision.r3.v": "45 dígitos · Python Decimal",
  "precision.r4.k": "add via barrel · esbuild min",
  "precision.r4.v": "3,06 kB",
  "precision.r5.k": "add via barrel · gzip",
  "precision.r5.v": "1,24 kB",
  "precision.r6.k": "dependências de runtime",
  "precision.r6.v": "0",
  "precision.note": "Fonte: <code>packages/core/docs/precision.md</code> · " +
    "orçamento de tamanho em <code>test/tree-shaking.test.ts</code>.",
  "precision.ulp.h": "o que é ULP",
  "precision.ulp.p": "ULP aqui é uma unidade na última casa decimal " +
    "(<code>10^-places</code>), não um bit. Em ângulos genéricos, a " +
    "trigonometria fica a duas unidades da referência.",
  "precision.ci.h": "fixado no CI",
  "precision.ci.p": "O teste de tree-shaking falha se o grafo de " +
    "<code>add</code> passar do orçamento. O CI roda lint, formato, testes, " +
    "build e a checagem de exports.",

  "install.label": "<b>§ 08</b> — instalar",
  "install.h2": 'Uma linha e <em class="serif">exata.</em>',
  "install.alt": "ou <code>npm add fixed-precision</code> — e " +
    "<code>npm install fixed-precision-fns</code> para a camada funcional.",
  "install.pkgs.h": "dois pacotes",
  "install.pkg1": "classes, ./minimal, tipos",
  "install.pkg2": "funcional, 119 subcaminhos, zero deps",
  "install.req.h": "roda em",
  "install.req.p": "Node, Bun e navegadores modernos. <code>BigInt</code> é " +
    "nativo; não há polyfill.",
  "install.req.p2": "Sem chave, sem serviço, sem chamada de rede. O " +
    "laboratório desta página roda o mesmo build local.",
  "install.doc.h": "documentação",
  "install.doc.p": '<a href="https://github.com/naoeosavio/fixed-precision/' +
    'blob/main/packages/core/README.md" target="_blank" rel="noopener">' +
    "core README</a> · " +
    '<a href="https://github.com/naoeosavio/fixed-precision/blob/main/' +
    'packages/fp/README.md" target="_blank" rel="noopener">fns README</a> · ' +
    '<a href="https://github.com/naoeosavio/fixed-precision/blob/main/' +
    'packages/core/MIGRATION.md" target="_blank" rel="noopener">migração</a>',

  "cta.h2": 'A próxima conta <em class="serif">fecha.</em>',
  "cta.p": "Dois pacotes MIT, zero dependências de runtime e 119 " +
    "subcaminhos. Para dinheiro, imposto, desconto e qualquer número que não " +
    "pode errar no centavo.",

  "foot.l": "naoeosavio — fixed-precision é MIT; esta página é a vitrine.",
  "foot.r": '<a href="https://github.com/naoeosavio/fixed-precision" ' +
    'target="_blank" rel="noopener">repo</a> · ' +
    '<a href="https://github.com/naoeosavio/fixed-precision/issues" ' +
    'target="_blank" rel="noopener">issues</a> · ' +
    '<a href="https://www.npmjs.com/package/fixed-precision" ' +
    'target="_blank" rel="noopener">npm</a> · ' +
    '<a href="https://github.com/naoeosavio/fixed-precision/tree/main/' +
    'packages/core/docs" target="_blank" rel="noopener">docs</a> · MIT',

  "sb.mode": "modo",
  "sb.exact": "EXATO",
};
