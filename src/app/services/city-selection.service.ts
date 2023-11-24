import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Elbase } from '../models/elbase.model';
import { HttpClient } from '@angular/common/http';
import { Elprof } from '../models/elprof.model';
import { Elcand } from '../models/elcand.model';
import { Elctks } from '../models/elctks.model';
import { Elpaty } from '../models/elpaty.model';

@Injectable({
    providedIn: 'root'
})
export class CitySelectionService {
    constructor(private http: HttpClient) {}

    getElbase(year: number, category: string): Observable<Elbase[]> {
        return this.http.get<Elbase[]>('/assets/' + year + '/' + category + '/elbase.json');
    }

    getElprof(year: number, category: string): Observable<Elprof[]> {
        return this.http.get<Elprof[]>('/assets/' + year + '/' + category + '/elprof.json');
    }

    getElcand(year: number, category: string): Observable<Elcand[]> {
        return this.http.get<Elcand[]>('/assets/' + year + '/' + category + '/elcand.json');
    }

    getElctks(year: number, category: string): Observable<Elctks[]> {
        return this.http.get<Elctks[]>('/assets/' + year + '/' + category + '/elctks.json');
    }

    getElpaty(year: number, category: string): Observable<Elpaty[]> {
        return this.http.get<Elpaty[]>('/assets/' + year + '/' + category + '/elpaty.json');
    }
}
