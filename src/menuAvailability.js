export const menuEnabled = !['false', 'off', '0'].includes(
	(import.meta.env.VITE_MENU_ENABLED ?? '').trim().toLowerCase()
);
