import { Component, Input } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { WeatherInfo } from 'src/models/WeatherInfo';

@Component({
  selector: 'weatherinfobox',
  templateUrl: './weatherinfobox.component.html',
  styleUrls: ['./weatherinfobox.component.scss']
})
export class WeatherInfoBoxComponent  {
  
  @Input() item: any;
}

