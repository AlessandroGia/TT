import { Injectable } from '@angular/core';
import { Config } from 'config-app';
import config from '../../../../config-app.json';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private _config: Config = config;

  constructor() { }
  
  // Root endpoint
  public url = `http://${this._config.ip}:${this._config.port}/api/v1`;
  
}
