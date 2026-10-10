import type { App } from './App';

export interface ModuleContext {
  instance: HTMLElement;
  options: Record<string, string>;
  app: App;
}

export abstract class Module {
  protected readonly instance: HTMLElement;
  protected readonly options: Record<string, string>;
  protected readonly app: App;
  protected destroyed = false;

  private readonly appHandlers: Array<[string, (...args: unknown[]) => void]> = [];
  private readonly domHandlers: Array<[EventTarget, string, EventListener, AddEventListenerOptions | boolean | undefined]> = [];

  constructor({ instance, options, app }: ModuleContext) {
    this.instance = instance;
    this.options = options;
    this.app = app;

    this.onApp('resize', () => {
      if (!this.destroyed) this.resize();
    });
  }

  protected onApp(event: string, handler: (...args: unknown[]) => void): void {
    this.app.on(event, handler);
    this.appHandlers.push([event, handler]);
  }

  protected listen(target: EventTarget, event: string, handler: EventListener, opts?: AddEventListenerOptions | boolean): void {
    target.addEventListener(event, handler, opts);
    this.domHandlers.push([target, event, handler, opts]);
  }

  init(): void | Promise<void> {}

  resize(): void {}

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.appHandlers.forEach(([event, handler]) => this.app.off(event, handler));
    this.domHandlers.forEach(([target, event, handler, opts]) => target.removeEventListener(event, handler, opts));
    this.appHandlers.length = 0;
    this.domHandlers.length = 0;
  }
}
