import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable'

export interface Todo{
  id: number;
  title: string;
  completed: boolean;
  createdDate: Date;
  priority: boolean;
  subTasks: SubTask[];
}

export interface SubTask{
  id: number;
  title: string;
  priority: boolean;
}

@Component({
  selector: 'app-pdf-export',
  templateUrl: './pdf-export.page.html',
  styleUrls: ['./pdf-export.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})

export class PdfExportPage implements OnInit {

  constructor() { }

  todos: Todo[] = [];

  ngOnInit() {
    for(let index = 0; index < 100; index++){
      const newTodo: Todo = {
        id: index,
        title: 'Todo ' + (index + 1),
        completed: Math.random() < 0.5,
        createdDate: new Date(),
        priority: Math.random() < 0.5,
        subTasks: []
      };
      
      for(let index = 0; index < Math.random() * (5); index++){
        const newSubtask: SubTask = {
          id: index,
          title: 'Subtask ' + (index + 1),
          priority: Math.random() < 0.5,
        }
        newTodo.subTasks.push(newSubtask);
      }
      this.todos.push(newTodo);
    };
  }

  generatePDF() {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4'
    });
    const tableData = [];
    let totalPagesExp = '{total_pages_count_string}' 

    for (const todo of this.todos) {
      // Create the main row for the Todo item
      const mainRow = [
        todo.title, 
        todo.completed? 'Yes' : 'No', 
        todo.createdDate.toLocaleString(), 
        todo.priority? 'High' : 'Low'
      ];

      // Check if there are any subTasks for this Todo item
      if (todo.subTasks.length > 0) {
        tableData.push(mainRow);
        // Add a row for each subTask
        for (const subTask of todo.subTasks) {
          tableData.push([{content: "\t" + subTask.title, colSpan: 3}, subTask.priority? 'High' : 'Low']);
        }
      } else {
        // If there are no subTasks, just add the main row
        tableData.push(mainRow);
      }
    }

    autoTable(doc ,{
      head: [['Title', 'Completed', 'Created Date', 'Priority']],
      body: tableData,
      theme: 'grid',
      headStyles: { valign: 'middle', halign: 'center', fillColor: [125, 125, 125]}, // Set background color for header row
      bodyStyles: { valign: 'middle', halign: 'center', fillColor: [255, 255, 255]}, // Set vertical alignment for table cells
      didDrawPage: (data) => {
        // Header
        doc.setFontSize(20);
        doc.setFont('times', 'bold');
        doc.text('TODO LIST', doc.internal.pageSize.getWidth() / 2, 25, {align: 'center'});
        
        //Footer
        let str = `${data.pageNumber}`
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
          str = str + ' / ' + totalPagesExp
        }
        doc.setFont('times', 'bold');
        doc.setFontSize(10);
        doc.text(str, (doc.internal.pageSize.getWidth() / 2) + 50 , doc.internal.pageSize.getHeight() - 20, {align: 'center'});
      },
      columnStyles: {
        0: {
          halign: 'left',
          minCellWidth: 250,
        },
        2: {
          cellWidth: 'wrap',
        }
    }});

    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp)
    }

    doc.save('todos.pdf');
  }
}
