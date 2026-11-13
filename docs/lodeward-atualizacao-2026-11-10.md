# Lodeward: contrato e fontes da atualização de 10/11/2026

Registro de preparação pré-publicação em 10/11/2026. Os estados de integração, disponibilidade e aprovação abaixo correspondem a este registro datado.

## Objetivo e escopo

Atualizar a página do Lodeward e o cartão nas homes em português e inglês, preservando a identidade de cobalto, papel e fichas de comprovantes. Preparar um rascunho de LinkedIn para revisão do dono. Nenhuma publicação, commit, push, PR ou merge faz parte desta etapa.

Arquivos de produto permitidos: `lodeward/index.html`, `en/lodeward/index.html` e somente o cartão Lodeward em `index.html` e `en/index.html`. Em `assets/site.js`, a exceção autorizada é trocar o nome visível do projeto e o rótulo de delegação pt/en por Lodeward, preservando IDs, geometria, contagens e demais dados. A folha `assets/lodeward/lodeward.css` só será alterada se uma falha visual exigir. As imagens `assets/lodeward/og-pt.png` e `og-en.png` podem ser regeneradas como capturas reais para refletir o hero final. Os documentos desta atualização usam o prefixo `docs/lodeward-`.

## Aceitação e mudanças

| Critério | Mudança prevista | Evidência exigida |
|---|---|---|
| Marca fiel ao estado local | Explicar o executável `lodeward` e o alias `synapse`, distinguindo validação local de release pública | G0, release, versões, initialize e comparação completa de `tools/list` conferidos em `aec177d0`; correções dos scripts auxiliares verificadas e revisão independente por agente aprovada no escopo local |
| Nível sem promoção indevida | Manter N1, identificar a avaliação histórica e explicar protótipo | Régua pré-registrada e avaliação de 09/11/2026 |
| Cartões com status verificável | Substituir o contador de commits sem fonte por nível N1 e data da avaliação | Mesma avaliação histórica |
| Nenhuma exclusividade presumida | Descrever a aprovação de lições para recuperação; separar aprovação, aplicação e rollback de propostas de arquivos | Protocolo de reprodução do ciclo de aprendizagem |
| Números com origem e data | Atualizar o G0 com execuções aprovadas, ignoradas e repetição da suíte CLI; separar cada protocolo | G0 em `aec177d0`, fontes e hashes abaixo |
| Visual aprovado preservado | Usar HTML e estilos existentes | Navegador real em desktop e celular, claro e escuro; screenshots inspecionados |
| Página navegável e íntegra | Verificar tema, âncoras, idiomas, cartão, assets, metadados e ausência de overflow | Relatório de Playwright com Edge, console e erros de página |
| Post revisável | Texto pt-BR/EN com problema, fluxo, prova datada e limites | `docs/lodeward-linkedin-2026-11-10.md` |

## Fontes históricas

Os caminhos desta tabela são relativos ao repositório privado do motor. São referências de auditoria, não links públicos nem instruções de instalação. As provas históricas não validam automaticamente o ramo de rename.

| Afirmação | Fonte e alcance |
|---|---|
| N1, protótipo; só V6 integralmente aprovado em 09/11/2026 | `docs/EVALUATION_RUBRIC.md:9-14,20-27,37-39`; avaliação sobre `70e415e8`, registrada em `docs/plans/lodeward-landing-contrato.md`, seção 6 |
| G0 histórico: 3.814 testes, zero falhas | G0 r5 em `ef5213a0`, 08/11/2026, registrado no contrato anterior, seção 6; não é o resultado do rename |
| Ciclo de lições com 20 verificações; fluxo separado de propostas com 17, aprovação distinta da aplicação e undo que restaura bytes e SHA-256 | `docs/evidence/release_2026_11_03/MCP_APRENDIZAGEM_REPRODUCAO.md:21-22,66-68`; binário instalado anterior ao código atual |
| Recuperação em empate: 457 contra 456 em 470 consultas | `docs/evidence/release_2026_11_03/MATRIZ_BENCHMARKS.md:9` |
| Economia em sessão longa não demonstrada | `docs/evidence/release_2026_11_03/MATRIZ_BENCHMARKS.md:10`; razão 1,2133 em 45 pares |
| Comparação A/B da compactação ainda não executada | `docs/plans/lodeward-landing-contrato.md:151,224`; medição pendente, separada do benchmark de sessão longa |
| Rodada ao vivo de segurança abortada em duas tentativas | `docs/benchmarks/ab_completo/RESULTADO_REV5.md:77-79` e `docs/benchmarks/ab_completo/DESVIO_D5-7_CAMADA1.md:9`, conforme contrato anterior |
| Tokens, quando citados | Sempre estimativa por bytes ÷ 4, sem conversão financeira |

