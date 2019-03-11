import data from './scripts/data.js';
import ResultsChart from './scripts/Chart.js';
import ResultTable from './scripts/ResultTable.js';
import CompTable from './scripts/CompTable.js';

const chart = new ResultsChart('myChart').init();
const table = new ResultTable('table-container', chart.updateDatasets);
const compTable = new CompTable('table-container');

document.getElementById('session-selector').addEventListener('change', (e) => {
  const { id } = e.target;
  chart.clear();

  if (id === 'rsschool_compare') {
    compTable.init({
      data,
      sessionName: 'rsschool',
    });
    return;
  }

  let sessionName;
  if (id === 'rsschool_demo') {
    sessionName = 'rsschool-demo';
  } else if (id === 'rsschool') {
    sessionName = 'rsschool';
  }
  const date = '2018Q3';
  const currentData = data[date];
  table.init({
    users: currentData.users,
    session: currentData.session[sessionName],
  });
});
