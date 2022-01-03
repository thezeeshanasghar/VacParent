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
                          name:"Hepatitis B",
                          description:"Your child needs 3–4 doses of hepatitis B vaccine, depending on the brand of vaccine. The first dose is given at birth, the second at 1–2 months, the third at 4 months (if needed), and the last at 6–18 months. ",
                          ishidden: true
                          },

                          {
                            name:"Influenza",
                            description:"Everyone age 6 months and older needs influenza vaccination every fall or winter and for the rest of their lives. Some children younger than age 9 years need 2 doses. Ask your child’s healthcare provider if your child needs more than 1 dose ",
                            ishidden: true
                            },
                            {
                              name:"Meningococcal",
                              description:"Infants and children age 0–10 years with certain health conditions (such as a non-functioning spleen) need one or both meningococcal vaccines. Talk with your healthcare provider to find out if your child needs meningococcal vaccination. ",
                              ishidden: true
                              },
                              {
                                name:"Pneumococcal",
                                description:"Your child needs 4 doses of Prevnar (PCV13). The first dose is given at 2 months, the second at 4 months, the third at 6 months, and the fourth at 12–15 months. Some children also need a dose of Pneumovax (PPSV23). Ask your child’s healthcare provider if your child needs this extra protection against pneumococcal disease.",
                                ishidden: true
                                },
                                {
                                  name:"Polio",
                                  description:"Your child needs 4 doses of polio vaccine (IPV). The first dose is given at 2 months, the second at 4 months, the third at 6–18 months, and the fourth at 4–6 years.",
                                  ishidden: true
                                  },
                                  {
                                    name:"Rotavirus",
                                    description:"Your child needs 2–3 doses of rotavirus vaccine (RV), depending on the brand of vaccine. The first dose is given at 2 months, the second at 4 months, and the third (if needed) at 6 months.",
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
