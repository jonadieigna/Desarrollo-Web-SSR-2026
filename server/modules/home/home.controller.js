import getHomeViewModel from './home.service.js';

export default function renderHome(req, res) {
  // Cargando el viewModel
  const viewModel = getHomeViewModel();
  // Entregando la vista
  res.render('index', viewModel);
}