import Checkboxes from './Checkboxes.js';
import {
  userRoundTime, userSumTime, puzzlesNames, getUsersData,
} from './dataQueries.js';

import { MAX_CHART_LINES } from './constants.js';

export const createCell = (type, text = '', klass) => {
  const cell = document.createElement(type);
  cell.textContent = text;
  if (klass) {
    cell.classList.add(klass);
  }
  return cell;
};

const createCheckboxCell = (tag) => {
  const cell = createCell(tag, '', 'tchart');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  cell.appendChild(checkbox);
  return cell;
};

const addRowCells = (row, userData, headers, i) => {
  const tag = 'TD';
  // number
  row.appendChild(createCell(tag, i, 'tnumber'));
  // name
  row.appendChild(createCell(tag, userData.name, 'tname'));
  // round times
  const { rounds } = userData;
  headers.forEach((header, index) => {
    const round = rounds[index] || 'xxx';
    const cell = createCell(tag, userRoundTime(round));
    // eslint-disable-next-line no-undef
    cell.title = _.has(round, 'code') ? round.code : '';
    row.appendChild(cell);
  });
  // sum time
  row.appendChild(createCell(tag, userSumTime(userData.rounds), 'ttime'));
  // checkbox
  row.appendChild(createCheckboxCell(tag));
};

const addTableHead = (table, headers) => {
  const tag = 'TH';
  const headRow = table.createTHead().insertRow(0);
  // number
  headRow.appendChild(createCell(tag, '#', 'tnumber'));
  // name
  headRow.appendChild(createCell(tag, 'Name', 'tname'));
  // headers
  headers.forEach((name) => {
    headRow.appendChild(createCell(tag, name));
  });
  // sum time
  headRow.appendChild(createCell(tag, 'Time', 'ttime'));
  // checkbox
  headRow.appendChild(createCell(tag, 'Comparison'));
};

const addTableBody = (table, bodyData, headers) => {
  const body = table.createTBody();
  let i = 1;
  for (const userData of bodyData) {
    const bodyRow = body.insertRow();
    addRowCells(bodyRow, userData, headers, i);
    i += 1;
  }
};

const createTable = (tableData) => {
  const table = document.createElement('TABLE');
  table.setAttribute('data-sortable', '');
  const headers = puzzlesNames(tableData.session);
  const bodyData = getUsersData(tableData);
  addTableHead(table, headers);
  addTableBody(table, bodyData, headers);

  return table;
};

export default class {
  constructor(id, callback) {
    this.node = document.getElementById(id);
    this.table = null;
    this.checkboxes = null;
    this.callback = callback;
  }

  init(tableData) {
    this.node.textContent = '';

    this.table = createTable(tableData);
    this.node.appendChild(this.table);
    // eslint-disable-next-line no-undef
    Sortable.init();

    this.checkboxes = new Checkboxes(this.node);
    this.table.addEventListener('click', this.onCheckboxCheck.bind(this));

    return this;
  }

  onCheckboxCheck() {
    // TODO fix hardcoded slice(2, ... -2)

    // prepare data for chart
    const datasets = [];
    let checked = 0;
    const bodyRows = [...this.node.querySelectorAll('tbody tr')];
    bodyRows.forEach((row) => {
      // FIX we need an input only from the Chart column
      const checkbox = row.querySelector('input');
      if (checkbox.checked) {
        checked += 1;
        const cells = [...row.children];
        datasets.push({
          label: row.children[1].textContent,
          data: cells.slice(2, cells.length - 2).map(td => Number(td.textContent)),
        });
      }
    });

    // send a message to chart
    const headCells = [...this.node.querySelectorAll('th')];
    const labels = headCells.slice(2, headCells.length - 2).map(th => th.textContent);
    this.callback({
      labels,
      datasets,
    });

    // check if checkboxes must to be locked
    if (checked === MAX_CHART_LINES) {
      this.checkboxes.disable();
    } else if (checked === MAX_CHART_LINES - 1) {
      this.checkboxes.enable();
    }
  }
}
