import { Component, Input, Optional, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherInfo } from 'src/models/WeatherInfo';
import { Chart, layouts, scales } from 'chart.js';
import { CanvasJS } from 'src/assets/canvasjs.angular.component';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent {
  private LOCATIONAPIURL: string =
    'https://api.ipregistry.co/2a03:7380:308d:4754:e41d:a95f:2552:61aa?key=m7smi2w69ze2q77w';
  private WEATHEARAPIURL: string =
    'https://api.openweathermap.org/data/2.5/forecast?q=}&units=metric&appid=d8586230c8514cf851fb224acce09e95';
  private weekday: Array<string> = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  public weatherInfo: Array<WeatherInfo> = [];
  public weatherforDays: Array<WeatherInfo> = [];

  @Input() item: any;

  public chart: any;
  constructor(private http: HttpClient) {
    window.onload = () => {
      this.chart = new CanvasJS.Chart('chartContainer', {
        title: {
          text: '',
        },
        data: [
          {
            type: 'spline',
            dataPoints: [],
          },
        ],

        fill: true,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        pointBackgroundColor: 'black',
        pointBorderColor: 'black',
        pointBorderWidth: 3,
        pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
        pointHoverBorderWidth: 10,
        backgroundColor: '#dee9f8',
        lineTension: 0.2,
        borderWidth: 2,
        pointRadius: 3,

        axisY: {
          scaleLabel: {
            display: true,
            labelString: 'Degree Celsius',
            padding: 10,
          },
          gridLines: {
            display: true,
          },
          ticks: {
            beginAtZero: false,
            max: 63,
            min: 57,
            padding: 10,
          },
        },
        axisX: {
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: false,
            padding: 10,
            autoSkip: false,
            maxRotation: 15,
            minRotation: 15,
          },
        },
      });
      this.chart.render();
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getWeatherForecast(this.item);
  }

  getWeatherForecast(newCity: string) {
    this.item = newCity;
    this.WEATHEARAPIURL = `https://api.openweathermap.org/data/2.5/forecast?q=${newCity}&units=metric&appid=d8586230c8514cf851fb224acce09e95`;

    this.getWeatherInfo().subscribe((out) => {
      let weatherInfo: Array<WeatherInfo> = [];

      for (let i = 0; i < out.list.length; i++) {
        let temp = Math.round(out.list[i].main.temp) + '°C';
        let icon = this.getWeathericon(out.list[i].weather[0].main);
        let date =
          this.weekday[new Date(out.list[i].dt_txt).getDay()] +
          ' ' +
          (new Date(out.list[i].dt_txt).getMonth() + 1) +
          '.' +
          new Date(out.list[i].dt_txt).getDate();
        let time =
          (new Date(out.list[i].dt_txt).getHours().toString().length > 1
            ? new Date(out.list[i].dt_txt).getHours()
            : '0' + new Date(out.list[i].dt_txt).getHours()) +
          ':' +
          (new Date(out.list[i].dt_txt).getMinutes().toString().length > 1
            ? new Date(out.list[i].dt_txt).getMinutes()
            : '0' + new Date(out.list[i].dt_txt).getMinutes());

        weatherInfo.push({
          temperature: temp,
          date: date,
          icon: icon,
          time: time,
        } as WeatherInfo);
      }

      this.weatherInfo = weatherInfo;
      this.getWeatherForDay();
      
      this.chart.options.data[0].dataPoints = [];
      for (let i = 0; i < this.weatherforDays.length; i++) {
        this.chart.options.data[0].dataPoints.push({
          label: this.weatherforDays[i].date,
          y: parseInt(this.weatherforDays[i].temperature),
        });
        this.chart.render();
      }
    });
  }

  getWeatherInfo(): Observable<any> {
    return this.http.get(this.WEATHEARAPIURL);
  }

  getCity(): Observable<any> {
    return this.http.get(this.LOCATIONAPIURL);
  }

  getWeathericon(weather: string) {
    switch (weather) {
      case 'Thunderstorm':
        return 'fas fa-poo-storm';
      case 'Drizzle':
        return 'fas fa-cloud-rain';
      case 'Rain':
        return 'fas fa-cloud-sun-rain';
      case 'Snow':
        return 'far fa-snowflake';
      case 'Clear':
        return 'fas fa-sun';
      case 'Clouds':
        return 'fas fa-cloud-sun';
      default:
        return 'fas fa-smog';
    }
  }

  getWeatherForDay() {
    let count = 0;
    let date = this.weatherInfo[0].date;
    let temp = 0;
    let weatherforDays: Array<WeatherInfo> = [];
    for (let i = 0; i < this.weatherInfo.length; i++) {
      if (date == this.weatherInfo[i].date) {
        temp += parseInt(this.weatherInfo[i].temperature);
        count++;
      } else {
        let tempString = (temp / count).toString();
        weatherforDays.push({
          temperature: tempString,
          date: date,
          icon: '0',
          time: '0',
        } as WeatherInfo);
        date = this.weatherInfo[i].date;
        temp = parseInt(this.weatherInfo[i].temperature);
        count = 1;
      }
    }
    let tempString = (temp / count).toString();
    weatherforDays.push({
      temperature: tempString,
      date: date,
      icon: '0',
      time: '0',
    } as WeatherInfo);
    this.weatherforDays = weatherforDays;
  }
}
