import { Component } from '@angular/core';
import * as ReportsData from "./reports_data.json";
import { Content, ContentParams } from "./Content";
declare var pdfMake;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  private reportsData;
  constructor() {
    this.reportsData = ReportsData['default'];
    // console.log("reports data", this.reportsData);
  }

  setViewStyles(vStyles): Partial<ContentParams> {
    let styles: Partial<ContentParams> = {};
    if (!vStyles) return styles;
    if (vStyles.textColor) {
      styles.color = vStyles.textColor;
    }
    if (vStyles.color) {
      styles.color = vStyles.color;
    }
    if (vStyles.backgroundColor) {
      styles.fillColor = vStyles.backgroundColor;
    }
    if (vStyles.alignment) {
      styles.alignment = vStyles.alignment;
    }
    if (vStyles.fontSize) {
      styles.fontSize = vStyles.fontSize;
    }

    if (vStyles.fontWeight) {
      styles.bold = true;
    }

    return styles;
  }

  createPDFMakeData() {
    let tableContent = [];
    this.reportsData.forEach(row => {
      if (row.columns && row.columns.length > 0) {
        let contentRow = [];
        row.columns.forEach((column: any, columnIndex: number) => {
          // render sub-headers
          if (Array.isArray(column.value)) {
            let subHeader = [];
            column.value.forEach(view => {
              let title = new Content({ text: view.title + ": ", ...this.setViewStyles(view.style.title) }).params;
              let value = new Content({ text: view.value, ...this.setViewStyles(view.style.value) }).params;
              subHeader.push(title, value);
            });
            let col = new Content({ text: subHeader, colSpan: column.colSpan }).params;
            contentRow.push(...[col, ...Array(column.colSpan - 1).fill({})]);
          }
          else { // render columns
            if (typeof (column.value) != "object") {
              let col = new Content({
                text: column.value,
                colSpan: column.colSpan,
                ...this.setViewStyles({ ...column.style, ...row.styles })
              })
                .params;
              if (column.colSpan > 1) {
                contentRow.push(...[col, ...Array(column.colSpan - 1).fill({})]);
              } else {
                contentRow.push(col);
              }
            }
          }
        });
        if (contentRow.length > 0) {
          tableContent.push(contentRow);
        }
      }
    });

    return tableContent;
  }

  exportToPDF() {
    let width = 40;
    let widths = Array(19).fill('auto')

    let body = this.createPDFMakeData();
    // console.log("[body]", body);
    var docDefinition = {
      defaultStyle: {
        fontSize: 9,
        alignment: 'justify'
      },
      // pageSize: {
      //   width: (width * 17),
      //   height: 1200
      // },
      pageMargins: [10, 10, 10, 5],
      content: [
        {
          layout: {
            hLineColor: function (i) {
              return '#c7c7c7';
            },
            vLineColor: function (i) {
              return '#c7c7c7';
            }
          },
          table: {
            widths,
            headerRows: 1,
            body
          }
        }
      ]
    };
    // console.log("export to pdf", docDefinition);
    pdfMake.createPdf(docDefinition).download("reports" + new Date().valueOf());
  }

}