Os demais números históricos preservados na página mantêm as fontes da seção 6 de `docs/plans/lodeward-landing-contrato.md`; o cupom continua datado até 09/11/2026. A demonstração local de 10/11 é uma prova adicional, não uma repetição de todos esses protocolos.

## Provas locais de 10/11/2026

Pacote de evidências identificado como `rename-lodeward/2026-11-10-aec177d0`, mantido localmente. Os nomes abaixo identificam os arquivos auditados, sem expor diretórios privados. Estes arquivos não são apresentados como links públicos. O commit testado é `aec177d09be8e6dffd1262d2152e37d167f53e91`.

| Afirmação | Fonte e alcance |
|---|---|
| G0 aprovado; 4.213 execuções aprovadas, zero falhas, 26 ignoradas, 24 filtradas, 263 grupos de resumo | `g0-result.json`: campos `status`, `head`, `gates`, `test_summary_blocks` e `test_counts`; `test.log` com SHA-256 abaixo |
| O total conta execuções, não testes distintos nem cobertura nova | `g0-result.json`: `counting_note`, `cli_main_blocks`; a mesma suíte `main.rs` tem 368 execuções no alvo lodeward e 368 no alvo synapse; há resumos de processos filhos |
| Formatação e lint passaram | `g0-result.json`: `cargo fmt --all -- --check` e `cargo clippy --workspace --all-targets -- -D warnings`, ambos com código de saída 0 |
| Build release local passou | `runtime-result.json`: `builds[label=current]`, comando `cargo build --release -p lodeward-cli --bins`, saída 0; não equivale a build release de todo o workspace nem release pública |
| Os dois executáveis reportam literalmente `lodeward 0.3.0+aec177d0` | `runtime-result.json`: `versions`, comandos `lodeward.exe --version` e `synapse.exe --version`, ambos com saída 0 |
| Três inicializações abaixo de 2 s, contando desde antes do spawn | `runtime-result.json`: `runs[current-repeat1..3].initialize_total_ms` = 25.025499984622, 23.825000040233135 e 23.131900001317263 ms; `server_name=lodeward` e saída 0 nas três amostras. Não é garantia sobre toda execução |
| `tools/list` preservado nos oito cenários comparados com a captura real de `70e415e8` | `runtime-result.json`: `comparisons`, todas com `byte_identical=true`; `baseline_mode` e `baseline_provenance` registram captura da rodada `aa650f9a`, reutilizada com hashes e proveniência conferidos. A base não foi executada novamente nesta rodada. `runtime-report.md` documenta ordenação recursiva de chaves de objetos sem remover campos, preservando ordem dos arrays, descrições e schemas |
| Quarentena invisível, aprovação/rejeição e recuperação em novo processo | `fluxo/runtime-9h93rdo5/workflow-result.json`, critérios `quarentena`, `invisivel_antes`, `recuperacao_apos_aprovacao` e `rejeicao`; eventos `01`, `03`, `04` e `05` do `workflow-log.json` |
| Filtros de projeto nos casos demonstrativos | Critérios `filtro_projeto_licao` e `isolamento_busca_observacoes`; eventos `05`, `07` e `08` do mesmo log. São casos artificiais Alpha/Beta, não uma prova universal de isolamento |
| Binário do fluxo preservado | `workflow-result.json`: SHA-256 esperado, antes e depois iguais ao hash de lodeward.exe abaixo. O fluxo não leu o Git HEAD; a associação ao release vem do hash e do registro do operador |
| Revisão independente por agente aprova o rename/local, sem achado acionável aberto nesse escopo | `review-g1-final/report.md` e `evidence-check.json`, HEAD `aec177d0`; conferência direta de código, reproduções e evidências. Não é revisão externa de usuário, certificação global do produto, promoção de nível ou autorização de publicação |

