import PhaseView from './components/PhasesView';
import NewPhase from './components/NewPhase';

export const phasesRoutes = [
  {
    key: '/phases',
    exact: true,
    element: <PhaseView />,
    name: 'Phase View',
    permission: 'view_phases',
  },
  {
    key: '/new-phase',
    exact: true,
    element: <NewPhase />,
    name: 'New Phase',
    permission: 'create_phase',
  },
  {
    key: '/edit-phase',
    exact: true,
    element: <NewPhase />,
    name: 'Edit Phase',
    permission: 'create_phase',
  },
];
