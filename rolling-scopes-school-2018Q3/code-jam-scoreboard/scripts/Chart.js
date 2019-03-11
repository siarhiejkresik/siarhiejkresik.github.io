export default class {
  constructor(id) {
    this.node = document.getElementById(id);
    this.ctx = this.node.getContext('2d');
    this.chart = null;

    this.updateDatasets = this.updateDatasets.bind(this);
  }

  init(labels = [], datasets = []) {
    // eslint-disable-next-line no-undef
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
    });
    return this;
  }

  updateDatasets({ labels, datasets }) {
    this.chart.config.data.labels = labels;
    this.chart.config.data.datasets = datasets;
    this.chart.update();
  }

  clear() {
    if (!this.chart) {
      return;
    }
    this.updateDatasets({ labels: [], datasets: [] });
  }
}