Os executáveis finais foram preservados como cópias independentes em `artifacts/`, com link count 1 e identidades de arquivo distintas do target, conforme `runtime-result.json`: `executable_copies`. A demonstração de lições foi repetida com esse binário final; não se transferiu o resultado do executável anterior.

Transcrição sanitizada do fluxo observado:

```text
01: duas lições artificiais registradas como LEARNING_QUARANTINED;
    leitura do projeto alpha: learnings=[], pending_total=2.
03: CLI aprovou a primeira lição.
04: CLI rejeitou a segunda lição.
05: outro processo recuperou apenas a lição aprovada em alpha;
    leitura de beta: learnings=[], returned=0.
07: observações artificiais com termos diferentes registradas em Alpha e Beta.
08: outro processo em Alpha encontrou o termo de Alpha;
    busca pelo termo exclusivo de Beta: results=[], total=0.
```

Passaram seis critérios funcionais e a verificação de hash. Essa demonstração usa dados artificiais e runtime novo isolado. Não chamou LLM, não usou credencial real e não revalidou aplicação ou rollback de proposta. Não equivale a repetir os 20/17 checks históricos.

### Cenários de catálogo MCP

Os oito cenários com JSON completo coincidente entre o release local final e os dados reais da base anterior, capturados na rodada `aa650f9a` e reutilizados com integridade verificada:

| Perfil | `outputSchema` completo | Ferramentas por lado |
|---|---|---|
| default | não | 19 |
| core | não | 19 |
| review | não | 4 |
| factory | não | 44 |
| agent | não | 6 |
| factory-agent | não | 11 |
| full | não | 58 |
| full | sim | 58 |

São verificações de catálogo, não chamadas às ferramentas. O resultado não demonstra compatibilidade integral dos scripts ou comportamento de todo o produto.

### Integridade dos artefatos

| Artefato | SHA-256 |
|---|---|
| `test.log` | `d93fba76fd59d6959c57746cc29962ad62821b9858988c98b1838f53db6b96e9` |
| `artifacts/lodeward.exe`, release local | `2b41e5f784b1ccfe5c73f18a30b8ba09e207de3e930c08f096bb5827f03426b3` |
| `artifacts/synapse.exe`, alias local | `79ccdae9f428644182b4160e66ffea6babcb4a0f858b3138f4f03bc5e3089905` |
| `fluxo/runtime-9h93rdo5/workflow-result.json` | `b0e7436a39281878255e72975d64e6f12654ae627e83c2733db537debc4d3386` |
| `fluxo/runtime-9h93rdo5/workflow-log.json` | `16df31438a0a005ba2fe0f6676090dd240ec3259a9f0974e2b6d7729f29716d7` |

## Limites que permanecem

N1 não é N3 nem validação de produto. A avaliação completa não foi repetida no ramo de rename. A recuperação ficou em empate; a economia em sessão longa não foi demonstrada; a segurança ao vivo foi abortada. A comparação A/B da compactação ainda não rodou e não é o benchmark de sessão longa. Um teste do mecanismo de lições não demonstra melhora geral de um modelo. O repositório continua privado, e validação local não é lançamento público.

## Revisão local e registro pré-publicação

A comparação de `tools/list` passou nos oito cenários descritos. As correções dos scripts auxiliares foram verificadas e a revisão independente por agente aprovou o rename/local em `aec177d0`, sem achado acionável aberto nesse escopo. Não se alega certificação geral de compatibilidade nem alteração do nível N1. Este registro documenta a validação local de 10/11/2026; não representa release pública nem prontidão do produto. A inspeção do cartão pelo LinkedIn não faz parte desta verificação local. Este documento registra a preparação para revisão pública do texto; decisões posteriores de publicação devem ser registradas separadamente.
