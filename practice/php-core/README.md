# PHP Core Practice Lab

Use this space to drill core PHP skills without touching the main app code.  
The `workspace/` directory (ignored by git) is your scratch pad for exercise code, tests, and notes.

## Current Focus — Mini Service Container

Build a lightweight dependency injection container to reinforce when to use interfaces, traits, and manual wiring.

Suggested milestones:

1. **Container basics**
   - `bind(string $abstract, callable|class-string $concrete)`
   - `make(string $abstract)` to resolve definitions (call callables, new class instances).
   - Support constructor injection by auto-resolving class type-hints via reflection.
2. **Singletons & scoped state**
   - Add `singleton($abstract, $concrete)` that caches the resolved instance.
   - Prevent accidental re-binding of singletons unless explicitly reset.
3. **Interface contracts**
   - Bind interfaces to concrete classes, then swap implementations in tests.
   - Create at least one interface + two implementations to demonstrate the flexibility.
4. **Traits for reuse**
   - Extract shared behaviour from two unrelated classes into a trait to see where traits shine compared to interfaces.
5. **Stretch ideas**
   - Add contextual bindings (different concretes per consumer).
   - Introduce method invocation helper `call($callable)` that resolves dependencies for you.
   - Write quick unit tests with PHPUnit or Pest (both already installed in the project).

## Workflow

1. Create your playground file at `practice/php-core/workspace/main.php`.
2. Run it with `php practice/php-core/run.php`.
3. Add more files under `workspace/` as needed—everything there stays untracked.
4. When you’re happy with a snippet, copy out the learnings or move the code into tracked exercises intentionally.

> Tip: keep a journal of takeaways in `docs/` or personal notes so interview answers stay sharp.
