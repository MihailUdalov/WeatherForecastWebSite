export class WeatherInfo {

    temperature: string;
    date: string;
    icon: string;
    time: string;

    constructor(weatherInfo: WeatherInfo) {
        this.temperature = weatherInfo.temperature;
        this.date = weatherInfo.date;
        this.icon = weatherInfo.icon;
        this.time = weatherInfo.time;
    }
}