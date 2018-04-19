import { Component, OnInit, state } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

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

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
  }

  ngOnInit() {
    this.authService.getLoggedUser(
      user => {
        if (user) {
          this.user = user;
          console.log(user);
          
          this.userService.getUserPosts(this.user.id,
            posts => {
              this.user.posts = posts;
              this.selectedCountryId = this.location.find(country => country.name == this.user.location.country).id;
              this.states = this.location.find(country => country.name == this.user.location.country).states;
              this.selectedStateId = this.location.find(country => country.name == this.user.location.country).states.find(state => state.name == this.user.location.state).id;
              this.cities = this.location.find(country => country.name == this.user.location.country).states.find(state => state.name == this.user.location.state).cities;
              this.selectedCityId = this.location.find(country => country.name == this.user.location.country).states.find(state => state.name == this.user.location.state).cities.find(city => city.name == this.user.location.city).id;
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

  private userInfoIsValid(): boolean {

    if (this.user.name == '') {
      alert('Please enter your name');
      return false;
    }

    if ((document.getElementById('user-email') as HTMLInputElement).value == '') {
      alert('Please enter your email.')
      return false;
    }

    if (!this.user.birthday) {
      alert('Please enter your birthday.');
      return false;
    }

    if ((document.getElementById('user-phone-number') as HTMLInputElement).value == '') {
      alert('Please enter your phone number.')
      return false;
    }

    if ((document.getElementById('user-country') as HTMLSelectElement).value == 'none') {
      alert('Please select a country.');
      return false;
    }

    if ((document.getElementById('user-state') as HTMLSelectElement).value == 'none') {
      alert('Please select a state.');
      return false;
    }

    if ((document.getElementById('user-city') as HTMLSelectElement).value == 'none') {
      alert('Please select a city.');
      return false;
    }

    return true;
  }

  private saveChanges() {

    if(!this.userInfoIsValid()) {
      return;
    }

    this.user.location.city = this.cities.find(city => city.id == this.selectedCityId).name;
    this.user.location.state = this.states.find(state => state.id == this.selectedStateId).name;
    this.user.location.country = this.location.find(country => country.id == this.selectedCountryId).name;

    this.userService.updateUser(this.user,
      successMessage => {
        console.log(successMessage);
        alert('Your changes have been saved.');
      },
      errorMessage => {
        console.error(errorMessage);
      }
    )
  }

  private countryChanged(event: Event) {
    this.selectedCountryId = (event.target as HTMLSelectElement).value;

    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == this.selectedCountryId).states.forEach(state => {
      this.states.push({ 'id': state.id, 'name': state.name });
    });
    console.log(this.states);
    
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
