import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppUser } from '../models/AppUser';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  private post: Post;
  private actionToPerform: string;
  private petAge: number;
  private ageUnit: string;
  private localPictureUrl: string;

  private states: Array<{ 'id': string, 'name': string }>;
  private cities: Array<{ 'id': string, 'name': string }>;
  private selectedCountryId: string;
  private selectedStateId: string;
  private selectedCityId: string;

  private selectedAnimalId: string;
  private selectedBreedId: string;
  private breeds: Array<{ 'id': string, 'name': string }>;

  private publishOwnerEmail: boolean;
  private publishOwnerPhoneNumber: boolean;

  constructor(
    private loc: Location,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.breeds = new Array<{ 'id': string, 'name': string }>();
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();

    this.publishOwnerEmail = false;
    this.publishOwnerPhoneNumber = true;
    this.ageUnit = 'years';
  }

  ngOnInit() {
    this.actionToPerform = this.activatedRoute.snapshot.paramMap.get('actionToPerform');
    const postId: string = this.activatedRoute.snapshot.paramMap.get('postId');

    if (this.actionToPerform == 'add') {
      this.post = new Post();
    } else {
      this.postService.getPost(postId,
        post => {
          this.post = post;

          // Format pet's age.
          if (this.post.petAge >= 12) {
            this.petAge = (this.post.petAge / 12);
            this.ageUnit = 'years';
          } else {
            this.petAge = this.post.petAge;
            this.ageUnit = 'months';
          }

          // Set animal and breed.
          this.selectedAnimalId = this.animals.find(animal => animal.name == this.post.animal).id;
          this.selectedBreedId = this.animals.find(animal => animal.name == this.post.animal).breeds.find(breed => breed == this.post.breed);
          this.breeds = new Array<{ 'id': string, 'name': string }>();
          this.animals.find(animal => animal.id == this.selectedAnimalId).breeds.forEach(breed => {
            this.breeds.push({ 'id': breed, 'name': breed });
          });

          // Set location.
          this.selectedCountryId = this.location.find(country => country.name == this.post.lostPlace.country).id;
          this.states = this.location.find(country => country.name == this.post.lostPlace.country).states;
          this.selectedStateId = this.location.find(country => country.name == this.post.lostPlace.country).states.find(state => state.name == this.post.lostPlace.state).id;
          this.cities = this.location.find(country => country.name == this.post.lostPlace.country).states.find(state => state.name == this.post.lostPlace.state).cities;
          this.selectedCityId = this.location.find(country => country.name == this.post.lostPlace.country).states.find(state => state.name == this.post.lostPlace.state).cities.find(city => city.name == this.post.lostPlace.city).id;
        },
        errorMessage => {
          console.error(errorMessage);
        }
      );
    }

    this.authService.getLoggedUser(
      user => {
        this.post.userId = user.id;
        this.post.ownerContactInfo = { name: user.name, email: user.email, phoneNumber: user.phoneNumber };
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  private postIsValid(): boolean {

    if (this.post.petName == '') {
      alert('Please enter your pet\'s name');
      return false;
    }

    if ((document.getElementById('pet-age') as HTMLInputElement).value == '') {
      alert('Please enter your pet\'s age.')
      return false;
    }

    if ((document.getElementById('pet-reward') as HTMLInputElement).value == '') {
      alert('Please enter a reward, it can be $0.')
      return false;
    }
    
    if ((document.getElementById('pet-type') as HTMLSelectElement).value == 'none') {
      alert('Please select an animal type.');
      return false;
    }

    if ((document.getElementById('pet-breed') as HTMLSelectElement).value == 'none') {
      alert('Please select a breed.');
      return false;
    }

    if (!this.post.lostDate) {
      alert('Please enter the date your pet got lost.');
      return false;
    }
    

    if ((document.getElementById('pet-country') as HTMLSelectElement).value == 'none') {
      alert('Please select a country.');
      return false;
    }

    if ((document.getElementById('pet-state') as HTMLSelectElement).value == 'none') {
      alert('Please select a state.');
      return false;
    }

    if ((document.getElementById('pet-city') as HTMLSelectElement).value == 'none') {
      alert('Please select a city.');
      return false;
    }

    if ((document.getElementById('pet-description') as HTMLSelectElement).value == 'none') {
      alert('Please enter a brief description of your pet.');
      return false;
    }

    if (!this.publishOwnerEmail && !this.publishOwnerPhoneNumber) {
      alert('You need to publish either your email or phone number, this is for people to contact you in case someone finds your pet.');
      return false;
    }

    if (this.publishOwnerEmail && ((document.getElementById('owner-email') as HTMLSelectElement).value == '')) {
      alert('If selected, please enter your email.');
      return false;
    }

    if (this.publishOwnerPhoneNumber && ((document.getElementById('owner-phone-number') as HTMLSelectElement).value == '')) {
      alert('If selected, please enter your phone number.');
      return false;
    }

    return true;
  }

  private goBack() {
    this.loc.back();
  }

  private serPictureUrl(event) {
    this.localPictureUrl = event.target.files[0];
  }

  private addPost() {

    if (!this.postIsValid()) {
      return false;
    }    

    this.post.animal = this.animals.find(animal => animal.id == this.selectedAnimalId).name;
    this.post.breed = this.breeds.find(breed => breed.id == this.selectedBreedId).name;
    this.post.createdAt = Date.now();
    this.post.lostDate = new Date(this.post.lostDate).getTime();
    this.post.lostPlace.city = this.cities.find(city => city.id == this.selectedCityId).name;
    this.post.lostPlace.state = this.states.find(state => state.id == this.selectedStateId).name;
    this.post.lostPlace.country = this.location.find(country => country.id == this.selectedCountryId).name;

    if (this.ageUnit == 'years') {
      this.post.petAge = 12 * this.petAge;
    } else {
      this.post.petAge = this.petAge;
    }

    if (!this.publishOwnerPhoneNumber) {
      this.post.ownerContactInfo.phoneNumber = null;
    }

    if (!this.publishOwnerEmail) {
      this.post.ownerContactInfo.email = null;
    }

    if (this.actionToPerform == 'add') {
      this.postService.addPost(this.post, this.localPictureUrl,
        successMessage => {
          console.log(successMessage);
          this.goBack();
        },
        errorMessage => {
          console.error(errorMessage);
          alert('There was an error adding your post, please try again.');
        }
      );
    } else {
      this.postService.updatePost(this.post,
        successMessage => {
          console.log(successMessage);
          this.goBack();
        },
        errorMessage => {
          console.error(errorMessage);
          alert('There was an error updating your post, please try again.');
        }
      );
    }
  }

  private changeAgeUnit(event: Event) {
    this.ageUnit = (event.target as HTMLSelectElement).value;
  }

  private changedAnimal(event: Event) {
    this.selectedAnimalId = (event.target as HTMLSelectElement).value;

    this.breeds = new Array<{ 'id': string, 'name': string }>();
    this.animals.find(animal => animal.id == this.selectedAnimalId).breeds.forEach(breed => {
      this.breeds.push({ 'id': breed, 'name': breed });
    });
  }

  private changedBreed(event: Event) {
    this.selectedBreedId = (event.target as HTMLSelectElement).value;
  }

  private countryChanged(event: Event) {
    this.selectedCountryId = (event.target as HTMLSelectElement).value;

    this.selectedStateId = null;
    this.selectedCityId = null;
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == this.selectedCountryId).states.forEach(state => {
      this.states.push({ 'id': state.id, 'name': state.name });
    });
  }

  private stateChanged(event: Event) {
    if (this.states.length > 0) {
      this.selectedStateId = (event.target as HTMLSelectElement).value;

      this.selectedCityId = null;
      this.cities = new Array<{ 'id': string, 'name': string }>();
      this.location.find(country => country.id == this.selectedCountryId).states.find(state => state.id == this.selectedStateId).cities.forEach(city => {
        this.cities.push({ 'id': city.id, 'name': city.name });
      });
    }
  }

  private cityChanged(event: Event) {
    if (this.cities.length > 0) {
      this.selectedCityId = (event.target as HTMLSelectElement).value;
    }
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

  private animals = [
    {
      'id': 'cat',
      'name': 'Cat',
      'breeds': [
        'Abyssinian',
        'American Shorthair',
        'Burmese',
        'Exotic Shorthair',
        'Himalayan',
        'Maine Coon Cat',
        'Persian',
        'Ragdoll',
        'Siamese'
      ]
    },
    {
      'id': 'chicken',
      'name': 'Chicken',
      'breeds': [
        'Ancona',
        'Barnevelder',
        'Hamburg',
        'Hybrid',
        'Leghorn',
        'Orpington',
        'Plymouth Rock',
        'Rhode Island Red',
        'Sussex'
      ]
    },
    {
      'id': 'dog',
      'name': 'Dog',
      'breeds': [
        'Beagle',
        'Border Terrier',
        'Boxer',
        'Boxer',
        'Cavalier King Charles Spaniel',
        'Chihuahua',
        'Dachshund',
        'English Cocker Spaniel',
        'English Springer Spaniel',
        'German Shepherd',
        'German Shepherd',
        'Golden Retriever',
        'Golden Retriever',
        'Labrador Retriever',
        'Labrador Retriever',
        'Miniature Schnauzer',
        'Poodle',
        'Shih Tzu',
        'Staffordshire Bull Terrier',
        'West Highland White Terrier',
        'Yorkshire Terrier'
      ]
    },
    {
      'id': 'donkey',
      'name': 'Donkey',
      'breeds': [
        'American mammoth',
        'Amiatina',
        'Asinara',
        'Asno de las Encartaciones',
        'Bourbonnais',
        'Grand Noir du Berry',
        'Poitou',
        'Provence',
        'Pyrenean',
        'Zamorano-Leones '
      ]
    },
    {
      'id': 'duck',
      'name': 'Duck',
      'breeds': [
        'Ancona duck',
        'Blue Swedish ducks',
        'Crested Duck',
        'Indian Runner Duck',
        'Muscovy Duck',
        'Pomeranian ducks',
        'Rouen duck',
        'Silver Appleyard Duck',
        'Welsh Harlequin'
      ]
    },
    {
      'id': 'goat',
      'name': 'Goat',
      'breeds': [
        'Alpine',
        'Angora',
        'Boer',
        'Golden Guernsey',
        'Kashmir',
        'Kiko',
        'LaMancha',
        'Myotonic',
        'Nubian',
        'Nubian',
        'Oberhalsi',
        'Saanen',
        'Spanish',
        'Toggenburg'
      ]
    },
    {
      'id': 'goose',
      'name': 'Goose',
      'breeds': [
        'African',
        'Chinese Geese',
        'Egyptian',
        'Embden',
        'Pilgrim',
        'Sebastopol Geese',
        'The American Buff',
        'The Buff Back Geese',
        'The Canada Goose',
        'Toulouse'
      ]
    },
    {
      'id': 'guinea-pig',
      'name': 'Guinea Pig',
      'breeds': [
        'Abyssinian',
        'American',
        'Coronet',
        'Hairless',
        'Lunkarya',
        'Merino (English Merino)',
        'Peruvian',
        'Satin versions',
        'Sheba (Sheba Mini Yak)',
        'Silkie',
        'Teddy',
        'Texel',
        'White Crested'
      ]
    },
    {
      'id': 'horse',
      'name': 'Horse',
      'breeds': [
        'Andalusian',
        'Appaloosa',
        'Arabian',
        'Miniature Horse',
        'Morgan',
        'Paint',
        'Quarter Horse',
        'Tennessee Walker',
        'Thoroughbred',
        'Warmblood'
      ]
    },
    {
      'id': 'sheep',
      'name': 'Sheep',
      'breeds': [
        'Blackface',
        'Columbia',
        'East Friesian',
        'Katahdin',
        'Merino',
        'Polypay',
        'Rambouillet',
        'Romney',
        'Southdown',
        'Texel'
      ]
    },
    {
      'id': 'pig',
      'name': 'Pig',
      'breeds': [
        'Berkshire',
        'Chester White',
        'Duroc',
        'Hampshire',
        'Landrace',
        'Yorkshire'
      ]
    },
    {
      'id': 'rabbit',
      'name': 'Rabbit',
      'breeds': [
        'Dutch',
        'Florida white',
        'Himalayan',
        'Jersey wooly',
        'Mini lop',
        'Mini Rex',
        'Rex',
        'Stain',
        'The Havana',
        'The Holland Lop'
      ]
    },
  ];
}
