import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute , private loginservice: LoginService,public router: Router, private storage: Storage) { }

  ngOnInit() {
   //this.folder = this.activatedRoute.snapshot.paramMap.get('id');
   if (!this.loginservice.isAuthenticated()){
    this.router.navigate(['login']);
   }
  }
  
  clearStorage() {
    this.storage.clear();
    this.router.navigate(['login']);
  }

}
