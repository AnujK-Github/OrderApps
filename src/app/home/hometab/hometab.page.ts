import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ICategory } from 'src/app/_models/category';
import { ProductsService } from 'src/app/_services/products.service';

@Component({
  selector: 'app-hometab',
  templateUrl: './hometab.page.html',
  styleUrls: ['./hometab.page.scss'],
})
export class HometabPage implements OnInit {

  // categories:ICategory[]=[];
  categories:any=[];
  constructor(
    private productsService:ProductsService,
    private loadingController:LoadingController
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  
  //Gets all categories.
  getCategories()
  {
    this.loadingController
    .create({ message:"loading..."})
    .then(loadingEl => {
      loadingEl.present();
      this.productsService.getCategories().then(data => {
        this.categories =data;
        loadingEl.dismiss();
        console.log(this.categories);
      }, error => {
        console.log(error);
      });
      });
  }

}
