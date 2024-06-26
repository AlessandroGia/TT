import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private ip = "192.168.43.153"
  private port = "8080"

  constructor() { }
  
  // Root endpoint
  public url = `http://${this.ip}:${this.port}/api/v1`;
  
}
