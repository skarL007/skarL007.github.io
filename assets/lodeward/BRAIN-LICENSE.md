# Anatomy model attribution

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- Source: [official BodyParts3D archive](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html)
- Version: BodyParts3D 4.0 (released 2013-05-16), IS-A OBJ archive, polygon reduction rate 99%
- Retrieved: 2026-09-25
- Model/data license: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), as specified by the [archive license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html), updated 2025-02-27
- Exact downloads, hashes, transformations, and source-to-runtime mappings: [manifest.json](https://github.com/organui/brain-3d/blob/e2f8c172716d8f4e8db6080b7d23f38fabe3add8/public/models/manifest.json)
- Original work: Mitsuhashi et al., “BodyParts3D: 3D structure database for anatomical concepts”, *Nucleic Acids Research* 37 (2009), D782–D785. [DOI](https://doi.org/10.1093/nar/gkn613)

Changes by OrganUI: selected and grouped 45 source meshes into 19 runtime structures; excluded compound whole-organ representations and one duplicate aqueduct ownership; triangulated faces; recentered and uniformly scaled coordinates; changed axes from Z-up to Y-up; recomputed smooth normals; assigned illustrative colors; and converted OBJ geometry to GLB. No further decimation, lobe inference, invented anatomy, cut surface, or imaging data was added.

Legacy OBJ headers cite CC BY-SA 2.1 Japan while the official archive license currently grants CC BY 4.0. This distribution uses the current official archive grant for the directly downloaded assets and preserves a dated license-page snapshot under `docs/model-source/` so the discrepancy remains visible.

The repository’s MIT license covers original application code only. It does not relicense the anatomy asset or screenshots derived from it. Preserve this credit, model license link, and modification notice when redistributing the model or derived images. DBCLS does not endorse this demonstration.


## Lodeward presentation adaptation

Source conversion by OrganUI, pinned commit `e2f8c172716d8f4e8db6080b7d23f38fabe3add8`. Source GLB SHA-256: `1e8d62f8579c195a85cf81790cd74b7d1d158e182f418767668089e209f0c478`.

Lodeward retains the eight cerebral lobes, midbrain, pons, medulla and cerebellum. Coordinates are quantized to 1/8000 display units, normals are recomputed, and materials are replaced. Illustrative connections, animation and software-stage markers were added. These connections are not anatomical tractography or live neural activity.

Runtime files: `brain.bin.gz` and `brain.json`. The anatomy remains licensed under CC BY 4.0.
