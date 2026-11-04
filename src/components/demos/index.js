import WeatherDemo from './WeatherDemo';
import KanbanDemo from './KanbanDemo';
import ApiExplorerDemo from './ApiExplorerDemo';

export const BUILTIN_DEMOS = {
  weather: { label: 'Clima (Geolocation + Open-Meteo)', Component: WeatherDemo },
  kanban: { label: 'Tablero kanban (Drag & Drop)', Component: KanbanDemo },
  api: { label: 'Explorador de API REST', Component: ApiExplorerDemo },
};
