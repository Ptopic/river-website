import type Lenis from 'lenis';
import { EventEmitter } from './EventEmitter';

export class App extends EventEmitter {
  scroll: Lenis | null = null;
  overlayEnter?: (value: number) => void;
  overlayLeave?: (value: number) => void;
}
