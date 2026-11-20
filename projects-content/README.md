---
title: Project content for pmsorhaindo.com/projects
as_of: "2026-11-20 evening"
timezone: Europe/Amsterdam
---

# Project content data

This folder is **content data only**. It is raw material for a future public `/projects` page on [pmsorhaindo.com](https://pmsorhaindo.com). A later change will wire it into the site; nothing here is linked from the live nav yet.

Michael explicitly OK'd publishing details from the private repos.

| Project | Markdown | Board / dependency data | Repo | Board |
|---|---|---|---|---|
| Deianira | [deianira.md](deianira.md) | [deianira.data.json](deianira.data.json) | https://github.com/pmsorhaindo/Deianira (private) | https://github.com/users/pmsorhaindo/projects/3 |
| ModellingAudioProcessors | [modelling-audio-processors.md](modelling-audio-processors.md) | [modelling-audio-processors.data.json](modelling-audio-processors.data.json) | https://github.com/pmsorhaindo/ModellingAudioProcessors (private) | https://github.com/users/pmsorhaindo/projects/7 |
| Modwerk | [modwerk.md](modwerk.md) | [modwerk.data.json](modwerk.data.json) | https://github.com/pmsorhaindo/modwerk (public) | https://github.com/users/pmsorhaindo/projects/10 |

Each Markdown file has YAML front matter, prose sections, and Mermaid in fenced blocks. Uncertain items are marked in the diagrams and in the prose. Times are Europe/Amsterdam (UTC+1). Facts are taken from READMEs, AGENTS/MISSION docs, issues, PRs, comments, and Projects v2 boards — not from code diffs. Gaps are listed at the end of each file and in this folder's data notes.

Board snapshots are complete for all three projects (Deianira 16, ModellingAudioProcessors 36, Modwerk 25). A first ModellingAudioProcessors fetch returned only 30 items because of a temporary Projects GraphQL rate limit; a later `--limit 100` call at 21:07 Europe/Amsterdam on 20 Nov 2026 retrieved all 36.
