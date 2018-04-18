import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppUser } from '../models/AppUser';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  private post: Post;
  private actionToPerform: string;
  private petAge: number;

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
    private userService: UserService
  ) {
    this.breeds = new Array<{ 'id': string, 'name': string }>();
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();

    this.publishOwnerEmail = false;
    this.publishOwnerPhoneNumber = true;
  }

  ngOnInit() {
    this.actionToPerform = this.activatedRoute.snapshot.paramMap.get('actionToPerform');
    let postId: string = this.activatedRoute.snapshot.paramMap.get('postId');

    if (this.actionToPerform == 'add') {
      this.post = new Post();
    } else {
      this.postService.getPost(postId,
        post => {
          this.post = post;
        },
        errorMessage => {
          console.error(errorMessage);
        }
      );
    }

    this.userService.getLoggedUser(
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
    return true;
  }

  private goBack() {
    this.loc.back();
  }

  private addPost() {
    this.post.animal = this.animals.find(animal => animal.id == this.selectedAnimalId).name;
    this.post.breed = this.breeds.find(breed => breed.id == this.selectedBreedId).name;
    this.post.createdAt = Date.now();
    this.post.lostDate = new Date(this.post.lostDate).getTime();
    this.post.lostPlace.city = this.cities.find(city => city.id == this.selectedCityId).name;
    this.post.lostPlace.state = this.states.find(state => state.id == this.selectedStateId).name;
    this.post.lostPlace.country = this.location.find(country => country.id == this.selectedCountryId).name;

    if (((document.getElementById("age-unit")) as HTMLSelectElement).selectedIndex == 0) {
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

    console.log(this.post);


    if (this.actionToPerform == 'add') {
      this.postService.addPost(this.post,
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