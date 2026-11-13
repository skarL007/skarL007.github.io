# Lodeward: página de projeto, 13 de novembro de 2026

Esta atualização substitui a apresentação em fichas por uma página editorial com uma cena original em Three.js. A identidade continua sendo Lodeward. O nome anterior, SynapseEngine, aparece apenas para explicar a continuidade técnica.

## Referências consultadas

- [Igloo Inc, por abeto — estudo de caso no Awwwards](https://www.awwwards.com/igloo-inc-case-study.html): objeto central, narrativa por etapas e ajuste do movimento diretamente no navegador. A referência orientou o método; nenhum modelo, textura ou código do projeto foi reutilizado.
- [Lusion — apresentação do estúdio](https://lusion.co/about/): relação entre tipografia de grande escala, espaço e trabalho tridimensional. O estúdio descreve sua atuação em movimento, 3D e tecnologia. A página do Lodeward não alega premiação ou associação com o estúdio.
- [Documentação do Three.js](https://threejs.org/docs/): implementação da cena. A biblioteca está fixada em 0.169.0, versão já usada no portfólio, e servida localmente com sua licença MIT.

## Implementação

Quatro molduras ao redor de um núcleo representam os pontos de decisão do workflow. O modelo é procedural, sem arquivos 3D externos. A interface explica verificação de comandos, quarentena, revisão humana e recuperação de contexto. Ela não executa comandos nem acessa memória real.

O texto permanece em HTML. Sem WebGL, aparece uma ilustração estática. Sem JavaScript, as quatro explicações ficam visíveis. O movimento respeita a preferência do sistema, pode ser pausado e para quando a cena sai da tela ou a aba fica oculta. A densidade de pixels é limitada a 1,5.

## Validação da página

Nove cenários aprovados no Edge com Playwright: português e inglês em 375, 800 e 1440 pixels; ausência de WebGL; JavaScript desativado; pausa, retomada e suspensão fora da tela.

Foram conferidos navegação por teclado, alternância das quatro etapas, destinos das âncoras, ausência de rolagem horizontal e erros de JavaScript. A varredura axe de WCAG 2 A/AA e 2.1 AA não encontrou violações nos seis cenários de idioma e largura. As capturas do hero e do workflow foram inspecionadas. A verificação automática não substitui um teste com leitor de tela ou testes em Safari e Firefox.

## Alegações e escopo

As cifras da página continuam identificadas como históricas, vinculadas ao commit `aec177d0` e aos protocolos de 9–10 de novembro. A fonte é [o registro de atualização anterior](lodeward-atualizacao-2026-11-10.md). O desenho e seus testes não mudam o nível N1 do produto nem comprovam ganho de recuperação ou economia em sessões longas.

A página mantém os resultados negativos e a lista de critérios ainda sem fechamento integral. A prova de compatibilidade do rename, a validação da interface e a avaliação completa do produto são evidências diferentes.
