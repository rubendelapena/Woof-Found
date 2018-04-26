import { Component, OnInit } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public showSignIn: boolean;
  public user: AppUser;
  private password: string;
  private confirmPassword: string;

  public states: Array<{ 'id': string, 'name': string }>;
  public cities: Array<{ 'id': string, 'name': string }>;
  private selectedCountryId: string;
  private selectedStateId: string;
  private selectedCityId: string;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.showSignIn = true;
    this.user = new AppUser();
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
   }

  ngOnInit() {
    if (this.authService.aUserIsSigned()) {
      this.router.navigate(['/home']);
    }
  }

  private toggleSignIn() {
    this.showSignIn = !this.showSignIn;
  }

  private signIn() {
    this.authService.signIn(this.user.email, this.password);
  }

  private userInfoIsValid(): boolean {

    if ((document.getElementById('user-name') as HTMLInputElement).value == '') {
      alert('Please enter your name');
      return false;
    }

    if ((document.getElementById('user-email') as HTMLInputElement).value == '') {
      alert('Please enter your email.')
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

    if (this.password == '' || this.password.length < 6) {
      alert('Please verify your password.')
      return false;
    }

    if (this.password != this.confirmPassword) {
      alert('Password confirmation does not match.')
      return false;
    }

    return true;
  }

  private signUp() {
    if (!this.userInfoIsValid()) {
      return;
    }

    this.user.name = (document.getElementById('user-name') as HTMLInputElement).value;
    this.user.email = (document.getElementById('user-email') as HTMLInputElement).value
    this.user.phoneNumber = +(document.getElementById('user-phone-number') as HTMLInputElement).value;
    this.user.location = {city: '', state: '', country: ''};
    this.user.location.city = this.cities.find(city => city.id == this.selectedCityId).name;
    this.user.location.state = this.states.find(state => state.id == this.selectedStateId).name;
    this.user.location.country = this.location.find(country => country.id == this.selectedCountryId).name;
    this.user.role = 'user';

    this.authService.signUp(this.user, this.password);
  }

  public countryChanged(event: Event) {
    this.selectedCountryId = (event.target as HTMLSelectElement).value;

    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == this.selectedCountryId).states.forEach(state => {
      this.states.push({ 'id': state.id, 'name': state.name });
    });
  }

  public stateChanged(event: Event) {
    this.selectedStateId = (event.target as HTMLSelectElement).value;

    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == this.selectedCountryId).states.find(state => state.id == this.selectedStateId).cities.forEach(city => {
      this.cities.push({ 'id': city.id, 'name': city.name });
    });
  }

  public cityChanged(event: Event) {
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
