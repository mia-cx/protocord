# Direction

Protocord is the shared TypeScript action and Discord interaction framework for
Patch, Prod, and other consumers. Actions and application behavior belong to the
consumer; shared action execution and trigger providers belong here.

The core, settings, permissions, and AI scaffold were extracted with their Git
history from Prod. This repository is their canonical home. Prod still contains
its original copies until its adoption is handled separately. The Mia CX model
settings package stays in Prod.

Packages remain private. Patch consumes a pinned Git submodule through pnpm
workspace dependencies, so development does not require registry publication.
Keep standalone checks working as well as consumer workspace builds.

The AI package is a scaffold. Extraction does not implement model serving,
Remora, concrete bot actions, or Prod's triage workflow.
