import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MUWeatherForecast';

   public city: string = ''; 
   
  getWeatherForecast(newCity: string) {
    this.city = newCity;
  }
}


