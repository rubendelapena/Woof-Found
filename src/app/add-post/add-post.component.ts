import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post';
import { PostService } from '../services/post.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  private post: Post;
  private actionToPerform: string;
  private selectedCountry: string;
  private selectedState: string;
  private selectedCity: string;
  private selectedAnimalValue: string;
  private breeds: string[];

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private postService: PostService
  ) { 
    this.breeds = new Array<string>();
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
  }

  private postIsValid(): boolean {
    return true;
  }

  private addPost() {
    this.postService.addPost(this.post, 
      successMessage => {
        console.log(successMessage);
      },
      errorMessage => {
        console.error(errorMessage);
      }
    );
  }

  private changedAnimal(event: Event) {
    this.selectedAnimalValue = (event.target as HTMLSelectElement).value;
    this.breeds = this.allBreeds[this.selectedAnimalValue];
  }

  private allBreeds = {
    'cat': [
      'Abyssinian',
      'American Shorthair',
      'Burmese',
      'Exotic Shorthair',
      'Himalayan',
      'Maine Coon Cat',
      'Persian',
      'Ragdoll',
      'Siamese'
    ],
    'chicken': [
      'Ancona',
      'Barnevelder',
      'Hamburg',
      'Hybrid',
      'Leghorn',
      'Orpington',
      'Plymouth Rock',
      'Rhode Island Red',
      'Sussex'
    ],
    'dog': [
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
    ],
    'donkey': [
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
    ],
    'duck': [
      'Ancona duck',
      'Blue Swedish ducks',
      'Crested Duck',
      'Indian Runner Duck',
      'Muscovy Duck',
      'Pomeranian ducks',
      'Rouen duck',
      'Silver Appleyard Duck',
      'Welsh Harlequin'
    ],
    'goat': [
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
    ],
    'goose': [
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
    ],
    'guinea-pig': [
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
    ],
    'horse': [
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
    ],
    'sheep': [
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
    ],
    'pig': [
      'Berkshire',
      'Chester White',
      'Duroc',
      'Hampshire',
      'Landrace',
      'Yorkshire'
    ],
    'rabbit': [
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
  }
}
