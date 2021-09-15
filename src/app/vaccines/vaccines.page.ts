import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-folder',
  templateUrl: './vaccines.page.html',
  styleUrls: ['./vaccines.page.scss'],
})
export class VaccinesPage implements OnInit {
  public folder: string;
  ishidden = true;
  vaccinesData = [
    {
    name:"Chickenpox",
    description:"Your child needs 2 doses of chickenpox vaccine. The first dose is given at 12–15 months and the second at 4–6 years.",
    ishidden: true
    },
    {
      name:"Diphtheria",
      description:"Your child needs 5 doses of DTaP vaccine. The first dose is given at 2 months, the second at 4 months,the third at 6 months, the fourth at 15–18 months, and the fifth at 4–6 years.",
      ishidden: true
      },
      {
        name:"Hepatitis A ",
        description:"Your child needs 2 doses of hepatitis A vaccine. The first dose is given at age 1 year and the second 6–18 months later",
        ishidden: true
        },
        {
          name:"Chickenpox",
          description:"Your child needs 2 doses of chickenpox vaccine. The first dose is given at 12–15 months and the second at 4–6 years.",
          ishidden: true
          },
          {
            name:"Diphtheria",
            description:"Your child needs 5 doses of DTaP vaccine. The first dose is given at 2 months, the second at 4 months,the third at 6 months, the fourth at 15–18 months, and the fifth at 4–6 years.",
            ishidden: true
            },
            {
              name:"Hepatitis A ",
              description:"Your child needs 2 doses of hepatitis A vaccine. The first dose is given at age 1 year and the second 6–18 months later",
              ishidden: true
              },
              {
                name:"Chickenpox",
                description:"Your child needs 2 doses of chickenpox vaccine. The first dose is given at 12–15 months and the second at 4–6 years.",
                ishidden: true
                },
                {
                  name:"Diphtheria",
                  description:"Your child needs 5 doses of DTaP vaccine. The first dose is given at 2 months, the second at 4 months,the third at 6 months, the fourth at 15–18 months, and the fifth at 4–6 years.",
                  ishidden: true
                  },
                  {
                    name:"Hepatitis A ",
                    description:"Your child needs 2 doses of hepatitis A vaccine. The first dose is given at age 1 year and the second 6–18 months later",
                    ishidden: true
                    },
                    {
                      name:"Chickenpox",
                      description:"Your child needs 2 doses of chickenpox vaccine. The first dose is given at 12–15 months and the second at 4–6 years.",
                      ishidden: true
                      },
                      {
                        name:"Diphtheria",
                        description:"Your child needs 5 doses of DTaP vaccine. The first dose is given at 2 months, the second at 4 months,the third at 6 months, the fourth at 15–18 months, and the fifth at 4–6 years.",
                        ishidden: true
                        },
                        {
                          name:"Hepatitis A ",
                          description:"Your child needs 2 doses of hepatitis A vaccine. The first dose is given at age 1 year and the second 6–18 months later",
                          ishidden: true
                          }
]

  constructor(private activatedRoute: ActivatedRoute ,public router: Router, private storage: Storage) { }

  ngOnInit() {
 
  }
  
  sethidden(index){
    this.vaccinesData[index].ishidden = !this.vaccinesData[index].ishidden;
  }

}
