import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Filter } from '../../models/Filter';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  public states: Array<{ 'id': string, 'name': string }>;
  public cities: Array<{ 'id': string, 'name': string }>;
  public breeds: Array<{ 'id': string, 'name': string }>;

  private selectedRewardId: string;

  @Output() eventFilter: EventEmitter<Filter>;

  constructor() {
    this.breeds = new Array<{ 'id': string, 'name': string }>();
    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.eventFilter = new EventEmitter<Filter>();
  }

  ngOnInit() {
  }

  public applyFilter() {

    const selectedAnimalId: string = ((document.getElementById('pet-type')) as HTMLSelectElement).value;
    const selectedBreedId: string = ((document.getElementById('pet-breed')) as HTMLSelectElement).value;
    const selectedRewardId: string = ((document.getElementById('pet-reward')) as HTMLSelectElement).value;
    const selectedCountryId: string = ((document.getElementById('pet-country')) as HTMLSelectElement).value;
    const selectedStateId: string = ((document.getElementById('pet-state')) as HTMLSelectElement).value;
    const selectedCityId: string = ((document.getElementById('pet-city')) as HTMLSelectElement).value;

    const filter: Filter = new Filter();

    if (selectedAnimalId != 'none') {
      filter.animal = this.animals.find(animal => animal.id == selectedAnimalId).name;
    } else {
      filter.animal = null;
    }

    if (selectedBreedId != 'none') {
      filter.breed = this.breeds.find(breed => breed.id == selectedBreedId).name;
    } else {
      filter.breed = null;
    }

    if (selectedCountryId != 'none') {
      filter.country = this.location.find(country => country.id == selectedCountryId).name;
    } else {
      filter.country = null;
    }

    if (selectedStateId != 'none') {
      filter.state = this.location.find(country => country.id == selectedCountryId).states.find(state => state.id == selectedStateId).name;
    } else {
      filter.state = null;
    }

    if (selectedCityId != 'none') {
      filter.city = this.location.find(country => country.id == selectedCountryId).states.find(state => state.id == selectedStateId).cities.find(city => city.id == selectedCityId).name;
    } else {
      filter.city = null;
    }

    if (selectedRewardId != 'none') {
      switch (selectedRewardId) {
        case '0':
          filter.reward = { min: 0, max: 999 };
          break;
        case '19':
          filter.reward = { min: 0, max: 20 };
          break;
        case '20':
          filter.reward = { min: 21, max: 50 };
          break;
        case '51':
          filter.reward = { min: 51, max: 100 };
          break;
        case '101':
          filter.reward = { min: 101, max: 999 };
          break;
      }
    } else {
      filter.reward = null;
    }

    this.eventFilter.emit(filter);
  }

  public changedAnimal(event: Event) {
    const selectedAnimalId = (event.target as HTMLSelectElement).value;

    this.breeds = new Array<{ 'id': string, 'name': string }>();
    this.animals.find(animal => animal.id == selectedAnimalId).breeds.forEach(breed => {
      this.breeds.push({ 'id': breed, 'name': breed });
    });
  }

  public countryChanged(event: Event) {
    const selectedCountryId = (event.target as HTMLSelectElement).value;

    this.states = new Array<{ 'id': string, 'name': string }>();
    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == selectedCountryId).states.forEach(state => {
      this.states.push({ 'id': state.id, 'name': state.name });
    });
  }

  public stateChanged(event: Event) {
    const selectedStateId = (event.target as HTMLSelectElement).value;
    const selectedCountryId: string = ((document.getElementById('pet-country')) as HTMLSelectElement).value;

    this.cities = new Array<{ 'id': string, 'name': string }>();
    this.location.find(country => country.id == selectedCountryId).states.find(state => state.id == selectedStateId).cities.forEach(city => {
      this.cities.push({ 'id': city.id, 'name': city.name });
    });
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
        'Cavalier King Charles Spaniel',
        'Chihuahua',
        'Dachshund',
        'English Cocker Spaniel',
        'English Springer Spaniel',
        'German Shepherd',
        'Golden Retriever',
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
