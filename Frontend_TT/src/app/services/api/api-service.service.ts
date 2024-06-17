import { Injectable } from '@angular/core';
import { Config } from 'config-app';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private config?: Config; 

  constructor() {
  }
  
  // Root endpoint
  public url = `http:///api/v1`;
  
}
