import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpCient = inject(HttpClient);
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces(
      'http://localhost:3000/places',
      'Somthing went wrong fetching the avilable places, please try again later.'
    )
  }

  loadUserPlaces() {
     return this.fetchPlaces(
      'http://localhost:3000/user-places',
      'Somthing went wrong fetching the favoritee places, please try again later.'
    )
  }

  addPlaceToUserPlaces(placeId: string) {
     return this.httpCient.put('http://localhost:3000/user-places', {
      placeId,
    })
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpCient
    .get<{places : Place[]}>(url)
    .pipe(
      map((resData) => resData.places),
      catchError((error) => { 
        return throwError(
          () => new Error(errorMessage));
      })
    )
  }
}
