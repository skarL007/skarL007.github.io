# Lodeward: página de projeto, 13 de novembro de 2026

O cérebro tridimensional e suas sinapses representam a memória e os pontos de decisão do Lodeward. As quatro etapas — verificar, colocar em quarentena, aprovar e recuperar memória — têm controles em HTML e explicações próprias. A identidade continua sendo Lodeward.

## Referências consultadas

- [Brain.space / TOMMY&YOU, no Awwwards](https://www.awwwards.com/sites/brain-space): relação entre neurociência, dados e formas orgânicas. A página do prêmio e o site foram abertos e inspecionados.
- [Interação pelo cursor, Brain.space](https://www.awwwards.com/inspiration/mouse-interaction-brain-space): movimento discreto como resposta à exploração.
- [Hero da página de tecnologia, Brain.space](https://www.awwwards.com/inspiration/hero-technology-page-brain-space): presença do objeto orgânico, espaço negativo e hierarquia tipográfica. Os dois registros de inspiração foram verificados no navegador com resposta HTTP 200.
- [Estudo de caso do estúdio TOMMY&YOU](https://www.tommyandyou.com/brain-space/): aproximação entre forma humana e precisão dos dados. A página do Lodeward não alega premiação ou associação com o estúdio, nem reutiliza seus modelos.
- [Documentação do Three.js](https://threejs.org/docs/): implementação da cena. A biblioteca está fixada em 0.169.0, versão já usada no portfólio, e servida localmente com sua licença MIT.

## Implementação

O cérebro usa geometria de BodyParts3D 4.0, convertida por OrganUI e adaptada para esta apresentação. A licença do modelo é CC BY 4.0, separada da licença do código. [Créditos, hashes e alterações](../assets/lodeward/BRAIN-LICENSE.md).

A adaptação conserva oito lobos cerebrais, mesencéfalo, ponte, medula e cerebelo. As coordenadas foram quantizadas e os materiais substituídos. O arquivo comprimido da geometria tem 1.238.571 bytes. Sinapses, pulsos e marcadores do workflow foram acrescentados para explicar o software. Não representam atividade cerebral medida ou telemetria do Lodeward.

A seleção de uma etapa destaca suas conexões e troca a explicação correspondente. A seção de interface mostra uma captura histórica real do workflow, identificada como tal, sem apresentá-la como execução ao vivo.

O texto permanece em HTML. Sem WebGL, com falha do modelo ou após perda do contexto gráfico, aparece uma ilustração estática. Sem JavaScript, as quatro explicações ficam visíveis e os controles exclusivos do 3D ficam ocultos. O movimento respeita a preferência do sistema, pode ser pausado e para quando a cena sai da tela ou a aba fica oculta. A densidade de pixels é limitada a 1,5.

## Validação da página

Dezesseis cenários no Edge com Playwright: português e inglês em 375, 800 e 1440 pixels; ausência de WebGL; JavaScript desativado; pausa, retomada e suspensão fora da tela. Os sete cenários adicionais cobrem controles do cérebro em 320, 390, 1024 e 1920 pixels, falha do modelo, perda do contexto WebGL e ausência de controles inertes sem JavaScript.

Foram conferidos navegação por teclado, alternância das quatro etapas, destinos das âncoras, ausência de rolagem horizontal e erros de JavaScript. A varredura axe de WCAG 2 A/AA e 2.1 AA não encontrou violações nos seis cenários de idioma e largura. Foram corrigidos o contraste do workflow, o foco da região com rolagem horizontal e a interceptação de cliques em largura intermediária. Os relatórios locais são `experience-qa.json` e `brain-extra-qa.json`, em `F:/bench-evidence/lodeward-install-2026-11-13`.

As capturas do hero e do workflow foram inspecionadas. A verificação automática não substitui testes com leitor de tela, Safari, Firefox ou aparelhos físicos. Os testes da página não comprovam a prontidão do motor.

## Alegações e escopo

As cifras da página continuam identificadas como históricas, vinculadas ao commit `aec177d0` e aos protocolos de 9–10 de novembro. A fonte é [o registro de atualização anterior](lodeward-atualizacao-2026-11-10.md). O desenho e seus testes não mudam o nível N1 do produto nem comprovam ganho de recuperação ou economia em sessões longas.

A página mantém os resultados negativos e a lista de critérios ainda sem fechamento integral. A prova de compatibilidade do rename, a validação da interface e a avaliação completa do produto são evidências diferentes.
