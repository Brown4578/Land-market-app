import Home from './components/Home';

export const routes = [
  {
    key: '/property-search',
    exact: true,
    element: <Home />,
    name: 'Property Search',
    permission: 'view_property_search',
  },
];
