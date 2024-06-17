import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor() { }
  
  // Root endpoint
  public url = "http://192.168.0.109:8080/api/v1";
  
}
