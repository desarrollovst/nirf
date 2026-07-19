import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../interfaces/appConfig.type';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config!: AppConfig;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
        this.http.get<AppConfig>('assets/config/config.json')
        .subscribe({
            next: config => {
            this.config = config;
            resolve();
            },
            error: reject
        });
    });
  }

  get settings(): AppConfig {
    return this.config;
  }
}