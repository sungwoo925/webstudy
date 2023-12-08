import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location,Review } from './location';
import { response } from 'express';
import { User } from './user';
import { environment } from './environment/environment';
import { Authresponse } from './authresponse';
import { BROWSER_STORAGE } from './storage';

@Injectable({
  providedIn: 'root'
})

export class Loc8rDataService {

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  private apiBaseUrl = environment.apiBaseUrl ;

  public getLocations(lat:number,lng:number): Promise<Location[]>{
    // const lng: number = 126.941387;
    // const lat: number = 37.463339;
    const maxDistance: number = 20000;
    const url: string = `${this.apiBaseUrl}/locations?lng=${lng}&lat=${lat}&maxDistance=${maxDistance}`;
    return this.http
              .get(url)
              .toPromise()
              .then(response => response as Location[])
              .catch(this.handleError);
  }

  public getLocationById(locationId: string): Promise<Location>{
    const url: string = `${this.apiBaseUrl}/locations/${locationId}`;
    return this.http
              .get(url)
              .toPromise()
              .then(response => response as Location)
              .catch(this.handleError);
  }

  public adddReviewByLocationId(locationId: string,formData: Review): Promise<Review>{
    const url: string = `${this.apiBaseUrl}/locations/${locationId}/reviews`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.storage.getItem('loc8r-token')}`
      })
    }
    return this.http
        .post(url,formData,httpOptions)
        .toPromise()
        .then(response=> response as any)
        .catch(this.handleError);
  }

  private handleError(error: any): Promise<any>{
    console.error('Something has gone wrong',error);
    return Promise.reject(error.message || error);
  }

  public login(user: User): Promise<Authresponse>{
    return this.makeAuthApiCall('login',user);
  }

  public register(user: User): Promise<Authresponse>{
    return this.makeAuthApiCall('register',user);
  }

  private makeAuthApiCall(urlPath: string, user:User): Promise<Authresponse>{
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url,user)
      .toPromise()
      .then(response=> response as Authresponse)
      .catch(this.handleError);
  }
  
}

