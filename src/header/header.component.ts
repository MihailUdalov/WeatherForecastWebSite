import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  public LocationCity: string = '';
  public LocationCountry: string = '';
  private URL: string ='https://api.ipregistry.co/2a03:7380:308d:4754:e41d:a95f:2552:61aa?key=m7smi2w69ze2q77w'

  @Output() city = new EventEmitter<string>();

  updateCity(newCity: string) {
    this.city.emit(newCity);
  }

  constructor(private http: HttpClient) {

    this.getUserLocation().subscribe(data => {
      this.LocationCity = data.location.city
      this.LocationCountry = data.location.country.name
     });
  }

  getUserLocation(): Observable<any> {
     return this.http.get(this.URL)
  }
}
