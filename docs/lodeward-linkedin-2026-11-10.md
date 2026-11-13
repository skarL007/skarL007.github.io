# Lodeward: rascunho LinkedIn de 10/11/2026

Versão preparada para revisão pré-publicação do dono em 10/11/2026. Este registro descreve o estado naquela data; não registra autorizações ou publicações posteriores. As fontes e os limites estão após as duas versões; não precisam acompanhar o texto do post.

## Português

Uma lição errada pode virar contexto para a próxima decisão de um agente de código. Eu queria conseguir revisar essa lição antes de ela ser usada.

É um dos problemas que estou trabalhando no Lodeward, um servidor MCP com hooks em Rust para agentes de código no Claude Code.

O fluxo é explícito: o agente propõe uma lição, ela entra em quarentena, e o dono decide se aprova. A lição aprovada fica disponível à recuperação.

Propostas que alteram arquivos têm um fluxo separado: aprovação e aplicação são passos distintos. O rollback da proposta restaura os bytes e o SHA-256 anteriores; esse fluxo não foi revalidado na rodada de hoje.

Na demonstração local de 10/11/2026, com o binário aec177d0, duas lições artificiais ficaram invisíveis enquanto pendentes. Depois de aprovar uma e rejeitar outra pela CLI, um novo processo MCP recuperou só a aprovada no projeto alpha, e nenhuma no beta. A busca de observações também respeitou o projeto nos casos Alpha/Beta testados.

Isso demonstra o mecanismo nesses casos, com dados artificiais. Não houve chamada a LLM nem credencial real. A execução não prova melhora do agente, segurança ao vivo ou isolamento universal.

A página também mostra o que não deu certo. A recuperação ficou em empate com BM25. A economia em sessão longa não foi demonstrada. A rodada ao vivo de segurança foi abortada nas duas tentativas registradas.

A comparação A/B da compactação ainda não rodou. Ela é uma medição pendente, separada do benchmark de sessão longa.

Neste registro de 10/11/2026, o nível formal permanece N1, protótipo, pela avaliação de 09/11/2026. A validação local em aec177d0 conferiu o executável lodeward e o alias synapse. O repositório é privado; essa prova não representa release pública nem prontidão do produto.

Página com medições e limites: https://skarl007.github.io/lodeward/

#mcp #agentesdeia #rust #engenhariadesoftware

## English

A wrong lesson can become context for a coding agent's next decision. I wanted to review that lesson before it was used.

That is one of the problems I am working on with Lodeward, an MCP server with Rust hooks for coding agents on Claude Code.

The flow is explicit: the agent proposes a lesson, it goes into quarantine, and the owner decides whether to approve it. An approved lesson becomes available to retrieval.

Proposals that change files have a separate flow: approval and application are distinct steps. Rolling back a proposal restores the previous bytes and SHA-256; that flow was not revalidated in today's round.

In the local demonstration of 10 Nov 2026, using binary aec177d0, two artificial lessons were invisible while pending. After approving one and rejecting the other through the CLI, a new MCP process retrieved only the approved lesson in project alpha, and none in beta. Observation search also respected the project in the Alpha/Beta cases tested.

That demonstrates the mechanism in these cases, using artificial data. There was no LLM call or real credential. The run does not establish an improvement in the agent, live security or universal isolation.

The page also shows what did not work. Retrieval tied with BM25. Savings in a long session were not demonstrated. The live security run was aborted in both recorded attempts.

The compaction A/B comparison has not run yet. It is a pending measurement, separate from the long-session benchmark.

At this checkpoint on 10 Nov 2026, the formal level remains N1, prototype, under the 9 Nov 2026 evaluation. Local validation on aec177d0 checked the lodeward executable and the synapse alias. The repository is private; this evidence does not represent a public release or product readiness.

Page with measurements and limits: https://skarl007.github.io/en/lodeward/

#mcp #aiagents #rust #softwareengineering

## Fontes e revisão

- Prova atual: pacote local de evidências `rename-lodeward/2026-11-10-aec177d0`, arquivos `fluxo/runtime-9h93rdo5/workflow-result.json` e `workflow-log.json`, eventos `01-registro-e-antes`, `03-aprovar`, `04-rejeitar`, `05-recuperacao-novo-processo`, `07-observacoes-por-projeto` e `08-busca-apos-reinicio`. Hashes e transcrição sanitizada em `docs/lodeward-atualizacao-2026-11-10.md`.
- Fluxo histórico de propostas: `docs/evidence/release_2026_11_03/MCP_APRENDIZAGEM_REPRODUCAO.md:66-68`, no repositório privado do motor. Não foi revalidado pela demonstração atual de lições.
- Recuperação: `docs/evidence/release_2026_11_03/MATRIZ_BENCHMARKS.md:9`.
- Economia em sessão longa não demonstrada: `docs/evidence/release_2026_11_03/MATRIZ_BENCHMARKS.md:10`.
- Comparação A/B da compactação ainda não executada: `docs/plans/lodeward-landing-contrato.md:151,224`; não é o benchmark de sessão longa.
- Segurança ao vivo: `docs/benchmarks/ab_completo/RESULTADO_REV5.md:77-79` e `docs/benchmarks/ab_completo/DESVIO_D5-7_CAMADA1.md:9`, conforme contrato histórico.
- N1: `docs/EVALUATION_RUBRIC.md:9-14,20-27,37-39`, avaliação de 09/11/2026 sobre `70e415e8`.
- Fontes e escopo da atualização: `docs/lodeward-atualizacao-2026-11-10.md`.

O texto usa a demonstração repetida no binário final do mecanismo de lições; ela não repete os 20/17 checks históricos nem demonstra benefício em um agente LLM. `tools/list` coincidiu, nos oito cenários, com a captura real da base anterior feita na rodada `aa650f9a`, reutilizada com hashes conferidos; a base não foi executada de novo. As correções dos scripts auxiliares foram verificadas e a revisão independente por agente aprovou o rename/local em `aec177d0`; fontes: `review-g1-final/report.md` e `evidence-check.json`, no pacote de evidências final. Essa aprovação é do escopo local e não autoriza publicação. Nenhum benefício de modelo, economia, exclusividade ou lançamento público foi inferido.

Mídia sugerida: captura real do cupom de medições ou do estado da página, após a atualização. O cartão Open Graph usa `assets/lodeward/og-pt.png` e `og-en.png`. O Post Inspector do LinkedIn ainda não foi verificado nesta atualização.
