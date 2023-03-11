import { Component,Input,SimpleChanges,Output,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherInfo } from 'src/models/WeatherInfo';
import { Observable } from 'rxjs';

@Component({
  selector: 'middle',
  templateUrl: './middle.component.html',
  styleUrls: ['./middle.component.scss']
})
export class MiddleComponent  {
  private LOCATIONAPIURL: string = 'https://api.ipregistry.co/2a03:7380:308d:4754:e41d:a95f:2552:61aa?key=m7smi2w69ze2q77w';
  private WEATHEARAPIURL: string = 'https://api.openweathermap.org/data/2.5/forecast?q=}&units=metric&appid=d8586230c8514cf851fb224acce09e95';
  private weekday: Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  public weatherInfo: Array<WeatherInfo> = [];
  public weatherforDays: Array<WeatherInfo> = [];

  @Input() city: string = '';

  constructor(private http: HttpClient) {
    window.onload = () => {
      this.carousel();
    }
    
    this.getCity().subscribe(data => {
      this.getWeatherForecast(data.location.city);
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    this.getWeatherForecast(this.city);
  }

  getWeatherForecast(newCity: string) {
    this.city = newCity;
    this.WEATHEARAPIURL = `https://api.openweathermap.org/data/2.5/forecast?q=${newCity}&units=metric&appid=d8586230c8514cf851fb224acce09e95`;

    this.getWeatherInfo().subscribe(out => {
      let weatherInfo: Array<WeatherInfo> = [];

        for (let i = 0; i < out.list.length; i++) {
          let temp = Math.round(out.list[i].main.temp) + '°C';
          let icon = this.getWeathericon(out.list[i].weather[0].main);
          let date = this.weekday[new Date(out.list[i].dt_txt).getDay()] + ' ' +
            (new Date(out.list[i].dt_txt).getMonth() + 1) + '.' + new Date(out.list[i].dt_txt).getDate();
          let time = ((new Date(out.list[i].dt_txt).getHours().toString()).length > 1 ? new Date(out.list[i].dt_txt).getHours() :
            "0" + new Date(out.list[i].dt_txt).getHours()) + ":" + 
            ((new Date(out.list[i].dt_txt).getMinutes().toString()).length > 1 ? new Date(out.list[i].dt_txt).getMinutes() :
              "0" + new Date(out.list[i].dt_txt).getMinutes());

          weatherInfo.push({
            temperature: temp,
            date: date,
            icon: icon,
            time: time,
          } as WeatherInfo);
        }

        this.weatherInfo = weatherInfo;
        this.getWeatherForDay();
    });
  }

  carousel() {
    const gap = 16;

    const carousel = document.getElementById('carousel');
    const content = document.getElementById('content');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');

    next?.addEventListener("click", e => {
      carousel?.scrollBy(width + gap, 0);
      if (carousel?.scrollWidth !== 0) {
        prev!.style.display = "flex";
      }
      if (content!.scrollWidth - width - gap <= carousel!.scrollLeft + width) {
        next.style.display = "none";
      }
    });

    prev?.addEventListener("click", e => {
      carousel?.scrollBy(-(width + gap), 0);
      if (carousel!.scrollLeft - width - gap <= 0) {
        prev.style.display = "none";
      }
      if (content!.scrollWidth - width - gap <= carousel!.scrollLeft + width) {
        next!.style.display = "flex";
      }
    });

    let width = carousel!.offsetWidth;
    window.addEventListener("resize", e => (width = carousel!.offsetWidth));
  }

  getWeatherInfo(): Observable<any> {
    return this.http.get(this.WEATHEARAPIURL)
  }

  getCity(): Observable<any> {
    return this.http.get(this.LOCATIONAPIURL)
  }

  getWeathericon(weather: string) {
    switch (weather) {
      case "Thunderstorm":
        return "fas fa-poo-storm";
      case "Drizzle":
        return "fas fa-cloud-rain";
      case "Rain":
        return "fas fa-cloud-sun-rain";
      case "Snow":
        return "far fa-snowflake";
      case "Clear":
        return "fas fa-sun";
      case "Clouds":
        return "fas fa-cloud-sun";
      default:
        return "fas fa-smog";
    }
  }

  getWeatherForDay(){
    let count = 0;
    let date = this.weatherInfo[0].date;
    let temp = 0
    for(let i =0;i<this.weatherInfo.length;i++){
      if(date == this.weatherInfo[i].date)
      {
        temp += parseInt(this.weatherInfo[i].temperature);
        count++;
      }
      else{
        let tempString =  (temp/count).toString();
        this.weatherforDays.push({
          temperature: tempString,
          date: date,
          icon: "0",
          time: "0",
        } as WeatherInfo);
        date = this.weatherInfo[i].date;
        temp = parseInt(this.weatherInfo[i].temperature);
        count = 1;
      }
    }
    let tempString =  (temp/count).toString();
    this.weatherforDays.push({
      temperature: tempString,
      date: date,
      icon: "0",
      time: "0",
    } as WeatherInfo);
  }
}

