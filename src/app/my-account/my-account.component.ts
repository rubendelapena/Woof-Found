import { Component, OnInit } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  private user: AppUser;
  
  private states: Array<{ 'id': string, 'name': string }>;
  private cities: Array<{ 'id': string, 'name': string }>;
  private selectedCountryId: string;
  private selectedStateId: string;
  private selectedCityId: string;

  constructor(private userService: UserService) {
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
   }

  ngOnInit() {
    this.userService.getLoggedUser(
      user => {
        if (user) {
          this.user = user;
          this.userService.getUserPosts(this.user.id,
            posts => {
              this.user.posts = posts;
            },
            errorMessage => {
              console.error(errorMessage);
            }
          );
        } else {
          // Redirect to sign in.
        }
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );    
  }

  private saveChanges() {
    this.user.birthday = new Date(this.user.birthday).getTime();
  }

  private countryChanged(event: Event) {
    this.selectedCountryId = (event.target as HTMLSelectElement).value;
    
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == this.selectedCountryId).states.forEach(state => {
      this.states.push({ 'id': state.id, 'name': state.name });
    });
  }

  private stateChanged(event: Event) {
    this.selectedStateId = (event.target as HTMLSelectElement).value;

    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == this.selectedCountryId).states.find(state => state.id == this.selectedStateId).cities.forEach(city => {
      this.cities.push({ 'id': city.id, 'name': city.name });
    });
  }

  private cityChanged(event: Event) {
    this.selectedCityId = (event.target as HTMLSelectElement).value;
  }

  private location = [
    {
      'id': 'CA',
      'name': 'Canada',
      'states': [
        {
          'id': 'ONT',
          'name': 'Ontario',
          'cities': [
            {
              'id': 'OTA',
              'name': 'Ottawa'
            },
            {
              'id': 'TOR',
              'name': 'Toronto'
            }
          ]
        },
        {
          'id': 'QBC',
          'name': 'Quebec',
          'cities': [
            {
              'id': 'QCC',
              'name': 'Quebec City'
            },
            {
              'id': 'MON',
              'name': 'Montreal'
            }
          ]
        }
      ]
    },
    {
      'id': 'MX',
      'name': 'México',
      'states': [
        {
          'id': 'NLE',
          'name': 'Nuevo León',
          'cities': [
            {
              'id': 'MTY',
              'name': 'Monterrey'
            },
            {
              'id': 'SPG', 
              'name': 'San Pedro Garza García'
            },
            {
              'id': 'APO', 
              'name': 'Apodaca'
            },
            {
              'id': 'ESC', 
              'name': 'Escobedo'
            },
            {
              'id': 'GPE', 
              'name': 'Guadalupe'
            },
            {
              'id': 'SCA', 
              'name': 'Santa Catarina'
            }
          ]
        },
        {
          'id': 'JAL',
          'name': 'Jalisco',
          'cities': [
            {
              'id': 'GDL',
              'name': 'Guadalajara'
            },
            {
              'id': 'ZAP',
              'name': 'Zapopan'
            },
            {
              'id': 'TLQ',
              'name': 'Tlaquepaque'
            },
            {
              'id': 'TON',
              'name': 'Tonalá'
            }
          ]
        }
      ]
    },
    {
      'id': 'US',
      'name': 'United States',
      'states': [
        {
          'id': 'TEX',
          'name': 'Texas',
          'cities': [
            {
              'id': 'DAL',
              'name': 'Dallas'
            },
            {
              'id': 'HOU',
              'name': 'Houston'
            }
          ]
        },
        {
          'id': 'NYK',
          'name': 'New York',
          'cities': [
            {
              'id': 'NYC',
              'name': 'New York City'
            },
            {
              'id': 'ALB',
              'name': 'Albany'
            }
          ]
        }
      ]
    }
  ];

}
