---
name: codebase-design
description: Shared vocabulary for designing deep modules — module, interface, depth, seam, adapter, leverage, locality. Use when the user wants to design or improve a module's interface, find deepening opportunities, decide where a seam goes, make code more verifiable or AI-navigable, or when another skill (e.g. /improve-codebase-architecture) needs the deep-module vocabulary.
---

# Codebase Design

Design **deep modules**: a lot of behaviour behind a small interface, placed at a clean seam, verifiable through that interface. Use this language and these principles wherever code is being designed or restructured. The aim is leverage for callers, locality for maintainers, and verifiability for everyone.

## Glossary

Use these terms exactly — don't substitute "component," "service," "API," or "boundary." Consistent language is the whole point.

**Module** — anything with an interface and an implementation. Deliberately scale-agnostic: a function, hook, component, module, or tier-spanning slice. _Avoid_: unit, component, service.

**Interface** — everything a caller must know to use the module correctly: the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics. _Avoid_: API, signature (too narrow — they refer only to the type-level surface).

**Implementation** — what's inside a module, its body of code. Distinct from **Adapter**: a thing can be a small adapter with a large implementation (a `<Table>` wrapping TanStack Table) or a large adapter with a small implementation (an in-memory fake). Reach for "adapter" when the seam is the topic; "implementation" otherwise.

**Depth** — leverage at the interface: the amount of behaviour a caller (or a check) can exercise per unit of interface they have to learn. A module is **deep** when a large amount of behaviour sits behind a small interface, **shallow** when the interface is nearly as complex as the implementation.

**Seam** _(Michael Feathers)_ — a place where you can alter behaviour without editing in that place; the *location* at which a module's interface lives. Where to put the seam is its own design decision, distinct from what goes behind it. _Avoid_: boundary (overloaded with DDD's bounded context).

**Adapter** — a concrete thing that satisfies an interface at a seam. Describes *role* (what slot it fills), not substance (what's inside).

**Leverage** — what callers get from depth: more capability per unit of interface they learn. One implementation pays back across N call sites and M checks.

**Locality** — what maintainers get from depth: change, bugs, knowledge, and verification concentrate in one place rather than spreading across callers. Fix once, fixed everywhere.

## Deep vs shallow

**Deep module** = small interface + lots of implementation:

```
┌─────────────────────┐
│   Small Interface   │  ← Few methods, simple params
├─────────────────────┤
│                     │
│  Deep Implementation│  ← Complex logic hidden
│                     │
└─────────────────────┘
```

**Shallow module** = large interface + little implementation (avoid):

```
┌─────────────────────────────────┐
│       Large Interface           │  ← Many methods, complex params
├─────────────────────────────────┤
│  Thin Implementation            │  ← Just passes through
└─────────────────────────────────┘
```

When designing an interface, ask:

- Can I reduce the number of methods?
- Can I simplify the parameters?
- Can I hide more complexity inside?

## Principles

- **Depth is a property of the interface, not the implementation.** A deep module can be internally composed of small, swappable parts — they just aren't part of the interface. A module can have **internal seams** (private to its implementation) as well as the **external seam** at its interface.
- **The deletion test.** Imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across N callers, it was earning its keep.
- **The interface is the verification surface.** Callers and the checks that exercise the module cross the same seam. If you find yourself wanting to verify *past* the interface, the module is probably the wrong shape. In motiv, "verify" means `pnpm typecheck` + `pnpm check` + Vitest/Testing Library tests that render the component through its public props, plus stories for the visual states (see [DEEPENING.md](DEEPENING.md)).
- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a seam unless something actually varies across it.

## Don't over-abstract

A seam is a cost until a second adapter pays for it. This is the same discipline as `/writing-simple-code`: don't add a prop, a generic, or an indirection with only one caller. When a candidate design *could* grow a seam, **surface the options and ask** — consistent with CLAUDE.md's discuss-public-API-first rule (a new prop or export is public API every consuming app sees) — rather than unilaterally introducing indirection. A single-adapter port is just indirection wearing a design word.

## Designing for verifiability

Good interfaces make verification natural — whether that verification is a Vitest test, a story, or dropping the component into a consuming app.

1. **Accept dependencies, don't create them.**

   ```typescript
   // Verifiable — the seam is visible, callers pass what varies
   function sortRows(rows, sort) {}

   // Hard to verify — the persisted sort state is welded inside
   function sortRows(rows) {
     const sort = JSON.parse(localStorage.getItem("table-sort"));
   }
   ```

2. **Return results, don't produce side effects.**

   ```typescript
   // Verifiable — the result is observable at the interface
   function resolveTheme(preference, systemDark): "light" | "dark" {}

   // Hard to verify — the effect hides behind a void
   function applyTheme(preference): void {
     document.documentElement.dataset.theme = resolve(preference);
   }
   ```

3. **Small surface area.** Fewer methods = fewer paths to drive. Fewer params = simpler setup when you exercise the flow.

## Relationships

- A **Module** has exactly one **Interface** (the surface it presents to callers and to the checks that exercise it).
- **Depth** is a property of a **Module**, measured against its **Interface**.
- A **Seam** is where a **Module**'s **Interface** lives.
- An **Adapter** sits at a **Seam** and satisfies the **Interface**.
- **Depth** produces **Leverage** for callers and **Locality** for maintainers.

## Rejected framings

- **Depth as ratio of implementation-lines to interface-lines** (Ousterhout): rewards padding the implementation. We use depth-as-leverage instead.
- **"Interface" as the TypeScript `interface` keyword or a component's public props**: too narrow — interface here includes every fact a caller must know.
- **"Boundary"**: overloaded with DDD's bounded context. Say **seam** or **interface**.

## Going deeper

- **Deepening a cluster given its dependencies** — see [DEEPENING.md](DEEPENING.md): dependency categories (jsdom and headless-primitive seams; ports & adapters only where something really varies), seam discipline, and the replace-don't-layer verification loop.
- **Exploring alternative interfaces** — see [DESIGN-IT-TWICE.md](DESIGN-IT-TWICE.md): fan out parallel sub-agents to design the interface several radically different ways, then compare on depth, locality, and seam placement.
