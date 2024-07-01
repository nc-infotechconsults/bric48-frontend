import { Component } from '@angular/core';
import Chart, { ChartData, ChartOptions } from 'chart.js/auto';
import { MachineryDataService } from '../../services/machinery-data.service';
import { MachineryData } from '../../models/machinery-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machinery-graph',
  templateUrl: './machinery-graph.component.html',
  styleUrl: './machinery-graph.component.scss'
})
export class MachineryGraphComponent {

  machineryAlarms : MachineryData[] | null = [];
  alarmOccurrences: { [description: string]: number } = {};

  mserial = sessionStorage.getItem("mserial")

  startDate: string = ""
  endDate: string = ""

  myChart: any;

  constructor(private machineryDataService:MachineryDataService, private router: Router) { }

  async ngOnInit(){

    this.machineryAlarms = await this.machineryDataService.getDataFiltered(this.mserial!, "alarm", this.startDate, this.endDate)

    // Raggruppa gli allarmi per 'description' e conta il numero di occorrenze
    if(this.machineryAlarms){
      this.alarmOccurrences = this.calculateAlarmOccurrences(this.machineryAlarms);
    }

    this.createChart();
  }

  createChart() {
    const labels = Object.keys(this.alarmOccurrences);
    const values = Object.values(this.alarmOccurrences);
  
    // Genera nuove etichette
    const newLabels = labels.map((label, index) => `Alarm type ${index + 1}`);
  
    this.myChart = new Chart('myChart', {
      type: 'bar', // Tipo di grafico: bar, line, pie, etc.
      data: {
        labels: newLabels, // Utilizzo delle nuove etichette
        datasets: [{
          data: values, // Utilizzo dei valori del dizionario come dati
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
              font: {
                size: 12 // Imposta una dimensione del carattere più piccola per le etichette dell'asse x
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1 // Imposta la scala di 1 in 1
            },
            title: {
              display: true,
              text: '# alarms' // Etichetta per l'asse delle y
            }
          }
        },
        plugins: {
          legend: {
            display: false // Nasconde la legenda
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                // Restituisce l'etichetta originale del dizionario
                return labels[context[0].dataIndex];
              }
            }
          }
        }
      }
    });
  }
  
  
  calculateAlarmOccurrences(alarms: MachineryData[]): { [description: string]: number } {
    return alarms.reduce((acc, alarm) => {
      acc[alarm.description] = (acc[alarm.description] || 0) + 1;
      return acc;
    }, {} as { [description: string]: number });
  }

  compareDate(firstDate: string, secondDate: string): number {
    // Converti le date in formato 'gg/mm/aaaa' in oggetti Date
    let [year1, month1, day1] = firstDate.split("-");
    let [year2, month2, day2] = secondDate.split("-");
    let date1 = new Date(Number(year1), Number(month1) - 1, Number(day1));
    let date2 = new Date(Number(year2), Number(month2) - 1, Number(day2));

    // Confronta le due date
    if (date1 > date2) {
        return 1;
    } else if (date1 < date2){
        return -1;
    } else {
      return 0;
    }
  }

  // Search
  async search() {

    if(this.compareDate(this.startDate, this.endDate) == 1){
      this.reloadPage()
      window.alert("Invalid data selection!");
    }
  
    this.machineryAlarms = await this.machineryDataService.getDataFiltered(this.mserial!, "alarm", this.startDate, this.endDate)

    if (this.myChart) {
      this.myChart.destroy();
    }
    
    // Raggruppa gli allarmi per 'description' e conta il numero di occorrenze
    if(this.machineryAlarms){
      this.alarmOccurrences = this.calculateAlarmOccurrences(this.machineryAlarms);
    }

    this.createChart();
  }

  reloadPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);
  }



}
