import { getCompTableData } from './dataQueries.js';
import { MAX_TIME } from './constants.js';
import { createCell } from './ResultTable.js';

export default class {
  constructor(id) {
    this.node = document.getElementById(id);
    this.table = null;
  }

  init({ data, sessionName }) {
    this.node.textContent = '';

    const headers = Object.keys(data).sort();

    const table = document.createElement('TABLE');
    table.setAttribute('data-sortable', '');

    // HEAD

    let tag = 'TH';
    const headRow = table.createTHead().insertRow(0);

    // number
    headRow.appendChild(createCell(tag, '#', 'tnumber'));

    // name
    headRow.appendChild(createCell(tag, 'Name', 'tname'));

    // headers
    headers.forEach((name) => {
      headRow.appendChild(createCell(tag, name));
    });

    // delta
    headRow.appendChild(createCell(tag, 'Δ', 'tdelta'));

    // result
    headRow.appendChild(createCell(tag, 'Result', 'tresult'));

    // BODY

    const body = table.createTBody();
    let number = 1;
    const rowsData = getCompTableData(data, sessionName);

    // rows
    for (const name of Object.keys(rowsData).sort()) {
      const row = body.insertRow();
      tag = 'TD';

      // number
      row.appendChild(createCell(tag, number, 'tnumber'));

      // name
      row.appendChild(createCell(tag, name, 'tname'));

      // sum times by date
      const times = headers.map(header => rowsData[name][header] || MAX_TIME * 10); // FIX hardcoded
      for (const time of times) {
        const cell = createCell(tag, time);
        row.appendChild(cell);
      }

      // delta
      const delta = times[1] - times[0];
      row.appendChild(createCell(tag, delta, 'tdelta'));

      // result
      let result = '—';
      if (delta > 0) {
        result = '↘';
      } else if (delta < 0) {
        result = '↗';
      }
      row.appendChild(createCell(tag, result, 'tresult'));

      number += 1;
    }

    this.node.appendChild(table);
    // eslint-disable-next-line no-undef
    Sortable.init();

    return this;
  }
}
