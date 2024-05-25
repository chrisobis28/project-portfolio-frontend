import {Component, OnInit} from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA} from '@angular/core';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {CarouselModule} from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import {OrderListModule} from 'primeng/orderlist';
import {Collaborator, Link, Media, Project} from "../../models/project-models";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [ChipModule,AccordionModule, BadgeModule, AvatarModule, CardModule, SplitterModule, CommonModule,TagModule,ButtonModule,CarouselModule,OrderListModule],
  templateUrl: './project-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit{
  constructor(private route: ActivatedRoute) { }
  displayLinks: Link[] = [
    {
      linkId: '1',
      name: 'Google',
      url: 'https://example.com/link1',
      requestLinkProjects: []
    },
    {
      linkId: '2',
      name: 'Wikipedia',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    },
    {
      linkId: '3',
      name: 'Linkedin',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    },
    {
      linkId: '4',
      name: 'Google Scholar',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    },
    {
      linkId: '5',
      name: 'TuDelft',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    },
    {
      linkId: '6',
      name: 'Computer Graphics',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    },
    {
      linkId: '7',
      name: 'Manchester University',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    },{
      linkId: '8',
      name: 'MIT University',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    },
    {
      linkId: '9',
      name: 'Romanian University',
      url: 'https://example.com/link2',
      requestLinkProjects: []
    }
    ]
  displayMedia: Media[] = [
    {
      mediaId: '1',
      name: 'Example PDF',
      path: '/path/to/media1',
      requestMediaProjects: []
    },
    {
      mediaId: '2',
      name: 'Video Media Type',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
    {
      mediaId: '3',
      name: 'Video Example',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
    {
      mediaId: '4',
      name: 'Explanation Video',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
    {
      mediaId: '4',
      name: 'Media 5',
      path: '/path/to/media2',
      requestMediaProjects: []
    },
  ];
  displayCollaborators: Collaborator[] = [
    {
      collaboratorId: '1',
      name: 'Cirtog Filip',
      projectsToCollaborators: [],
      requestCollaboratorsProjects: []
    },
    {
      collaboratorId: '2',
      name: 'Paramon Bogdan',
      projectsToCollaborators: [],
      requestCollaboratorsProjects: []
    },
    {
      collaboratorId: '2',
      name: 'Ionescu Luca',
      projectsToCollaborators: [],
      requestCollaboratorsProjects: []
    },
    {
      collaboratorId: '2',
      name: 'Anton Paul',
      projectsToCollaborators: [],
      requestCollaboratorsProjects: []
    },
    {
      collaboratorId: '2',
      name: 'Chris Obis',
      projectsToCollaborators: [],
      requestCollaboratorsProjects: []
    },
  ];
  displayProject: Project = {
    projectId: "123456",
    title: "Large-scale dose evaluation of deep learning organ contours in head-and-neck radiotherapy by leveraging existing plans",
    description: "Background and Purpose: Retrospective dose evaluation for organ-at-risk auto-contours has previously used small cohorts due to additional manual effort required for treatment planning on auto-contours. We aimed to do this at large scale, by a) proposing and assessing an automated plan optimization workflow that used existing clinical plan parameters and b) using it for head-and-neck auto-contour dose evaluation. Materials and Methods: Our automated workflow emulated our clinic's treatment planning protocol and reused existing clinical plan optimization parameters. This workflow recreated the original clinical plan (POG) with manual contours (PMC) and evaluated the dose effect (POG - PMC) on 70 photon and 30 proton plans of head-and-neck patients. As a use-case, the same workflow (and parameters) created a plan using auto-contours (PAC) of eight head-and-neck organs-at-risk from a commercial tool and evaluated their dose effect (PMC - PAC). Results: For plan recreation (POG - PMC), our workflow had a median impact of 1.0% and 1.5% across dose metrics of auto-contours, for photon and proton respectively. Computer time of automated planning was 25% (photon) and 42% (proton) of manual planning time. For auto-contour evaluation (PMC - PAC), we noticed an impact of 2.0% and 2.6% for photon and proton radiotherapy. All evaluations had a median NTCP (Normal Tissue Complication Probability) less than 0.3%. Conclusions: The plan replication capability of our automated program provides a blueprint for other clinics to perform auto-contour dose evaluation with large patient cohorts. Finally, despite geometric differences, auto-contours had a minimal median dose impact, hence inspiring confidence in their utility and facilitating their clinical adoption.",
    bibtex: "custom-bibtex",
    archived: false,
    media: [],
    projectsToAccounts: [],
    projectsToCollaborators: [],
    tagsToProjects: [],
    links: [],
    requests: []
  };
  getCollaboratorNames(): string {
    return this.displayCollaborators.map(obj => obj.name).join(', ');
  }
  getBibTex(): string {
    return "@Article { MHCOLHHASD24,\n" +
      "  author       = \"Mody, Prerak P. and Huiskes, Merle  and Chaves de Plaza, Nicolas and Onderwater, Alice and Lamsma, Rense and\n" +
      "                  Hildebrandt, Klaus and Hoekstra, Nienke and Astreinidou, Eleftheria and Staring, Marius and Dankers, Frank\",\n" +
      "  title        = \"\tLarge-scale dose evaluation of deep learning organ contours in head-and-neck radiotherapy by leveraging\n" +
      "                  existing plans\",\n" +
      "  journal      = \"Physics and Imaging in Radiation Oncology\",\n" +
      "  year         = \"2024\",\n" +
      "  doi          = \"https://doi.org/10.1016/j.phro.2024.100572\",\n" +
      "  url          = \"http://graphics.tudelft.nl/Publications-new/2024/MHCOLHHASD24\"\n" +
      "}";
  }
  responsiveOptions: any[] | undefined;
  ngOnInit() {

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.route.params.subscribe(params => {
      console.log(params['id']);
      // Now you have access to the projectId, you can use it as needed
    });
  }

  protected readonly document = document;
}
