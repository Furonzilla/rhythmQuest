import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chart } from '../models/chart.model';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(private http: HttpClient) {}

  public getChart(): Observable<Chart> {
    return this.http.get<Chart>('/assets/json/chart.json');
  }
}
