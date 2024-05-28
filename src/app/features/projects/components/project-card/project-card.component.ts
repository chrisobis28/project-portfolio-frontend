import { Component, Input } from '@angular/core';
import { Project } from '../../models/project-models';


@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent {
  @Input()
  project!: Project; 
  layout: string = 'list';

  styleOBJ = {'background':'radial-gradient(circle, lightgrey, white)'}
}
