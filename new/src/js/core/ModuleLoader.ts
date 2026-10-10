import type { App } from './App';
import type { Module } from './Module';
import { registry, type ModuleName } from '../modules/registry';

function readOptions(el: HTMLElement): Record<string, string> {
  const options: Record<string, string> = {};
  Object.entries(el.dataset).forEach(([key, value]) => {
    if (value === undefined || key === 'module') return;
    if (key.startsWith('module') && key.length > 'module'.length) {
      const rest = key.slice('module'.length);
      options[rest.charAt(0).toLowerCase() + rest.slice(1)] = value;
    } else {
      options[key] = value;
    }
  });
  return options;
}

export class ModuleLoader {
  private readonly instances = new Map<HTMLElement, Map<ModuleName, Module>>();

  constructor(private readonly app: App) {}

  async load(scope: ParentNode = document): Promise<void> {
    const els = Array.from(scope.querySelectorAll<HTMLElement>('[data-module]'));
    if (scope instanceof HTMLElement && scope.matches('[data-module]')) els.unshift(scope);

    await Promise.all(els.map((el) => this.mountElement(el)));
  }

  unload(): void {
    this.instances.forEach((modules) => modules.forEach((module) => module.destroy()));
    this.instances.clear();
  }

  private async mountElement(el: HTMLElement): Promise<void> {
    const names = (el.dataset.module ?? '').split(/\s+/).filter(Boolean) as ModuleName[];
    if (!names.length) return;

    const mounted = this.instances.get(el) ?? new Map<ModuleName, Module>();
    this.instances.set(el, mounted);

    await Promise.all(names.map((name) => this.mount(el, mounted, name)));
  }

  private async mount(el: HTMLElement, mounted: Map<ModuleName, Module>, name: ModuleName): Promise<void> {
    if (mounted.has(name)) return;

    const load = registry[name];
    if (!load) return;

    const { default: Ctor } = await load();
    if (this.instances.get(el) !== mounted) return;

    const instance = new Ctor({ instance: el, options: readOptions(el), app: this.app });
    mounted.set(name, instance);
    await instance.init();
  }
}
