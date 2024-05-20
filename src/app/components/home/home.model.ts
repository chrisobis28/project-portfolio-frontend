import { Observable, of } from 'rxjs';
import { Project } from '../../classes';

export class Model {
   
    projectList: Observable<Project[]> = of([])
    initialize(projects: Observable<Project[]>): void {
    
    this.projectList = projects  

    }


}