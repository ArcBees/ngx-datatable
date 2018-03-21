import { Component, Input, OnChanges, PipeTransform, TemplateRef } from '@angular/core';

export interface ISummaryColumn {
  summaryFunc?: (cells: any[]) => any;
  summaryTemplate?: TemplateRef<any>;

  prop: string;
  pipe?: PipeTransform;
}

function defaultSumFunc(cells: any[]): any {
  return cells
    .filter(cell => !!cell)
    .reduce((res, cell) => res + cell);
}

@Component({
  selector: 'datatable-summary-row',
  template: `
  <datatable-body-row
    *ngIf="summaryRow && _internalColumns"
    tabindex="-1"
    [innerWidth]="innerWidth"
    [offsetX]="offsetX"
    [columns]="_internalColumns"
    [rowHeight]="rowHeight"
    [row]="summaryRow"
    [rowIndex]="-1">
  </datatable-body-row>
  `,
  host: {
    class: 'datatable-summary-row'
  }
})

export class DataTableSummaryRowComponent implements OnChanges {
  @Input() rows: any[];
  @Input() columns: ISummaryColumn[];

  @Input() rowHeight: number;
  @Input() offsetX: number;
  @Input() innerWidth: number;

  _internalColumns: ISummaryColumn[];
  summaryRow = {};

  ngOnChanges() {
    if (!this.columns || !this.rows) { return; }
    this.updateInternalColumns();
    this.updateValues();
  }

  private updateInternalColumns() {
    this._internalColumns = this.columns.map(col => ({
      ...col,
      cellTemplate: col.summaryTemplate
    }));
  }

  private updateValues() {
    this.summaryRow = {};

    this.columns.forEach(col => {
      const cellsFromSingleColumn = this.rows.map(row => row[col.prop]);
      const sumFunc = col.summaryFunc || defaultSumFunc;

      this.summaryRow[col.prop] = col.pipe ?
        col.pipe.transform(sumFunc(cellsFromSingleColumn)) :
        sumFunc(cellsFromSingleColumn);
    });
  }
}
